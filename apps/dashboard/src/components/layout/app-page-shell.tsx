import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppPageShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Standard content container for every in-app route.
 *
 * Matches the product Dashboard baseline so each selection (Foundations,
 * LLM / Design.md, Templates, Components, …) shares the same width,
 * gutters and vertical rhythm. Pages should not redefine `max-w-*` or
 * `pt-*` on their outermost wrapper — use this shell instead.
 */
export function AppPageShell({ children, className }: AppPageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 pt-10 pb-20 md:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
