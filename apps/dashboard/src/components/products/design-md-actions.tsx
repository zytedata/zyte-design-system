"use client";

import * as React from "react";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export type DesignMdActionsProps = {
  /** Raw markdown content of the canonical design.md. */
  content: string;
  /** Suggested download filename, e.g. `web.design.md`. */
  filename: string;
  /** Button size forwarded to the underlying Button. */
  size?: React.ComponentProps<typeof Button>["size"];
};

/**
 * Copy-to-clipboard + download buttons for a canonical `design.md`. Shared by
 * the Agentic surface and the Getting started "Vibe coding" scenario so the
 * clipboard / blob-download logic lives in one place.
 */
export function DesignMdActions({ content, filename, size = "sm" }: DesignMdActionsProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
      setCopied(true);
    }
  }, [content]);

  const onDownload = React.useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [content, filename]);

  return (
    <>
      <Button
        variant="outline"
        size={size}
        onClick={onCopy}
        aria-label="Copy design.md to clipboard"
      >
        {copied ? (
          <>
            <Check className="size-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-4" />
            Copy
          </>
        )}
      </Button>
      <Button
        variant="default"
        size={size}
        onClick={onDownload}
        aria-label="Download design.md"
      >
        <Download className="size-4" />
        Download
      </Button>
    </>
  );
}
