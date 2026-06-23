"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Monitor, SquareArrowOutUpRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MARKDOWN_PROSE_CLASSNAME } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type TemplateViewerProps = {
  html: string;
  markdown: string;
};

/**
 * Preview ⇄ Markdown switcher for a single template. The preview is a
 * design-system-styled standalone document rendered inside a sandboxed iframe
 * (no scripts, isolated origin); the markdown tab renders the template spec.
 */
export function TemplateViewer({ html, markdown }: TemplateViewerProps) {
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
        <div className={cn("bg-card rounded-xl border p-6 md:p-8", MARKDOWN_PROSE_CLASSNAME)}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  );
}
