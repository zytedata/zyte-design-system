---
type: Project
title: Wishlist & debt queue
description: The named home for filed gaps and deferred work — so nothing becomes an excuse to block or to build something arbitrary.
tags: [project, wishlist, debt, follow-ups]
origin: code
timestamp: 2026-08-29
---

# Wishlist & debt queue

## What it is

The single place to **file** a gap instead of blocking on it or inventing an ad
hoc fix ([../conventions/no-arbitrary-construction.md](../conventions/no-arbitrary-construction.md)).
Each item names the evidence and a concrete next step. Nothing here is built;
don't document any of it as existing elsewhere.

## Open items

### Gates / tooling

- **No test runner.** Zero test files, no `test` script, no vitest/jest/
  playwright. The "tests ship with behavior" DoD dimension is unenforceable
  today. → Decide on a runner (start with `tokens-build` pure functions, which
  are trivially unit-testable). Home: [../environment/quality-gates.md](../environment/quality-gates.md).
- **Package lint is stubs.** Only `apps/dashboard` runs a real ESLint; every
  `@zytedata/ds-*` + `tokens-build` `lint` is `echo`. → Add a shared flat config
  for the packages (or a root one), then make `pnpm lint` meaningful repo-wide.
- **Prettier not in CI.** `format:check` is a script and a README pre-PR step but
  not a `validate` step. → Add a `Format check` step to `validate.yml`.
- **Changeset presence not gated.** A published change can merge with no
  changeset and silently never bump. → Add a `changeset status` check to
  `validate.yml`.
- **No secret scanning / Dependabot / CodeQL** in this repo (only `pnpm audit`).
  → Add `.github/dependabot.yml` and a secret scanner if the threat model wants
  it. Home: [../architecture/security-model.md](../architecture/security-model.md).

### Product / runtime

- **Figma Web snapshot drift.** The embedded `WEB_FOUNDATIONS` block in
  `figma-plugin/code.js` can lag `foundations.ts` (observed missing `7xl`). →
  Regenerate after each Web token change, or automate it. The `code.js` comment
  points to a "Phase 2 (MCP)" fetch that would replace the hand-mirrors for
  core/scrapy/extract-summit.
- **Dashboard has no `error.tsx`/`not-found.tsx`/`loading.tsx` and no logging.**
  Failures degrade to silent `null`. → Add error/loading boundaries and minimal
  structured logging if debuggability becomes a pain point. Home:
  [../architecture/observability.md](../architecture/observability.md).

## Done (2026-08-29, KB build)

All three documentation drifts found during discovery were corrected in this
build:

- **`.env.example` now documents the auth vars.** Added `AUTH_SECRET` /
  `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (names + comments, no values) to
  `apps/dashboard/.env.example` so a fresh setup no longer crashes on start.
  Verified against [../architecture/auth-model.md](../architecture/auth-model.md).
- **`.github/RELEASING.md` deploy section corrected.** Replaced the non-existent
  `deploy-vercel.yml` + `VERCEL_DEPLOY_HOOK_URL` references with the real `deploy`
  job in `validate.yml` (`VERCEL_TOKEN` + `vercel` CLI). See
  [../integrations/vercel-deploy.md](../integrations/vercel-deploy.md).
- **`change-foundation` skill Figma claim corrected.** Changed "gitignored /
  local-only" to "git-tracked and hand-maintained." See
  [../integrations/figma-plugin.md](../integrations/figma-plugin.md).

## The contract

- Filing here is the sanctioned alternative to blocking or to arbitrary
  construction. Reference an item from a PR when you defer related work.
- When an item is done, move it to a `## Done` note with the commit/PR and update
  the doc that owned the gap. Keep this list honest — a fixed item left "open"
  here is itself drift.

## Related

- [non-negotiables.md](./non-negotiables.md) — the risks hub
- [../conventions/no-arbitrary-construction.md](../conventions/no-arbitrary-construction.md) — why filing beats inventing
- [../log.md](../log.md) — provenance + maintenance rules
