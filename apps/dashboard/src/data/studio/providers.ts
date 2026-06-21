/**
 * Client-safe descriptors for the LLM providers the Markdown Studio can use.
 * Keep this free of secrets/server code so it can be imported in the browser.
 * The matching server wiring (keys, endpoints, streaming) lives in
 * `src/lib/studio-llm.ts`.
 */
export type ProviderId = "openai" | "anthropic";

export type StudioProvider = {
  id: ProviderId;
  label: string;
  /** Short hint shown in the picker. */
  description: string;
};

export const STUDIO_PROVIDERS: StudioProvider[] = [
  {
    id: "openai",
    label: "OpenAI",
    description: "GPT models via the OpenAI API.",
  },
  {
    id: "anthropic",
    label: "Claude",
    description: "Anthropic Claude via the Messages API.",
  },
];

export const DEFAULT_PROVIDER: ProviderId = "openai";

export function getStudioProvider(id: string): StudioProvider | undefined {
  return STUDIO_PROVIDERS.find((p) => p.id === id);
}

export function coerceProviderId(value: unknown): ProviderId {
  return value === "anthropic" || value === "openai" ? value : DEFAULT_PROVIDER;
}
