import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZyteLogo } from "@/components/common/zyte-logo";

export const metadata = {
  title: "Sign in",
  description: "Sign in to the Zyte Design System workspace.",
};

export default function SignInPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="text-foreground inline-flex items-center gap-2"
          >
            <ZyteLogo width={56} height={24} />
            <span className="text-sm font-semibold tracking-tight">
              {siteConfig.shortName}
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="bg-card w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
          <div className="bg-muted mx-auto inline-flex size-12 items-center justify-center rounded-full">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>

          <Badge variant="secondary" className="mt-5">
            Coming soon
          </Badge>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Authentication is not wired yet. The {siteConfig.shortName}{" "}
            workspace is open for browsing — sign-in will gate publishing,
            sync, and team-level settings once the backend is ready.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link href="/products/web">Continue to Web workspace</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
