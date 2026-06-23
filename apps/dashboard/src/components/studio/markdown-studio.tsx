"use client";

import * as React from "react";
import { ChevronDown, LayoutTemplate, RotateCcw, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { composeExportMarkdown, extractMarkdownBlock } from "@/lib/markdown";
import { STUDIO_SKILLS } from "@/data/studio/skills";
import {
  DEFAULT_PROVIDER,
  STUDIO_PROVIDERS,
  getStudioProvider,
  type ProviderId,
} from "@/data/studio/providers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatPanel } from "@/components/studio/chat-panel";
import { MarkdownPreview } from "@/components/studio/markdown-preview";
import { useStudioChat } from "@/components/studio/use-studio-chat";
import { useStudioBuild } from "@/components/studio/use-studio-build";

export type StudioTemplate = {
  id: string;
  title: string;
  summary: string;
  markdown: string;
  html: string;
};

export type MarkdownStudioProps = {
  productSlug: string;
  productLabel: string;
  designDoc: string | null;
  availableProviders: ProviderId[];
  templates?: StudioTemplate[];
};

/**
 * The studio's authoring option. A "skill" IS a template: when templates exist
 * for the scope, the selector lists them and picking one loads its spec + page.
 * Scopes without templates fall back to the generic authoring skills.
 */
type AuthoringOption = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  suggestions: string[];
  template: StudioTemplate | null;
};

const TEMPLATE_SUGGESTIONS = [
  "Refine the hero headline and subcopy",
  "Tighten the section copy and CTAs",
  "Add a new section to the page",
  "Rewrite it for a more technical audience",
];

function pickDefaultProvider(available: ProviderId[]): ProviderId {
  if (available.includes(DEFAULT_PROVIDER)) return DEFAULT_PROVIDER;
  return available[0] ?? DEFAULT_PROVIDER;
}

export function MarkdownStudio({
  productSlug,
  productLabel,
  designDoc,
  availableProviders,
  templates = [],
}: MarkdownStudioProps) {
  const usingTemplates = templates.length > 0;
  const options = React.useMemo<AuthoringOption[]>(
    () =>
      usingTemplates
        ? templates.map((t) => ({
            id: t.id,
            label: t.title,
            description: t.summary || `Start from the ${t.title} template.`,
            icon: LayoutTemplate,
            suggestions: TEMPLATE_SUGGESTIONS,
            template: t,
          }))
        : STUDIO_SKILLS.map((s) => ({
            id: s.id,
            label: s.label,
            description: s.description,
            icon: s.icon,
            suggestions: s.suggestions,
            template: null,
          })),
    [templates, usingTemplates],
  );

  const [optionId, setOptionId] = React.useState(options[0]?.id ?? "");
  const activeOption = options.find((o) => o.id === optionId) ?? options[0];
  const hasDesignSystem = Boolean(designDoc && designDoc.trim());
  const [embedDesignSystem, setEmbedDesignSystem] =
    React.useState(hasDesignSystem);

  const [provider, setProvider] = React.useState<ProviderId>(() =>
    pickDefaultProvider(availableProviders),
  );
  const providerMeta = getStudioProvider(provider) ?? STUDIO_PROVIDERS[0];

  const [chatDocked, setChatDocked] = React.useState(false);
  const toggleDock = React.useCallback(() => setChatDocked((v) => !v), []);

  const { messages, status, error, sendMessage, reset, stop } = useStudioChat({
    productSlug,
    skillId: optionId,
    provider,
  });
  const page = useStudioBuild({ productSlug, provider });

  // The markdown document is the source of truth. It follows the latest AI
  // output but can also be hand-edited; manual edits persist until the next AI
  // turn. We sync during render (React's "adjust state on change" pattern).
  const derivedDoc = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== "assistant") continue;
      const block = extractMarkdownBlock(messages[i].content);
      if (block) return block;
    }
    return null;
  }, [messages]);

  const [content, setContent] = React.useState("");
  const [syncedFrom, setSyncedFrom] = React.useState<string | null>(null);
  if (derivedDoc !== syncedFrom) {
    setSyncedFrom(derivedDoc);
    setContent(derivedDoc ?? "");
  }

  const hasContent = content.trim().length > 0;

  // Markdown export (optionally with the design.md spec merged in).
  const exportDoc = React.useMemo(() => {
    if (!hasContent) return null;
    if (!embedDesignSystem) return content;
    return composeExportMarkdown({
      content,
      designSystem: designDoc,
      productLabel,
    });
  }, [content, hasContent, embedDesignSystem, designDoc, productLabel]);

  const onReset = React.useCallback(() => {
    reset();
    page.reset();
    setContent("");
    setSyncedFrom(null);
  }, [reset, page]);

  // Pick an authoring option. When it's a template (skill = template), seed the
  // editor with its markdown spec and the page preview with its prebuilt HTML;
  // either way it becomes the active grounding for the chat.
  const onPickOption = React.useCallback(
    (id: string) => {
      setOptionId(id);
      const template = options.find((o) => o.id === id)?.template;
      if (!template) return;
      setContent(template.markdown);
      page.load(template.html, template.markdown);
    },
    [options, page],
  );

  const onBuildPage = React.useCallback(() => {
    page.build(content);
  }, [page, content]);

  const streaming = status === "streaming";
  const baseName = `${productSlug}-${optionId}`;
  // A built page is stale once the markdown it came from no longer matches.
  const pageStale =
    page.builtFrom !== null && page.builtFrom.trim() !== content.trim();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              {usingTemplates ? "Template" : "Skill"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {activeOption ? (
                    <activeOption.icon className="size-4" />
                  ) : null}
                  {activeOption?.label ?? "Select"}
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>
                  {usingTemplates ? "Start from a template" : "Authoring skill"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {options.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => onPickOption(item.id)}
                    className={cn(
                      "flex-col items-start gap-0.5 py-2",
                      item.id === optionId && "bg-accent/60",
                    )}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <item.icon className="size-3.5" />
                      {item.label}
                    </span>
                    <span className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                      {item.description}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Model
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="size-4" />
                  {providerMeta.label}
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>AI model</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={provider}
                  onValueChange={(value) => setProvider(value as ProviderId)}
                >
                  {STUDIO_PROVIDERS.map((item) => {
                    const configured = availableProviders.includes(item.id);
                    return (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        disabled={!configured}
                        className="flex-col items-start gap-0.5 py-2"
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          {item.label}
                          {!configured ? (
                            <span className="text-muted-foreground text-[10px] font-normal">
                              · no API key
                            </span>
                          ) : null}
                        </span>
                        <span className="text-muted-foreground text-xs leading-snug">
                          {item.description}
                        </span>
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasDesignSystem ? (
            <div className="flex items-center gap-2">
              <Switch
                id="embed-design-system"
                checked={embedDesignSystem}
                onCheckedChange={setEmbedDesignSystem}
              />
              <Label
                htmlFor="embed-design-system"
                className="text-muted-foreground cursor-pointer text-xs font-medium"
              >
                Embed design system
              </Label>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={messages.length === 0 && !page.html}
          >
            <RotateCcw className="size-3.5" />
            New document
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 lg:flex-row",
          // Reserve space at the right so the docked panel never covers the
          // preview on wide screens.
          chatDocked && "lg:pr-[27rem]",
        )}
      >
        <div className="min-h-0 min-w-0 flex-1">
          <MarkdownPreview
            markdown={exportDoc}
            editValue={content}
            onSaveEdit={setContent}
            canEdit={hasContent && !streaming}
            markdownFilename={`${baseName}.md`}
            pageHtml={page.html}
            pageBuilding={page.status === "building"}
            pageError={page.error}
            pageStale={pageStale}
            canBuildPage={hasContent && !streaming}
            onBuildPage={onBuildPage}
            pageFilename={`${baseName}.html`}
            streaming={streaming}
          />
        </div>
        {!chatDocked ? (
          <div className="min-h-0 lg:w-[26rem] lg:shrink-0">
            <ChatPanel
              messages={messages}
              status={status}
              error={error}
              suggestions={activeOption?.suggestions ?? []}
              skillLabel={activeOption?.label ?? ""}
              onSend={sendMessage}
              onStop={stop}
              onToggleDock={toggleDock}
              docked={false}
            />
          </div>
        ) : null}
      </div>

      {chatDocked ? (
        <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[26rem] flex-col p-3 pt-[4.25rem] sm:p-4 sm:pt-[4.5rem]">
          <ChatPanel
            messages={messages}
            status={status}
            error={error}
            suggestions={activeOption?.suggestions ?? []}
            skillLabel={activeOption?.label ?? ""}
            onSend={sendMessage}
            onStop={stop}
            onToggleDock={toggleDock}
            docked
            className="shadow-2xl"
          />
        </div>
      ) : null}

      <p className="text-muted-foreground text-xs">
        The markdown is the source of truth, grounded in the {productLabel}{" "}
        design system. The Web page tab builds a live HTML version from that
        markdown with the design tokens baked in — both stay available.{" "}
        {hasDesignSystem && embedDesignSystem
          ? "The design.md spec is also merged into the markdown export."
          : null}
      </p>
    </div>
  );
}
