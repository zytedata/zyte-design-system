"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUp,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  Square,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type {
  StudioChatStatus,
  StudioMessage,
} from "@/components/studio/use-studio-chat";

function splitAssistant(content: string): { intro: string; hasDoc: boolean } {
  const match = content.match(/`{3,}[a-z]*[^\S\r\n]*\r?\n/i);
  if (!match || match.index === undefined) {
    return { intro: content, hasDoc: false };
  }
  return { intro: content.slice(0, match.index).trim(), hasDoc: true };
}

export type ChatPanelProps = {
  messages: StudioMessage[];
  status: StudioChatStatus;
  error: string | null;
  suggestions: string[];
  skillLabel: string;
  onSend: (text: string) => void;
  onStop: () => void;
  onToggleDock?: () => void;
  docked?: boolean;
  className?: string;
};

export function ChatPanel({
  messages,
  status,
  error,
  suggestions,
  skillLabel,
  onSend,
  onStop,
  onToggleDock,
  docked = false,
  className,
}: ChatPanelProps) {
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const streaming = status === "streaming";
  const isEmpty = messages.length === 0;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const submit = React.useCallback(() => {
    const text = draft.trim();
    if (!text || streaming) return;
    onSend(text);
    setDraft("");
  }, [draft, streaming, onSend]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <section
      className={cn(
        "bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          <Sparkles className="text-primary size-4" />
          Chat
        </span>
        {onToggleDock ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleDock}
            aria-label={docked ? "Undock chat" : "Dock chat to the side"}
            title={docked ? "Undock chat" : "Dock chat to the side"}
          >
            {docked ? (
              <PanelRightOpen className="size-4" />
            ) : (
              <PanelRightClose className="size-4" />
            )}
          </Button>
        ) : null}
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto p-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <span className="bg-primary/10 text-primary inline-flex size-11 items-center justify-center rounded-xl">
              <Sparkles className="size-5" />
            </span>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Markdown Studio</p>
              <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
                Describe the {skillLabel.toLowerCase()} you want. The assistant
                drafts on-brand markdown using this product&apos;s design system,
                and you can refine it by chatting.
              </p>
            </div>
            {suggestions.length > 0 ? (
              <div className="flex w-full max-w-sm flex-col gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onSend(suggestion)}
                    className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border px-3 py-2 text-left text-xs transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.id}>
                <ChatBubble message={message} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <div className="border-t">
          <div className="text-destructive bg-destructive/10 m-3 flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      ) : null}

      <div className="border-t p-3">
        <div className="bg-background focus-within:border-ring focus-within:ring-ring/50 flex items-end gap-2 rounded-xl border px-2 py-1.5 transition-colors focus-within:ring-3">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Describe the page or ask for a change…"
            className="max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent px-1.5 py-1.5 shadow-none focus-visible:ring-0"
          />
          {streaming ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <Square className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              onClick={submit}
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mt-1.5 px-1 text-[10px]">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </section>
  );
}

function ChatBubble({ message }: { message: StudioMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const { intro, hasDoc } = splitAssistant(message.content);
  const showThinking = !intro && !hasDoc;

  return (
    <div className="flex justify-start">
      <div className="bg-muted/60 max-w-[85%] space-y-2 rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm">
        {showThinking ? (
          <span className="text-muted-foreground inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 animate-pulse" /> Thinking…
          </span>
        ) : (
          <>
            {intro ? (
              <p className="whitespace-pre-wrap">{intro}</p>
            ) : null}
            {hasDoc ? (
              <span
                className={cn(
                  "text-muted-foreground inline-flex items-center gap-1.5 text-xs",
                  intro && "border-border/60 mt-1 border-t pt-2",
                )}
              >
                <FileText className="size-3.5" />
                Updated — see the preview
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
