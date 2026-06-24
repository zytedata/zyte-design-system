"use client";

import * as React from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  MonitorPlay,
  Palette,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { MARKDOWN_PROSE_CLASSNAME } from "@/lib/markdown";
import type { CanonicalDocPayload } from "@/data/foundations/docs";
import type { ProductFoundations } from "@zytedata/ds-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TokenSurface } from "@/components/foundations/token-surface";
import { DesignPreview } from "@/components/foundations/design-preview";

const SPEC_URL = "https://github.com/google-labs-code/design.md/blob/main/docs/spec.md";

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

/**
 * Splits a DESIGN.md into its YAML front matter (machine-readable token block)
 * and its prose body. We strip the YAML from the rendered view because
 * react-markdown does not understand front matter and would otherwise dump it
 * as a single unreadable paragraph; the same data is rendered visually in the
 * Token surface tab and verbatim in the Markdown tab.
 */
function splitDesignDoc(markdown: string): {
  frontmatter: string | null;
  body: string;
} {
  const fmMatch = markdown.match(
    /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n([\s\S]*?)\r?\n---\r?\n?/,
  );
  if (!fmMatch) return { frontmatter: null, body: markdown };
  return {
    frontmatter: fmMatch[1] ?? null,
    body: markdown.slice(fmMatch[0].length).replace(/^\r?\n+/, ""),
  };
}

type Stat = { label: string; value: string };

export type AgenticDocProps = {
  productLabel: string;
  productSlug: string;
  meta: { assetPath: string; title: string; version: string };
  doc: CanonicalDocPayload;
  bundle: ProductFoundations;
  stats: Stat[];
};

export function AgenticDoc({
  productLabel,
  productSlug,
  meta,
  doc,
  bundle,
  stats,
}: AgenticDocProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(doc.content);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = doc.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
      setCopied(true);
    }
  }, [doc.content]);

  const onDownload = React.useCallback(() => {
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [doc.content, doc.filename]);

  const lineCount = React.useMemo(
    () => doc.content.split(/\r?\n/).length,
    [doc.content],
  );

  const { frontmatter, body } = React.useMemo(
    () => splitDesignDoc(doc.content),
    [doc.content],
  );

  const fullStats: Stat[] = [
    { label: "Spec", value: `canonical v${meta.version}` },
    { label: "File size", value: formatBytes(doc.bytes) },
    { label: "Lines", value: lineCount.toLocaleString() },
    ...stats,
  ];

  return (
    <article className="bg-card overflow-hidden rounded-2xl border">
      <header className="from-muted/40 to-card flex flex-col gap-4 border-b bg-gradient-to-br p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="uppercase tracking-wide">
                Agentic
              </Badge>
              <Badge variant="outline">canonical · v{meta.version}</Badge>
              <code className="text-muted-foreground font-mono text-xs">
                {meta.assetPath}
              </code>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {meta.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Hand-authored canonical spec for {productLabel}. Treat the YAML
              front matter as the machine-readable token layer; the prose below
              is the human implementation guide. Both are served verbatim to
              coding agents.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              aria-label="Copy markdown to clipboard"
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
              size="sm"
              onClick={onDownload}
              aria-label="Download markdown"
            >
              <Download className="size-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              aria-label="Open the design.md spec on GitHub"
            >
              <a href={SPEC_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Spec
              </a>
            </Button>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {fullStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-background/60 rounded-lg border px-3 py-2"
            >
              <dt className="text-muted-foreground text-[10px] tracking-wide uppercase">
                {stat.label}
              </dt>
              <dd className="mt-0.5 truncate font-mono text-sm">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Tabs defaultValue="rendered" className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="rendered" className="gap-1.5">
              <FileText className="size-3.5" /> Rendered
            </TabsTrigger>
            <TabsTrigger value="tokens" className="gap-1.5">
              <Palette className="size-3.5" /> Token surface
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5">
              <MonitorPlay className="size-3.5" /> Preview
            </TabsTrigger>
            <TabsTrigger value="source" className="gap-1.5">
              <FileCode className="size-3.5" /> Markdown
            </TabsTrigger>
          </TabsList>
          <span className="text-muted-foreground font-mono text-xs">
            {doc.filename}
          </span>
        </div>

        <TabsContent value="tokens" className="mt-6">
          <p className="text-muted-foreground mb-4 max-w-2xl text-xs leading-relaxed">
            Live specimens: colours first, then typography with editorial + code
            previews, a full type ladder, and leading/tracking labs — all driven
            by the current <code className="text-foreground font-mono text-[11px]">WEB_FOUNDATIONS</code> bundle.
          </p>
          <TokenSurface bundle={bundle} />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <DesignPreview bundle={bundle} />
        </TabsContent>

        <TabsContent value="rendered" className="mt-5 space-y-5">
          {frontmatter ? (
            <details className="bg-muted/30 group rounded-xl border">
              <summary className="text-foreground hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-xs font-medium select-none">
                <span className="flex items-center gap-2">
                  <Palette className="size-3.5" />
                  YAML front matter — machine-readable tokens
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {frontmatter.split(/\r?\n/).length} lines · open Token surface tab for visuals
                </span>
              </summary>
              <pre className="border-t bg-transparent px-4 py-3 font-mono text-[11px] leading-relaxed">
                <code>{frontmatter}</code>
              </pre>
            </details>
          ) : null}

          <div className={cn(MARKDOWN_PROSE_CLASSNAME)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        </TabsContent>

        <TabsContent value="source" className="mt-5">
          <pre
            data-product={productSlug}
            className="bg-muted/40 max-h-[640px] overflow-auto rounded-xl border p-4 font-mono text-xs leading-relaxed"
          >
            <code>{doc.content}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </article>
  );
}
