---
type: Environment
title: Local development
description: Zero-to-running dev setup, the daily commands, env files, and the fast token-iteration loop.
tags: [environment, dev, setup, commands]
origin: code
timestamp: 2026-08-29
---

# Local development

## What it is

How to get the repo running and the commands you'll use daily. The full narrative
version is the repo README's "Local development"; this is the operational
distillation.

## The pieces

**Prerequisites:** Node ≥ 20.9 (`engines`), pnpm 8.15.4 (pinned via
`packageManager` — `corepack enable` gets it).

**First-time bootstrap** (from repo root):
```bash
corepack enable
pnpm install
pnpm -r --filter "./packages/*" run build   # build every dist/ once (gitignored)
pnpm dev                                     # dashboard on http://localhost:3000
```
The one-off package build is required because `dist/` is git-ignored and the
dashboard reads it. After that, `pnpm dev` is enough — the dashboard's `predev`
hook runs `tokens:build` first.

**In a Claude Code worktree:** if `node_modules` is missing run
`./scripts/worktree-bootstrap.sh`; quick health `./scripts/worktree-smoke.sh`
(runs `typecheck`). Env files are copied in via `.worktreeinclude`.

**Env files:** the dashboard reads `apps/dashboard/.env.local` (Next reads it from
the app dir, not repo root). It needs `AUTH_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET` ([../architecture/auth-model.md](../architecture/auth-model.md))
and, for Markdown Studio, `OPENAI_*` / `ANTHROPIC_*`
([../integrations/llm-providers.md](../integrations/llm-providers.md)).
`apps/dashboard/.env.example` documents the required auth vars and the optional
Studio keys — copy it to `.env.local` and fill values.

**Most-used commands (root):**

| Command | Does |
|---|---|
| `pnpm dev` | Dashboard dev server (Turbopack) |
| `pnpm build` | Build all packages, then the dashboard |
| `pnpm tokens:build` | Regenerate `dist/` for the pinned product list |
| `pnpm tokens:check` | Build + validate token artefacts (CI-equivalent) |
| `pnpm typecheck` | `tsc --noEmit` across every workspace |
| `pnpm lint` / `lint:fix` | ESLint (real for dashboard; stubs for packages) |
| `pnpm format` / `format:check` | Prettier write / check |
| `pnpm changeset` | Queue a version bump |

**Fast token loop:**
```bash
$EDITOR packages/web/src/foundations.ts
pnpm --filter @zytedata/ds-web run build:tokens   # skips tsc rebuild
# refresh http://localhost:3000/products/web/foundations
```

## The contract

- Run everything from the repo root (or use `--filter` for one package).
- `dist/` is generated — never edit or commit it.
- The pre-PR local check that mirrors CI (plus formatting, which CI omits):
  ```bash
  pnpm tokens:check && pnpm typecheck && pnpm lint && pnpm format:check
  ```

## Gotchas

- Missing `.env.local` auth vars → the app throws
  `Missing required environment variable: AUTH_SECRET` on start.
- `Cannot find module …/tokens-build/dist/bin/build.js` (the README also calls
  this `tokens-build: command not found`) → build `@zytedata/tokens-build` first (a
  fresh `pnpm -r --filter "./packages/*" run build` fixes it).
- "Failed to load design.body.md" in the dashboard → `dist/` wasn't built.

## Related

- [quality-gates.md](./quality-gates.md) — what CI actually runs
- [../conventions/adding-a-token.md](../conventions/adding-a-token.md) — the change recipe
- [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md) — why the one-off build is needed
