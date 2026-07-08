import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Next.js 16 renamed the `middleware` file convention to `proxy`. This runs on
// every matched request before rendering and is the site-wide auth gate.
//
// Public (excluded via the matcher below): the sign-in page, the OAuth route
// handlers, Next internals/static assets, the favicon/mark, and `/fonts/*`
// (the Yellix webfont is served with permissive CORS for other Zyte
// properties to embed — gating it would break those cross-origin loads).
// The marketing landing page (`/`) is public too, handled in code below since
// the matcher can't express "the root path only".
// Exclusions are anchored (trailing `/` or end-of-path `$`) so a path that
// merely *starts* with a public name — `/sign-in-x`, `/fonts-x`,
// `/favicon.icon` — is still gated rather than silently public.
export const config = {
  matcher: [
    "/((?!api/oauth/|sign-in$|_next/|favicon\\.ico$|mark\\.svg$|fonts/).*)",
  ],
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;

  // The marketing landing page is open to everyone; only the workspaces and
  // app routes below it require a session.
  if (pathname === "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) {
    return NextResponse.next();
  }

  // Unauthenticated API calls get a 401 rather than an HTML redirect.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("returnTo", pathname + search);
  return NextResponse.redirect(signInUrl);
}
