import Link from "next/link";
import type { CSSProperties } from "react";

import { WEB_FOUNDATIONS } from "@zytedata/ds-web";

import { ALLOWED_DOMAIN, sanitizeReturnTo } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { ZyteLogo } from "@/components/common/zyte-logo";

export const metadata = {
  title: "Sign in",
  description: "Sign in to the Zyte Design System workspace.",
};

// Brand navy → fuchsia gradient from the web design.md — the same surface the
// marketing landing hero uses.
const HERO_GRADIENT = WEB_FOUNDATIONS.colors.heroGradient.DEFAULT;

const gradientStyle: CSSProperties = { background: HERO_GRADIENT };

const ERROR_MESSAGES: Record<string, string> = {
  domain: `Only @${ALLOWED_DOMAIN} Google accounts can access this workspace.`,
  denied: "Sign-in was cancelled.",
  oauth: "Sign-in could not be verified. Please try again.",
  token: "We couldn't complete sign-in with Google. Please try again.",
};

/** Multicolor Google "G" mark for the sign-in button. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo);
  const error = params.error ? ERROR_MESSAGES[params.error] : undefined;

  const loginHref = `/api/oauth/google/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <div className="bg-background text-foreground grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel — hidden on small screens. */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={gradientStyle}
      >
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="inline-flex items-center gap-2.5"
        >
          <ZyteLogo width={64} height={28} />
          <span className="text-sm font-semibold tracking-tight">
            {siteConfig.shortName}
          </span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            The workspace for every Zyte product area.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {siteConfig.tagline}
          </p>
        </div>

        <p className="font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase">
          {siteConfig.shortName} · Internal workspace
        </p>
      </aside>

      {/* Sign-in card. */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Compact logo for the mobile layout where the brand panel is hidden. */}
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="text-foreground mb-10 inline-flex items-center gap-2 lg:hidden"
          >
            <ZyteLogo width={56} height={24} />
            <span className="text-sm font-semibold tracking-tight">
              {siteConfig.shortName}
            </span>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Continue with your <span className="font-medium">@{ALLOWED_DOMAIN}</span>{" "}
            Google account to access the {siteConfig.shortName} workspace.
          </p>

          {error ? (
            <div
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive mt-6 rounded-lg border px-3.5 py-2.5 text-sm"
            >
              {error}
            </div>
          ) : null}

          {/* Plain anchor — the login route is a GET redirect to Google. */}
          <a
            href={loginHref}
            className="bg-card text-foreground hover:bg-muted focus-visible:ring-ring/50 mt-6 inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none"
          >
            <GoogleGlyph />
            Continue with Google
          </a>

          <p className="text-muted-foreground mt-8 text-xs leading-relaxed">
            Access is restricted to Zyte team members. By continuing you agree
            to sign in with your company Google account.
          </p>
        </div>
      </main>
    </div>
  );
}
