"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Copy `value` to the clipboard with a short-lived "copied" flag.
 * Uses the async Clipboard API with a `document.execCommand` fallback for
 * older browsers / non-secure contexts.
 */
export function useCopyToClipboard(resetMs = 1200) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  const flagCopied = React.useCallback(() => {
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), resetMs);
  }, [resetMs]);

  const copy = React.useCallback(
    (value: string) => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(value).then(flagCopied, () =>
          fallbackCopy(value, flagCopied),
        );
        return;
      }
      fallbackCopy(value, flagCopied);
    },
    [flagCopied],
  );

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  return { copied, copy };
}

function fallbackCopy(value: string, onDone: () => void) {
  if (typeof document === "undefined") return;
  try {
    const el = document.createElement("textarea");
    el.value = value;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
    onDone();
  } catch {
    /* clipboard unavailable — silently no-op */
  }
}

/**
 * Wraps a swatch's visual content in a button that copies `value` (the hex)
 * on click, showing a corner badge on hover and a "Copied" confirmation after.
 * The outer element is rendered as a real <button> for keyboard accessibility.
 */
export function CopyableSwatch({
  value,
  label,
  className,
  badgeClassName,
  style,
  children,
}: {
  /** The string copied to the clipboard (e.g. the hex value). */
  value: string;
  /** Human-readable label used in the title/aria text. Defaults to `value`. */
  label?: string;
  /** Classes applied to the button wrapper (carry over the swatch's styling). */
  className?: string;
  /** Override the copy-badge position/styling (defaults to top-right). */
  badgeClassName?: string;
  /** Inline styles for the button wrapper (e.g. the swatch background). */
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { copied, copy } = useCopyToClipboard();
  const text = label ?? value;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      title={`Copy ${text}`}
      aria-label={copied ? `Copied ${text}` : `Copy ${text}`}
      style={style}
      className={cn(
        "group/copy relative block w-full cursor-pointer text-left",
        "focus-visible:ring-ring/60 focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "ring-border bg-background/90 text-foreground pointer-events-none absolute top-2 right-2 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium shadow-sm ring-1 backdrop-blur-sm transition-opacity",
          copied ? "opacity-100" : "opacity-0 group-hover/copy:opacity-100",
          badgeClassName,
        )}
      >
        {copied ? (
          <>
            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
            Copied
          </>
        ) : (
          <Copy className="size-3" />
        )}
      </span>
    </button>
  );
}
