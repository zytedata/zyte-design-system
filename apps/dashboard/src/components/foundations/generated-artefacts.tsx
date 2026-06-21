"use client";

import * as React from "react";
import { Check, Copy, Download, FileCode } from "lucide-react";

import type { GeneratedArtefact } from "@/data/foundations/docs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const MIME_BY_LANGUAGE: Record<GeneratedArtefact["language"], string> = {
  json: "application/json",
  css: "text/css",
  scss: "text/x-scss",
  javascript: "text/javascript",
};

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(value < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

export function GeneratedArtefacts({
  productLabel,
  artefacts,
}: {
  productLabel: string;
  artefacts: GeneratedArtefact[];
}) {
  const [copiedKind, setCopiedKind] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!copiedKind) return;
    const t = window.setTimeout(() => setCopiedKind(null), 1500);
    return () => window.clearTimeout(t);
  }, [copiedKind]);

  const onCopy = React.useCallback(async (artefact: GeneratedArtefact) => {
    try {
      await navigator.clipboard.writeText(artefact.content);
    } catch {
      const el = document.createElement("textarea");
      el.value = artefact.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopiedKind(artefact.kind);
  }, []);

  const onDownload = React.useCallback((artefact: GeneratedArtefact) => {
    const blob = new Blob([artefact.content], {
      type: MIME_BY_LANGUAGE[artefact.language],
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = artefact.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, []);

  if (artefacts.length === 0) {
    return (
      <article className="bg-card space-y-2 rounded-2xl border p-6">
        <Badge variant="secondary">Generated artefacts</Badge>
        <h3 className="text-lg font-semibold">No artefacts found</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Run{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            npm run tokens:build
          </code>{" "}
          to regenerate <code>dist/tokens.&#123;json,css,scss,tailwind.cjs&#125;</code>.
        </p>
      </article>
    );
  }

  const defaultKind = artefacts[0]!.kind;

  return (
    <article className="bg-card overflow-hidden rounded-2xl border">
      <header className="from-muted/40 to-card flex flex-col gap-3 border-b bg-gradient-to-br p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="uppercase tracking-wide">
                Generated
              </Badge>
              <Badge variant="outline">codegen · tokens-build</Badge>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              {productLabel} · token artefacts
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Emitted by{" "}
              <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                scripts/tokens-build.ts
              </code>{" "}
              from <code>foundations.ts</code>. Copy or download these as drop-in
              consumables for downstream apps; in Phase 2 they ship as the{" "}
              <code>@zytedata/ds-*</code> npm package contents.
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue={defaultKind} className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            {artefacts.map((artefact) => (
              <TabsTrigger
                key={artefact.kind}
                value={artefact.kind}
                className="gap-1.5 font-mono text-xs"
              >
                <FileCode className="size-3.5" />
                {artefact.kind}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {artefacts.map((artefact) => (
          <TabsContent
            key={artefact.kind}
            value={artefact.kind}
            className="mt-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 font-mono text-xs">
                <span>{artefact.filename}</span>
                <span aria-hidden>·</span>
                <span>{formatBytes(artefact.bytes)}</span>
                <span aria-hidden>·</span>
                <span>{artefact.content.split(/\r?\n/).length} lines</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(artefact)}
                  aria-label={`Copy ${artefact.filename}`}
                >
                  {copiedKind === artefact.kind ? (
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
                  size="sm"
                  onClick={() => onDownload(artefact)}
                  aria-label={`Download ${artefact.filename}`}
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-muted/40 max-h-[480px] overflow-auto rounded-xl border p-4 font-mono text-[11px] leading-relaxed">
              <code>{artefact.content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </article>
  );
}
