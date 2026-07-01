import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Only Zyte staff may sign in. We enforce this in two layers:
//   1. Google's `hd` (hosted-domain) param nudges the account chooser to
//      zyte.com Workspace accounts.
//   2. The `signIn` callback is the real gate — `hd` is a UI hint and can be
//      bypassed, so we independently verify the returned profile is a
//      verified @zyte.com address before allowing the session.
const ALLOWED_DOMAIN = "zyte.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: ALLOWED_DOMAIN,
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      // Google returns `email_verified` and (for Workspace accounts) `hd`.
      // Require both a verified address and the exact zyte.com domain.
      return Boolean(
        profile?.email_verified &&
          email?.endsWith(`@${ALLOWED_DOMAIN}`) &&
          (profile as { hd?: string }).hd === ALLOWED_DOMAIN,
      );
    },
  },
});
