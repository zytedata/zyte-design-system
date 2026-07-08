import { NextResponse } from "next/server";

import { SESSION_COOKIE, getBaseUrl, isSecureRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Clear the session cookie and send the user back to the sign-in page. */
export async function POST(request: Request): Promise<Response> {
  const response = NextResponse.redirect(
    new URL("/sign-in", getBaseUrl(request)),
    303,
  );
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

// Allow GET so a plain link can sign the user out too.
export const GET = POST;
