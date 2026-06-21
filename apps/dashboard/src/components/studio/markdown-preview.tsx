"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  Hammer,
  Link2,
  Monitor,
  Pencil,
  Sparkles,
  SquareCode,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { MARKDOWN_PROSE_CLASSNAME } from "@/lib/markdown";
import { buildShareUrl, encodeShareHtml } from "@/lib/share-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type PreviewTab = "rendered" | "source" | "page" | "html";

export type MarkdownPreviewProps = {
  /** Markdown export shown in view mode + used for copy/download. */
  markdown: string | null;
  /** Editable markdown body (without the design-system appendix). */
  editValue: string;
  onSaveEdit: (next: string) => void;
  canEdit: boolean;
  markdownFilename: string;
  /** The built HTML page (its source is the markdown). */
  pageHtml: string | null;
  pageBuilding: boolean;
  pageError: string | null;
  pageStale: boolean;
  canBuildPage: boolean;
  onBuildPage: () => void;
  pageFilename: string;
  streaming?: boolean;
};

export function MarkdownPreview({
  markdown,
  editValue,
  onSaveEdit,
  canEdit,
  markdownFilename,
  pageHtml,
  pageBuilding,
  pageError,
  pageStale,
  canBuildPage,
  onBuildPage,
  pageFilename,
  streaming = false,
}: MarkdownPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [tab, setTab] = React.useState<PreviewTab>("rendered");
  const [shareState, setShareState] = React.useState<
    "idle" | "working" | "copied" | "error"
  >("idle");

  if (editing && !canEdit) setEditing(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  React.useEffect(() => {
    if (shareState !== "copied" && shareState !== "error") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const startEditing = React.useCallback(() => {
    setDraft(editValue);
    setEditing(true);
  }, [editValue]);

  const cancelEditing = React.useCallback(() => setEditing(false), []);
  const saveEditing = React.useCallback(() => {
    onSaveEdit(draft);
    setEditing(false);
  }, [draft, onSaveEdit]);

  const isHtmlContext = tab === "page" || tab === "html";
  const activeText = isHtmlContext ? pageHtml : markdown;
  const activeFilename = isHtmlContext ? pageFilename : markdownFilename;
  const activeMime = isHtmlContext ? "text/html" : "text/markdown";

  const onCopy = React.useCallback(async () => {
    if (!activeText) return;
    try {
      await navigator.clipboard.writeText(activeText);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = activeText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
      setCopied(true);
    }
  }, [activeText]);

  const onDownload = React.useCallback(() => {
    if (!activeText) return;
    const blob = new Blob([activeText], { type: activeMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [activeText, activeFilename, activeMime]);

  const openFullView = React.useCallback(() => {
    if (!pageHtml) return;
    const blob = new Blob([pageHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, [pageHtml]);

  const onShare = React.useCallback(async () => {
    if (!pageHtml) return;
    setShareState("working");
    try {
      const token = await encodeShareHtml(pageHtml);
      const url = buildShareUrl(window.location.origin, token);
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  }, [pageHtml]);

  const hasMarkdown = Boolean(markdown && markdown.trim().length > 0);
  const hasActive = Boolean(activeText && activeText.trim().length > 0);
  const hasPage = Boolean(pageHtml && pageHtml.trim().length > 0);

  return (
    <section className="bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {editing ? "Editing" : "Preview"}
          </span>
          {streaming ? (
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
              <Sparkles className="size-3.5 animate-pulse" />
              writing…
            </span>
          ) : (
            <code className="text-muted-foreground font-mono text-xs">
              {activeFilename}
            </code>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                <X className="size-4" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={saveEditing}>
                <Check className="size-4" />
                Save
              </Button>
            </>
          ) : isHtmlContext ? (
            <>
              <Button
                variant={hasPage ? "outline" : "default"}
                size="sm"
                onClick={onBuildPage}
                disabled={!canBuildPage || pageBuilding}
              >
                <Hammer className="size-4" />
                {pageBuilding ? "Building…" : hasPage ? "Rebuild" : "Build page"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openFullView}
                disabled={!hasPage}
                aria-label="Open page in a new tab"
              >
                <ExternalLink className="size-4" />
                Full view
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                disabled={!hasPage || shareState === "working"}
                aria-label="Copy a shareable link"
              >
                {shareState === "copied" ? (
                  <Check className="size-4" />
                ) : shareState === "error" ? (
                  <AlertTriangle className="size-4" />
                ) : (
                  <Link2 className="size-4" />
                )}
                {shareState === "working"
                  ? "Linking…"
                  : shareState === "copied"
                    ? "Link copied"
                    : shareState === "error"
                      ? "Failed"
                      : "Share"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopy}
                disabled={!hasActive}
                aria-label="Copy HTML"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                disabled={!hasActive}
                aria-label="Download HTML"
              >
                <Download className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={startEditing}
                disabled={!canEdit}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopy}
                disabled={!hasActive}
                aria-label="Copy markdown"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onDownload}
                disabled={!hasActive}
                aria-label="Download markdown"
              >
                <Download className="size-4" />
                Download
              </Button>
            </>
          )}
        </div>
      </header>

      {editing ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-6 font-mono text-xs leading-relaxed focus-visible:ring-0"
            placeholder="Edit the markdown…"
          />
          <p className="text-muted-foreground border-t px-4 py-2 text-[11px]">
            Editing the markdown source. The design system reference is appended
            automatically on copy and download; rebuild the Web page to apply
            your changes there.
          </p>
        </div>
      ) : hasMarkdown ? (
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as PreviewTab)}
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <div className="border-b px-4 py-2">
            <TabsList>
              <TabsTrigger value="rendered" className="gap-1.5">
                <FileText className="size-3.5" /> Rendered
              </TabsTrigger>
              <TabsTrigger value="source" className="gap-1.5">
                <FileCode className="size-3.5" /> Markdown
              </TabsTrigger>
              <TabsTrigger value="page" className="gap-1.5">
                <Monitor className="size-3.5" /> Web page
              </TabsTrigger>
              <TabsTrigger value="html" className="gap-1.5">
                <SquareCode className="size-3.5" /> HTML
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rendered" className="min-h-0 flex-1 overflow-auto p-6">
            <div className={cn(MARKDOWN_PROSE_CLASSNAME)}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown ?? ""}
              </ReactMarkdown>
            </div>
          </TabsContent>

          <TabsContent value="source" className="min-h-0 flex-1 overflow-auto">
            <pre className="bg-muted/40 m-0 h-full overflow-auto p-4 font-mono text-xs leading-relaxed">
              <code>{markdown}</code>
            </pre>
          </TabsContent>

          <TabsContent value="page" className="min-h-0 flex-1">
            <PageView
              html={pageHtml}
              building={pageBuilding}
              error={pageError}
              stale={pageStale}
              canBuild={canBuildPage}
              onBuild={onBuildPage}
            />
          </TabsContent>

          <TabsContent value="html" className="min-h-0 flex-1 overflow-auto">
            {hasPage ? (
              <pre className="bg-muted/40 m-0 h-full overflow-auto p-4 font-mono text-xs leading-relaxed">
                <code>{pageHtml}</code>
              </pre>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                <span className="bg-muted text-muted-foreground inline-flex size-11 items-center justify-center rounded-xl">
                  <SquareCode className="size-5" />
                </span>
                <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
                  Build the web page to see its HTML source here.
                </p>
                <Button size="sm" onClick={onBuildPage} disabled={!canBuildPage}>
                  <Hammer className="size-4" />
                  Build web page
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
          <span className="bg-muted text-muted-foreground inline-flex size-11 items-center justify-center rounded-xl">
            <FileText className="size-5" />
          </span>
          <p className="text-sm font-medium">No document yet</p>
          <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
            Describe the page or content you need in the chat. The generated
            markdown renders here, and you can build it into a live web page.
          </p>
        </div>
      )}
    </section>
  );
}

function PageView({
  html,
  building,
  error,
  stale,
  canBuild,
  onBuild,
}: {
  html: string | null;
  building: boolean;
  error: string | null;
  stale: boolean;
  canBuild: boolean;
  onBuild: () => void;
}) {
  if (!html && !building) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <span className="bg-muted text-muted-foreground inline-flex size-11 items-center justify-center rounded-xl">
          <Monitor className="size-5" />
        </span>
        <p className="text-sm font-medium">Build a web page</p>
        <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
          Turn the markdown into a live, on-brand HTML page with the design
          tokens baked into its styles.
        </p>
        {error ? (
          <p className="text-destructive max-w-xs text-xs">{error}</p>
        ) : null}
        <Button size="sm" onClick={onBuild} disabled={!canBuild}>
          <Hammer className="size-4" />
          Build web page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {stale && !building ? (
        <div className="text-muted-foreground bg-muted/40 flex items-center gap-2 border-b px-4 py-2 text-[11px]">
          <AlertTriangle className="size-3.5 shrink-0" />
          The markdown changed since this page was built. Rebuild to update it.
        </div>
      ) : null}
      {building ? (
        <div className="text-muted-foreground bg-muted/40 flex items-center gap-2 border-b px-4 py-2 text-[11px]">
          <Sparkles className="size-3.5 shrink-0 animate-pulse" />
          Building the page…
        </div>
      ) : null}
      {error ? (
        <div className="text-destructive bg-destructive/10 flex items-center gap-2 border-b px-4 py-2 text-[11px]">
          <AlertTriangle className="size-3.5 shrink-0" />
          {error}
        </div>
      ) : null}
      {building ? (
        <PageBuildingSkeleton />
      ) : (
        <iframe
          title="Web page preview"
          sandbox=""
          className="min-h-0 w-full flex-1 border-0 bg-white"
          srcDoc={html ?? ""}
        />
      )}
    </div>
  );
}

/**
 * Page-shaped placeholder shown while a page is being built. It avoids
 * re-rendering the iframe on every streamed token (which flickers) — we show a
 * stable skeleton until the final HTML is ready, then mount the iframe once.
 */
function PageBuildingSkeleton() {
  const block = "animate-pulse rounded-md bg-zinc-200/80";
  return (
    <div className="min-h-0 flex-1 overflow-hidden bg-white">
      <div className="mx-auto flex h-full max-w-3xl flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <div className={cn(block, "h-6 w-28")} />
          <div className="flex items-center gap-3">
            <div className={cn(block, "h-5 w-14")} />
            <div className={cn(block, "h-5 w-14")} />
            <div className={cn(block, "h-9 w-24")} />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4 text-center">
          <div className={cn(block, "h-9 w-4/5")} />
          <div className={cn(block, "h-9 w-3/5")} />
          <div className={cn(block, "mt-2 h-4 w-2/3")} />
          <div className={cn(block, "h-4 w-1/2")} />
          <div className="mt-3 flex gap-3">
            <div className={cn(block, "h-10 w-32")} />
            <div className={cn(block, "h-10 w-32")} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4"
            >
              <div className={cn(block, "size-9")} />
              <div className={cn(block, "h-4 w-3/4")} />
              <div className={cn(block, "h-3 w-full")} />
              <div className={cn(block, "h-3 w-5/6")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
