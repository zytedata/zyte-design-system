import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import {
  OAUTH_CALLBACK_PATH,
  buildGoogleAuthUrl,
  getBaseUrl,
  isSecureRequest,
  sanitizeReturnTo,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Short-lived cookies carrying CSRF/nonce state through the round-trip to
// Google. Ten minutes is ample for a sign-in and keeps stale state from
// lingering.
const TEMP_COOKIE_MAX_AGE = 60 * 10;

function tempCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: TEMP_COOKIE_MAX_AGE,
  };
}

function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const returnTo = sanitizeReturnTo(requestUrl.searchParams.get("returnTo"));
  const baseUrl = getBaseUrl(request);

  const state = randomToken();
  const nonce = randomToken();

  const authUrl = buildGoogleAuthUrl({
    redirectUri: `${baseUrl}${OAUTH_CALLBACK_PATH}`,
    state,
    nonce,
  });

  const response = NextResponse.redirect(authUrl);
  const options = tempCookieOptions(isSecureRequest(request));
  response.cookies.set("oauth_state", state, options);
  response.cookies.set("oauth_nonce", nonce, options);
  response.cookies.set("oauth_return_to", returnTo, options);
  return response;
}
