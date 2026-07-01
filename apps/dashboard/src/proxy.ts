import { auth } from "@/auth";

// Gate the whole app behind authentication. Unauthenticated requests are
// redirected to /sign-in; the `signIn` callback in auth.ts guarantees any
// resulting session belongs to a verified @zyte.com account.
export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  // Run on every route except Next internals, the auth API routes, the
  // sign-in page itself, and static assets — otherwise the redirect would
  // loop or block the OAuth callback.
  matcher: [
    "/((?!api/auth|sign-in|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|zip)$).*)",
  ],
};
