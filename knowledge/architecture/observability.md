---
type: Architecture
title: Observability & error handling
description: The honest state of logging, errors, and audit in this repo — CLI stdout, silent fs degradation, and no telemetry.
tags: [architecture, observability, logging, errors]
origin: code
timestamp: 2026-08-29
---

# Observability & error handling

## What it is

The truthful picture: observability here is minimal by design. There is no
metrics/tracing/telemetry stack, and the dashboard does no logging. Document new
work against this reality — do not claim instrumentation that isn't present.

## The pieces

- **Codegen CLIs** are the only components that emit deliberate output:
  `tokens-build` prints `tokens-build: <slug> (<n> artefacts in <ms>ms)` to
  stdout on success and a message + stack to stderr on failure (exit 1).
  `tokens-check` prints `tokens-check: <slug> ok` or a `✗`-bulleted failure list
  (exit 1). These are the signals CI surfaces.
- **The dashboard has no logging at all** — a repo-wide search finds no
  `console.error/warn/log` in `apps/dashboard/src`. Filesystem/IO failures in the
  data layer degrade to `null` or `[]` via `try { … } catch { return null; }`
  (e.g. `src/data/foundations/docs.ts`, `src/data/git-status.ts`,
  `src/lib/studio-llm.ts`, `src/lib/auth.ts`).
- **OAuth errors** don't throw to the user; the callback funnels them through
  `signInError(baseUrl, code)` → redirect to `/sign-in?error=<code>`
  (`denied|oauth|token|domain`).
- **Audit trail:** the human-readable change record is `changelog.ts` (surfaced
  in the dashboard) and per-package `CHANGELOG.md` (written by Changesets on
  release). There is no runtime audit log.

## The contract

- Silent `catch → null` is the **established convention** for artefact reads —
  match it rather than introducing a parallel error style, but be aware it means
  a missing artefact has no log line to trace.
- CLI exit codes are the contract CI depends on: a non-zero exit fails the job.
  Keep new build/validate tooling exiting non-zero on failure.

## Gotchas

- Debugging "my dist artefact isn't showing" means inspecting the null-returning
  call site directly — there is no log to grep.
- Because there's no `error.tsx`, an unhandled throw in a dashboard route yields
  Next's default error, not a branded page.
- Adding real logging/telemetry is a legitimate improvement but is currently
  **unbuilt** — file it in [../project/wishlist.md](../project/wishlist.md), don't
  document it as existing.

## Related

- [dashboard-runtime.md](./dashboard-runtime.md) — where the silent nulls originate
- [../conventions/definition-of-done.md](../conventions/definition-of-done.md) — dimension 7
- [../project/wishlist.md](../project/wishlist.md) — observability improvements, filed
