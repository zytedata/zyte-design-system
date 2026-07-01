"use client";

import * as React from "react";
import {
  Boxes,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  Hash,
  List,
  MonitorPlay,
  Palette,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { MARKDOWN_PROSE_CLASSNAME } from "@/lib/markdown";
import { GeneratedArtefacts } from "@/components/foundations/generated-artefacts";
import type {
  CanonicalDocPayload,
  GeneratedArtefact,
} from "@/data/foundations/docs";
import type { ProductFoundations } from "@zytedata/ds-types";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TokenSurface } from "@/components/foundations/token-surface";
import { DesignPreview } from "@/components/foundations/design-preview";
import { WebShowcase } from "@/components/foundations/web-showcase";

const SPEC_URL = "https://github.com/google-labs-code/design.md/blob/main/docs/spec.md";

type Accent = "pink" | "indigo" | "amber" | "lime";

/** Matches the dashboard header icon-badge tones (see the product dashboard). */
const ACCENT_BADGE: Record<Accent, string> = {
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
};

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

const ID_TOKENS = "agentic-tokens";

/** Slugify a heading into a stable, URL-safe anchor id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Flatten React children (text, inline code, emphasis…) to a plain string. */
function childrenToString(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (React.isValidElement(child)) {
        return childrenToString(
          (child.props as { children?: React.ReactNode }).children,
        );
      }
      return "";
    })
    .join("");
}

/** Extract `##` headings (fence-aware) for the section nav / outline. */
function extractSections(md: string): Array<{ text: string; slug: string }> {
  const out: Array<{ text: string; slug: string }> = [];
  let inFence = false;
  for (const line of md.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;
    const text = m[1].replace(/`/g, "").trim();
    out.push({ text, slug: slugify(text) });
  }
  return out;
}

export type AgenticDocProps = {
  productLabel: string;
  productSlug: string;
  /** Pre-rendered icon element (server-rendered — Lucide components cannot cross the RSC boundary). */
  icon: React.ReactNode;
  accent: Accent;
  meta: { assetPath: string; title: string; version: string };
  doc: CanonicalDocPayload;
  bundle: ProductFoundations;
  /** Codegen token artefacts (tokens.json/css/scss/tailwind), shown in a tab. */
  artefacts: GeneratedArtefact[];
};

export function AgenticDoc({
  productLabel,
  productSlug,
  icon,
  accent,
  doc,
  bundle,
  artefacts,
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

  const { frontmatter, body } = React.useMemo(
    () => splitDesignDoc(doc.content),
    [doc.content],
  );

  const sections = React.useMemo(() => extractSections(body), [body]);

  const mdComponents = React.useMemo(
    () => ({
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 id={slugify(childrenToString(children))} className="scroll-mt-24">
          {children}
        </h2>
      ),
    }),
    [],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-2xl",
                ACCENT_BADGE[accent],
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                {productLabel} workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Agentic
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed">
            Hand-authored canonical spec for {productLabel}. Treat the YAML
            front matter as the machine-readable token layer; the prose below
            is the human implementation guide. Both are served verbatim to
            coding agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Button
            variant="outline"
            size="sm"
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
                Copy design.md
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onDownload}
            aria-label="Download design.md file"
          >
            <Download className="size-4" />
            Download design.md file
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
      </header>

      <Tabs defaultValue="rendered">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList variant="line">
            <TabsTrigger value="rendered" className="gap-1.5">
              <FileText className="size-3.5" /> Overview
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
            <TabsTrigger value="artefacts" className="gap-1.5">
              <Boxes className="size-3.5" /> Artefacts
            </TabsTrigger>
          </TabsList>
          <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
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
          {productSlug === "web" ? (
            <WebShowcase bundle={bundle} />
          ) : (
            <DesignPreview bundle={bundle} />
          )}
        </TabsContent>

        <TabsContent value="rendered" className="mt-5">
          <div className="flex gap-6">
            {sections.length > 0 ? (
              <nav
                aria-label="Document outline"
                className="hidden w-52 shrink-0 lg:block"
              >
                <div className="sticky top-20 space-y-3">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <List className="size-3.5" />
                    DS sections
                  </p>
                  <ul className="border-border/70 space-y-0.5 border-l">
                    {frontmatter ? (
                      <li>
                        <a
                          href={`#${ID_TOKENS}`}
                          className="group text-muted-foreground hover:border-foreground hover:text-foreground -ml-px flex items-center gap-2 border-l border-transparent py-1 pl-3 text-sm transition-colors"
                        >
                          <Palette className="size-3 shrink-0 opacity-50 group-hover:opacity-100" />
                          <span className="truncate">Machine-readable tokens</span>
                        </a>
                      </li>
                    ) : null}
                    {sections.map((s) => (
                      <li key={s.slug}>
                        <a
                          href={`#${s.slug}`}
                          className="group text-muted-foreground hover:border-foreground hover:text-foreground -ml-px flex items-center gap-2 border-l border-transparent py-1 pl-3 text-sm transition-colors"
                        >
                          <Hash className="size-3 shrink-0 opacity-50 group-hover:opacity-100" />
                          <span className="truncate">{s.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            ) : null}

            <div className="min-w-0 flex-1 space-y-5">
              {frontmatter ? (
                <details
                  id={ID_TOKENS}
                  className="bg-muted/30 group scroll-mt-24 rounded-xl border"
                >
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
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {body}
                </ReactMarkdown>
              </div>
            </div>
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

        <TabsContent value="artefacts" className="mt-5">
          <GeneratedArtefacts productLabel={productLabel} artefacts={artefacts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
