"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Standalone, fully self-contained routes that must render without the app's
// theme/tooltip/toaster chrome (e.g. the public share-link viewer, which only
// hosts a sandboxed iframe). Keeping next-themes out of these routes also
// avoids its inline-script being client-rendered.
const BARE_ROUTES = ["/p"];

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && BARE_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
