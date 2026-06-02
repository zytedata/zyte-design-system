"use client";

import * as React from "react";

import { extractHtmlBlock } from "@/lib/markdown";
import type { ProviderId } from "@/data/studio/providers";

export type StudioBuildStatus = "idle" | "building";

type UseStudioBuildArgs = {
  productSlug: string;
  provider: ProviderId;
};

/**
 * Builds a web page from the current markdown by streaming `/api/studio/build`.
 * The markdown is the source of truth; the resulting HTML is its build, kept
 * alongside so switching views never loses work. `builtFrom` records which
 * markdown produced the current page so the UI can flag a stale build.
 */
export function useStudioBuild({ productSlug, provider }: UseStudioBuildArgs) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<StudioBuildStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [builtFrom, setBuiltFrom] = React.useState<string | null>(null);

  const argsRef = React.useRef({ productSlug, provider });
  argsRef.current = { productSlug, provider };
  const abortRef = React.useRef<AbortController | null>(null);

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setHtml(null);
    setError(null);
    setBuiltFrom(null);
    setStatus("idle");
  }, []);

  const build = React.useCallback(async (markdown: string) => {
    const source = markdown.trim();
    if (!source || abortRef.current) return;

    setError(null);
    setBuiltFrom(markdown);
    setStatus("building");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/studio/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          productSlug: argsRef.current.productSlug,
          provider: argsRef.current.provider,
          markdown: source,
        }),
      });

      if (!response.ok || !response.body) {
        let message = `Build failed (${response.status}).`;
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          // keep default
        }
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const partial = extractHtmlBlock(raw) ?? raw;
        setHtml(partial);
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      abortRef.current = null;
      setStatus("idle");
    }
  }, []);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  return { html, status, error, builtFrom, build, reset };
}
