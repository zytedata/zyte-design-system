// Framework-agnostic auth primitives — safe to import from Proxy (edge/node),
// Route Handlers, and Server Components alike. Deliberately does NOT touch
// `next/headers`; anything that needs the cookie store lives in `session.ts`.
//
// We hand-roll a minimal Google OAuth 2.0 flow rather than pull in NextAuth
// because the Google Console redirect URI is a custom path
// (`/api/oauth/google/callback`), not NextAuth's opinionated default. The
// session itself is a stateless signed JWT in an httpOnly cookie — the exact
// pattern Next.js recommends in its authentication guide (jose + HS256).

import { SignJWT, jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";

/** Name of the signed session cookie set after a successful sign-in. */
export const SESSION_COOKIE = "zyte_session";

/** Only Google Workspace accounts in this hosted domain may sign in. */
export const ALLOWED_DOMAIN = "zyte.com";

/** Path Google redirects back to — must match the Console redirect URI. */
export const OAUTH_CALLBACK_PATH = "/api/oauth/google/callback";

/** Session lifetime. Mirrored as the cookie `maxAge`. */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

// Google's public signing keys. `createRemoteJWKSet` caches the JWKS and
// refreshes on unknown key ids, so this is a module-level singleton.
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

export type SessionUser = {
  email: string;
  name?: string;
  picture?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function sessionKey(): Uint8Array {
  return new TextEncoder().encode(requireEnv("AUTH_SECRET"));
}

/**
 * Cookie options for the session cookie. `secure` is driven by the actual
 * request protocol (see `isSecureRequest`) rather than `NODE_ENV`, so any
 * HTTPS deployment gets a Secure cookie regardless of its env name, while
 * plain-http localhost dev still works.
 */
export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Sign a stateless session token for an authenticated user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ name: user.name, picture: user.picture })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(sessionKey());
}

/** Verify a session token; returns the user, or null if invalid/expired. */
export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, sessionKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    return {
      email: payload.sub,
      name: typeof payload.name === "string" ? payload.name : undefined,
      picture: typeof payload.picture === "string" ? payload.picture : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Build the Google authorization URL for the start of the OAuth flow.
 * `redirectUri` is derived per-request so it matches whichever authorized
 * origin (localhost / production) the user arrived on.
 */
export function buildGoogleAuthUrl(params: {
  redirectUri: string;
  state: string;
  nonce: string;
}): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", requireEnv("GOOGLE_CLIENT_ID"));
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  // Hint the account chooser toward Workspace accounts in our domain. This is
  // only a hint — the real enforcement is `isAllowedGoogleUser` on the verified
  // ID token below.
  url.searchParams.set("hd", ALLOWED_DOMAIN);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("access_type", "online");
  return url.toString();
}

/** Exchange an authorization code for Google's token response. */
export async function exchangeGoogleCode(params: {
  code: string;
  redirectUri: string;
}): Promise<{ id_token?: string }> {
  const body = new URLSearchParams({
    code: params.code,
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirect_uri: params.redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Verify a Google ID token against Google's JWKS, checking issuer, audience
 * (our client id), and the expected `nonce`. Returns the verified claims.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  expectedNonce: string,
): Promise<JWTPayload & { email?: string; email_verified?: boolean; hd?: string; name?: string; picture?: string }> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: GOOGLE_ISSUERS,
    audience: requireEnv("GOOGLE_CLIENT_ID"),
    // Google signs ID tokens with RS256; pin it so an attacker can't downgrade
    // the verification algorithm.
    algorithms: ["RS256"],
  });
  if (payload.nonce !== expectedNonce) {
    throw new Error("ID token nonce mismatch");
  }
  return payload;
}

/**
 * Resolve the public origin for the current request, honoring the proxy
 * headers Vercel sets. Used to build an absolute `redirect_uri` that matches
 * whichever authorized origin (localhost / production) the user is on.
 */
export function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    url.host;
  const isLoopback = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto =
    request.headers.get("x-forwarded-proto") ?? (isLoopback ? "http" : "https");
  return `${proto}://${host}`;
}

/** Whether the request is served over HTTPS — drives the cookie `Secure` flag. */
export function isSecureRequest(request: Request): boolean {
  return getBaseUrl(request).startsWith("https://");
}

/**
 * Normalize a post-auth redirect target to a safe, same-origin absolute path.
 * Resolves the value with the WHATWG URL parser (the same normalization the
 * browser applies — including backslash → slash and control-char stripping),
 * and rejects anything that resolves off-origin (e.g. `//evil`, `/\evil.com`).
 * Returns "/" for anything unsafe or missing.
 */
export function sanitizeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) return "/";
  try {
    const base = "https://sanitize.invalid";
    const resolved = new URL(value, base);
    if (resolved.origin !== base) return "/";
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return "/";
  }
}

/**
 * Authorization gate: a verified Google Workspace account whose email is
 * verified, belongs to our hosted domain (`hd`), and ends in `@zyte.com`.
 */
export function isAllowedGoogleUser(payload: {
  email?: string;
  email_verified?: boolean;
  hd?: string;
}): boolean {
  const email = (payload.email ?? "").toLowerCase();
  return (
    payload.email_verified === true &&
    payload.hd === ALLOWED_DOMAIN &&
    email.endsWith(`@${ALLOWED_DOMAIN}`)
  );
}
