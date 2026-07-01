import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { WEB_FOUNDATIONS } from "@zytedata/ds-web";

import { signIn } from "@/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZyteLogo } from "@/components/common/zyte-logo";

export const metadata = {
  title: "Sign in",
  description: "Sign in to the Zyte Design System workspace.",
};

// Same brand navy → fuchsia hero surface the landing page uses, so the
// sign-in screen reads as part of the marketing shell rather than a bare page.
const HERO_GRADIENT = WEB_FOUNDATIONS.colors.heroGradient.DEFAULT;
const BRAND_FUCHSIA = WEB_FOUNDATIONS.colors.primary["500"];

const brandCssVars: CSSProperties = {
  ["--brand" as string]: WEB_FOUNDATIONS.colors.primary["600"],
  ["--brand-hover" as string]: WEB_FOUNDATIONS.colors.primary["700"],
};

// Only allow same-site relative paths as the post-login destination — never a
// caller-supplied absolute/protocol-relative URL, which would be an open
// redirect. Auth.js also guards this, but we keep the local check as a belt.
function safeCallbackUrl(raw: string | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = safeCallbackUrl(callbackUrl);

  return (
    <div
      className="force-light relative flex min-h-dvh flex-col text-white"
      style={{ ...brandCssVars, background: HERO_GRADIENT }}
    >
      <header>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="inline-flex items-center gap-2"
          >
            <span style={{ color: BRAND_FUCHSIA }}>
              <ZyteLogo width={56} height={24} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">
              {siteConfig.shortName}
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="bg-card text-foreground w-full max-w-md rounded-2xl border p-8 text-center shadow-2xl">
          <div className="bg-muted mx-auto inline-flex size-12 items-center justify-center rounded-full">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>

          <Badge variant="secondary" className="mt-5">
            Zyte staff only
          </Badge>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The {siteConfig.shortName} workspace is restricted to Zyte team
            members. Sign in with your <strong>@zyte.com</strong> Google
            account to continue.
          </p>

          {error ? (
            <p className="text-destructive mt-4 text-sm" role="alert">
              {error === "AccessDenied"
                ? "That account isn’t a @zyte.com address. Sign in with your Zyte Google account."
                : "Something went wrong while signing in. Please try again."}
            </p>
          ) : null}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo });
            }}
            className="mt-6 flex flex-col gap-2"
          >
            <Button type="submit">Continue with Google</Button>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                Back to home
              </Link>
            </Button>
          </form>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-white/60 md:text-left">
        <span className="font-mono tracking-tight">
          © {new Date().getFullYear()} Zyte
          <span className="mx-2 text-white/30" aria-hidden="true">
            /
          </span>
          {siteConfig.shortName} alpha
        </span>
      </footer>
    </div>
  );
}
