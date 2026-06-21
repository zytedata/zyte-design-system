import "server-only";

import type { ProviderId } from "@/data/studio/providers";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
// Generous default so full HTML page builds aren't truncated. Override per
// model with ANTHROPIC_MAX_TOKENS (must stay within the model's output limit).
const DEFAULT_ANTHROPIC_MAX_TOKENS = 64000;

const DEFAULT_MODEL: Record<ProviderId, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-6",
};

function anthropicMaxTokens(): number {
  const raw = Number(process.env.ANTHROPIC_MAX_TOKENS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_ANTHROPIC_MAX_TOKENS;
}

const PROVIDER_LABEL: Record<ProviderId, string> = {
  openai: "OpenAI",
  anthropic: "Claude",
};

const NOT_CONFIGURED: Record<ProviderId, string> = {
  openai:
    "OpenAI is not configured. Set OPENAI_API_KEY in apps/dashboard/.env.local and restart the dev server.",
  anthropic:
    "Claude is not configured. Set ANTHROPIC_API_KEY in apps/dashboard/.env.local and restart the dev server.",
};

export type ProxyMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function apiKey(provider: ProviderId): string | undefined {
  const raw =
    provider === "openai"
      ? process.env.OPENAI_API_KEY
      : process.env.ANTHROPIC_API_KEY;
  return raw?.trim() || undefined;
}

function modelFor(provider: ProviderId): string {
  const fromEnv = (
    provider === "openai" ? process.env.OPENAI_MODEL : process.env.ANTHROPIC_MODEL
  )?.trim();
  return fromEnv || DEFAULT_MODEL[provider];
}

export function isProviderConfigured(provider: ProviderId): boolean {
  return Boolean(apiKey(provider));
}

/** Providers that have a key set, in display order. Read at request time. */
export function getConfiguredProviders(): ProviderId[] {
  return (["openai", "anthropic"] as ProviderId[]).filter(isProviderConfigured);
}

/**
 * Re-emits an upstream SSE stream as plain UTF-8 assistant text. `extract`
 * pulls the text delta out of one parsed `data:` payload (or returns null to
 * skip non-text events). OpenAI terminates with a `[DONE]` sentinel; Anthropic
 * simply ends the stream, so both paths are handled.
 */
function relayTextStream(
  upstreamBody: ReadableStream<Uint8Array>,
  extract: (parsed: unknown) => string | null,
): Response {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstreamBody.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data) continue;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const token = extract(JSON.parse(data));
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Ignore keep-alive comments / non-JSON lines.
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

async function proxyStream(
  provider: ProviderId,
  init: { url: string; headers: HeadersInit; body: unknown },
  extract: (parsed: unknown) => string | null,
): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await fetch(init.url, {
      method: "POST",
      headers: init.headers,
      body: JSON.stringify(init.body),
    });
  } catch {
    return jsonError(`Failed to reach ${PROVIDER_LABEL[provider]}.`, 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return jsonError(
      `${PROVIDER_LABEL[provider]} request failed (${upstream.status}). ${detail.slice(0, 300)}`,
      502,
    );
  }

  return relayTextStream(upstream.body, extract);
}

function extractOpenAI(parsed: unknown): string | null {
  const choice = (parsed as { choices?: { delta?: { content?: string } }[] })
    ?.choices?.[0];
  return choice?.delta?.content ?? null;
}

function extractAnthropic(parsed: unknown): string | null {
  const event = parsed as {
    type?: string;
    delta?: { type?: string; text?: string };
  };
  if (event?.type === "content_block_delta" && event.delta?.type === "text_delta") {
    return event.delta.text ?? null;
  }
  return null;
}

/**
 * Streams a chat completion from the chosen provider, re-emitting only the
 * assistant text deltas. Returns a JSON error Response (503/502) when the key
 * is missing or the upstream call fails. Shared by the chat and page-build
 * route handlers.
 */
export async function streamChat(
  provider: ProviderId,
  messages: ProxyMessage[],
  opts: { temperature?: number } = {},
): Promise<Response> {
  const key = apiKey(provider);
  if (!key) return jsonError(NOT_CONFIGURED[provider], 503);

  const model = modelFor(provider);
  const temperature = opts.temperature ?? 0.6;

  if (provider === "anthropic") {
    const system = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    return proxyStream(
      provider,
      {
        url: ANTHROPIC_URL,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: {
          model,
          max_tokens: anthropicMaxTokens(),
          temperature,
          stream: true,
          ...(system ? { system } : {}),
          messages: conversation,
        },
      },
      extractAnthropic,
    );
  }

  return proxyStream(
    provider,
    {
      url: OPENAI_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: { model, stream: true, temperature, messages },
    },
    extractOpenAI,
  );
}
