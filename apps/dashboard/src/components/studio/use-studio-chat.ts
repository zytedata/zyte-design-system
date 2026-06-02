"use client";

import * as React from "react";

import type { ProviderId } from "@/data/studio/providers";

export type StudioRole = "user" | "assistant";

export type StudioMessage = {
  id: string;
  role: StudioRole;
  content: string;
};

export type StudioChatStatus = "idle" | "streaming";

type UseStudioChatArgs = {
  productSlug: string;
  skillId: string;
  provider: ProviderId;
};

let messageCounter = 0;
function nextId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${Date.now()}-${messageCounter}`;
}

/**
 * Client-side chat state for the Markdown Studio. Sends the running
 * conversation to `/api/studio/chat` and appends the streamed assistant text
 * token-by-token so the preview can update live.
 */
export function useStudioChat({
  productSlug,
  skillId,
  provider,
}: UseStudioChatArgs) {
  const [messages, setMessages] = React.useState<StudioMessage[]>([]);
  const [status, setStatus] = React.useState<StudioChatStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  // Keep the latest props available to the async sender without re-creating it.
  const argsRef = React.useRef({ productSlug, skillId, provider });
  argsRef.current = { productSlug, skillId, provider };

  const abortRef = React.useRef<AbortController | null>(null);

  // Mirror messages into a ref so `sendMessage` reads the freshest history.
  const messagesRef = React.useRef<StudioMessage[]>(messages);
  React.useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setStatus("idle");
  }, []);

  const stop = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }, []);

  const sendMessage = React.useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || abortRef.current) return;

    setError(null);

    const userMessage: StudioMessage = {
      id: nextId("user"),
      role: "user",
      content: trimmed,
    };
    const assistantId = nextId("assistant");

    const history = [...messagesRef.current, userMessage];
    setMessages([
      ...history,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          productSlug: argsRef.current.productSlug,
          skillId: argsRef.current.skillId,
          provider: argsRef.current.provider,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        let message = `Request failed (${response.status}).`;
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          // keep default message
        }
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        // user cancelled; leave whatever streamed so far
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        // Drop the empty assistant placeholder on a hard failure.
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantId && m.content === "")),
        );
      }
    } finally {
      abortRef.current = null;
      setStatus("idle");
    }
  }, []);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  return { messages, status, error, sendMessage, reset, stop };
}
