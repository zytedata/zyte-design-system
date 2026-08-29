---
type: Integration
title: LLM providers (Markdown Studio)
description: The dashboard's Markdown Studio feature calls OpenAI/Anthropic via server routes; the env keys and the one place secrets are documented.
tags: [integration, llm, openai, anthropic, studio]
origin: code
timestamp: 2026-08-29
---

# LLM providers (Markdown Studio)

## What it is

The dashboard ships a **Markdown Studio** feature that talks to LLM providers
(OpenAI / Anthropic) server-side to help author `design.md`-style content. It's
the only outbound third-party API the app calls at runtime.

## The pieces

- **UI:** `apps/dashboard/src/components/studio/*` (`chat-panel`,
  `markdown-studio`, `markdown-preview`, `use-studio-chat.ts`,
  `use-studio-build.ts`).
- **Server route:** `apps/dashboard/src/app/api/studio/chat/route.ts`.
- **Provider glue:** `apps/dashboard/src/lib/studio-llm.ts` (failures degrade to
  `null`, consistent with the app-wide no-logging convention —
  [../architecture/observability.md](../architecture/observability.md)).
- **Env (from `apps/dashboard/.env.example`):** `OPENAI_API_KEY`, `OPENAI_MODEL`,
  `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ANTHROPIC_MAX_TOKENS`. Loaded from
  `apps/dashboard/.env.local`.

## The contract

- Keys are read from the environment, never committed (`.env*` git-ignored).
- The feature is server-side; provider keys never reach the client.
- It sits **behind the auth gate** ([auth-model.md](../architecture/auth-model.md)),
  so only `@zyte.com` users can invoke it.

## Gotchas

- These Studio keys are **optional** (the model picker only enables providers with
  a key set), whereas the auth vars are **required** to start the app at all —
  both groups are documented in `apps/dashboard/.env.example`. See
  [auth-model.md](../architecture/auth-model.md).
- When building AI features here, default to the latest Claude models per the
  house AI guidance; don't hardcode a model — it's an env var (`ANTHROPIC_MODEL`).

## Related

- [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md) — the app it lives in
- [../architecture/auth-model.md](../architecture/auth-model.md) — the gate in front of it
- [../environment/local-development.md](../environment/local-development.md) — setting `.env.local`
