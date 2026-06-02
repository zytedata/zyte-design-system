"use client";

import * as React from "react";
import { AlertTriangle, Link2 } from "lucide-react";

import { decodeShareHtml } from "@/lib/share-link";

type ViewerState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; html: string };

export default function SharedPagePage() {
  const [state, setState] = React.useState<ViewerState>({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      const token = window.location.hash.replace(/^#/, "").trim();
      if (!token) {
        if (!cancelled) setState({ status: "empty" });
        return;
      }
      try {
        const html = await decodeShareHtml(token);
        if (!cancelled) setState({ status: "ready", html });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "ready") {
    return (
      <iframe
        title="Shared page"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-forms"
        className="fixed inset-0 h-full w-full border-0 bg-white"
        srcDoc={state.html}
      />
    );
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-10 text-center">
      <span className="bg-muted text-muted-foreground inline-flex size-12 items-center justify-center rounded-2xl">
        {state.status === "error" ? (
          <AlertTriangle className="size-5" />
        ) : (
          <Link2 className="size-5" />
        )}
      </span>
      {state.status === "loading" ? (
        <p className="text-muted-foreground text-sm">Unpacking shared page…</p>
      ) : state.status === "empty" ? (
        <>
          <p className="text-sm font-medium">Nothing to show</p>
          <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
            This is a share link viewer. Open a link that ends with{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">
              /p#…
            </code>{" "}
            to render its page.
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium">This link couldn’t be opened</p>
          <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
            The share link looks invalid or was truncated when it was copied.
            Ask for the full link and try again.
          </p>
        </>
      )}
    </main>
  );
}
