import { NextResponse } from "next/server";

import {
  OAUTH_CALLBACK_PATH,
  SESSION_COOKIE,
  createSessionToken,
  exchangeGoogleCode,
  getBaseUrl,
  isAllowedGoogleUser,
  isSecureRequest,
  sanitizeReturnTo,
  sessionCookieOptions,
  verifyGoogleIdToken,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Build a redirect back to the sign-in page carrying an error code. */
function signInError(baseUrl: string, code: string): NextResponse {
  const url = new URL("/sign-in", baseUrl);
  url.searchParams.set("error", code);
  const response = NextResponse.redirect(url);
  clearTempCookies(response);
  return response;
}

function clearTempCookies(response: NextResponse): void {
  for (const name of ["oauth_state", "oauth_nonce", "oauth_return_to"]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

export async function GET(request: Request): Promise<Response> {
  const baseUrl = getBaseUrl(request);
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  // Read the CSRF cookies we set at the start of the flow from the raw
  // Cookie header (the handler receives a standard `Request`).
  const cookies = parseCookies(request.headers.get("cookie"));
  const expectedState = cookies.get("oauth_state");
  const expectedNonce = cookies.get("oauth_nonce");
  const returnTo = sanitizeReturnTo(cookies.get("oauth_return_to"));

  // The user denied consent, or Google returned an error.
  if (oauthError) {
    return signInError(baseUrl, "denied");
  }

  // CSRF: the `state` echoed by Google must match the one we set.
  if (!code || !state || !expectedState || state !== expectedState || !expectedNonce) {
    return signInError(baseUrl, "oauth");
  }

  let payload;
  try {
    const { id_token } = await exchangeGoogleCode({
      code,
      redirectUri: `${baseUrl}${OAUTH_CALLBACK_PATH}`,
    });
    if (!id_token) return signInError(baseUrl, "token");
    payload = await verifyGoogleIdToken(id_token, expectedNonce);
  } catch {
    return signInError(baseUrl, "token");
  }

  if (!isAllowedGoogleUser(payload)) {
    return signInError(baseUrl, "domain");
  }

  const token = await createSessionToken({
    email: String(payload.email),
    name: payload.name,
    picture: payload.picture,
  });

  // `returnTo` is sanitized to an absolute path, but resolve + re-check the
  // origin here so the redirect target can never leave our own origin.
  const target = new URL(returnTo, baseUrl);
  const safeTarget =
    target.origin === new URL(baseUrl).origin ? target : new URL("/", baseUrl);

  const response = NextResponse.redirect(safeTarget);
  response.cookies.set(
    SESSION_COOKIE,
    token,
    sessionCookieOptions(isSecureRequest(request)),
  );
  clearTempCookies(response);
  return response;
}

/** Minimal cookie-header parser (route handler receives a plain `Request`). */
function parseCookies(header: string | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!header) return map;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (name) map.set(name, decodeURIComponent(value));
  }
  return map;
}
