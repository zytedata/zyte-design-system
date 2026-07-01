"use client";

import { Children, isValidElement, useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronRight,
  Download,
  FileText,
  Hash,
  Info,
  Layers,
  Monitor,
  Package,
  Sparkles,
  SquareArrowOutUpRight,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MARKDOWN_PROSE_CLASSNAME } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type TemplateViewerProps = {
  /** Template display name, used as the section-nav group label. */
  title: string;
  html: string;
  /** The use-case overlay — this template's own spec, shown first. */
  markdown: string;
  /** The inherited base design system, shown in a collapsible (may be empty). */
  baseMarkdown: string;
  /** Full markdown file (with frontmatter) offered as a download. */
  rawMarkdown: string;
  /** Suggested download filename, e.g. `marketing.md`. */
  filename: string;
};

const ID_BASE = "template-base-design-system";

/** Slugify a heading into a stable, URL-safe anchor id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Flatten React children (text, inline code, emphasis…) to a plain string. */
function childrenToString(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement(child)) {
        return childrenToString(
          (child.props as { children?: ReactNode }).children,
        );
      }
      return "";
    })
    .join("");
}

/** Extract `##` headings (fence-aware) for the section nav. */
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

/**
 * Preview ⇄ Markdown switcher for a single template. The preview is a
 * design-system-styled standalone document rendered inside a sandboxed iframe
 * (no scripts, isolated origin); the markdown tab renders the template spec
 * with a left-hand section nav and the inherited base in a collapsible.
 */
export function TemplateViewer({
  title,
  html,
  markdown,
  baseMarkdown,
  rawMarkdown,
  filename,
}: TemplateViewerProps) {
  const sections = useMemo(() => extractSections(markdown), [markdown]);

  const mdComponents = useMemo(
    () => ({
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 id={slugify(childrenToString(children))} className="scroll-mt-24">
          {children}
        </h2>
      ),
    }),
    [],
  );

  const downloadMarkdown = () => {
    const blob = new Blob([rawMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Tabs defaultValue="preview" className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="preview" className="gap-1.5">
            <Monitor />
            Preview
          </TabsTrigger>
          <TabsTrigger value="markdown" className="gap-1.5">
            <FileText />
            Markdown
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={downloadMarkdown}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <Download className="size-3.5" />
            Download .md
          </button>
          <button
            type="button"
            onClick={() => {
              const win = window.open();
              if (win) {
                win.document.open();
                win.document.write(html);
                win.document.close();
              }
            }}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <SquareArrowOutUpRight className="size-3.5" />
            Open full preview
          </button>
        </div>
      </div>

      <TabsContent value="preview" className="mt-4">
        <div className="bg-background overflow-hidden rounded-xl border">
          <iframe
            title="Template preview"
            sandbox=""
            srcDoc={html}
            className="h-[78vh] w-full border-0 bg-white"
          />
        </div>
      </TabsContent>

      <TabsContent value="markdown" className="mt-4">
        <div className="flex gap-6">
          {sections.length > 0 || baseMarkdown ? (
            <nav
              aria-label="Template sections"
              className="hidden w-52 shrink-0 lg:block"
            >
              <div className="sticky top-20 space-y-6">
                {sections.length > 0 ? (
                  <div>
                    <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                      <FileText className="size-3.5" />
                      <span className="truncate">{title} Template</span>
                    </p>
                    <ul className="border-border/70 space-y-0.5 border-l">
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
                ) : null}

                {baseMarkdown ? (
                  <div className="border-border/70 border-t pt-6">
                    <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                      <Layers className="size-3.5" />
                      Base design system
                    </p>
                    <ul className="border-border/70 space-y-0.5 border-l">
                      <li>
                        <a
                          href={`#${ID_BASE}`}
                          className="group text-muted-foreground hover:border-foreground hover:text-foreground -ml-px flex items-center gap-2 border-l border-transparent py-1 pl-3 text-sm transition-colors"
                        >
                          <ChevronRight className="size-3 shrink-0 opacity-50 group-hover:opacity-100" />
                          <span className="truncate">Shared foundations</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </nav>
          ) : null}

          <div className="min-w-0 flex-1 space-y-4">
            <div className="border-border/70 bg-muted/40 rounded-xl border p-4 text-sm leading-relaxed">
              <p className="text-foreground mb-3 flex items-center gap-2 font-medium">
                <Info className="text-foreground/70 size-4 shrink-0" />
                How to use the {title} template
              </p>
              <ul className="text-muted-foreground space-y-2.5">
                <li className="flex gap-2.5">
                  <Sparkles className="text-foreground/70 mt-0.5 size-4 shrink-0" />
                  <span>
                    <span className="text-foreground font-medium">
                      Just vibe-coding?
                    </span>{" "}
                    Hit <span className="font-medium">Download .md</span> and drop
                    the file into an AI tool (Claude, Cursor, v0…). Everything it
                    needs — colours, fonts, spacing and the rules — is baked into
                    that one file, so it can build on-brand with nothing else set
                    up.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <Package className="text-foreground/70 mt-0.5 size-4 shrink-0" />
                  <span>
                    <span className="text-foreground font-medium">
                      Prototyping for real?
                    </span>{" "}
                    Install the design system from npm (
                    <span className="text-foreground font-mono text-xs">
                      @zytedata/ds-web
                    </span>
                    ) to pull the live tokens, components and logo, then use this
                    spec as your guide for what to build.
                  </span>
                </li>
              </ul>
            </div>

            <div
              className={cn(
                "bg-card rounded-xl border p-6 md:p-8",
                MARKDOWN_PROSE_CLASSNAME,
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {markdown}
              </ReactMarkdown>
            </div>

            {baseMarkdown ? (
              <details
                id={ID_BASE}
                className="bg-card group scroll-mt-24 rounded-xl border"
              >
                <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center gap-2 p-5 text-sm font-medium transition-colors">
                  <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
                  Inherited base design system
                  <span className="text-muted-foreground/70 font-normal">
                    — shared foundations this template builds on
                  </span>
                </summary>
                <div
                  className={cn(
                    "border-t px-6 pt-6 pb-8 md:px-8",
                    MARKDOWN_PROSE_CLASSNAME,
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {baseMarkdown}
                  </ReactMarkdown>
                </div>
              </details>
            ) : null}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
