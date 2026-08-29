---
type: Convention
title: No arbitrary construction
description: Every change follows a documented pattern or adds a reviewed convention in the same change — the repo's core anti-drift rule.
tags: [convention, anti-drift, non-negotiable]
origin: code
timestamp: 2026-08-29
---

# No arbitrary construction

## What it is

The single rule that keeps a token repo from rotting into N bespoke pipelines:
**you may not invent structure to avoid finding the pattern.** Every change
either follows something already documented here, or it adds/updates the
convention doc that blesses it — in the same PR. "I made a new folder because it
was faster" is the exact failure this forbids.

## The pieces

The blessed patterns already exist; use them:

- **A new token** → edit `packages/<slug>/src/foundations.ts`, keep the
  `ProductFoundations` shape. Recipe: [adding-a-token.md](./adding-a-token.md).
- **A new product** → copy a sibling under `packages/`. Recipe:
  [adding-a-product.md](./adding-a-product.md).
- **A new output format** → it belongs in the codegen emitters in
  `packages/tokens-build/src/index.ts` (`buildTokensCss`, `buildTokensScss`,
  `buildTokensJson`, `buildTokensTailwind`), not in a per-package script. See
  [../architecture/codegen-engine.md](../architecture/codegen-engine.md).
- **A dashboard artefact read** → use the existing `fs`-at-`process.cwd()/../..`
  resolver in `apps/dashboard/src/data/foundations/docs.ts`; do not add a second
  resolution strategy (there is a load-bearing comment there explaining why
  `createRequire` is deliberately avoided). See
  [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md).
- **A dashboard UI primitive** → use `apps/dashboard/src/components/ui/*`
  (shadcn). Don't introduce a second component library.

## The contract

- If your change is fully covered by an existing pattern, **cite it** (in the PR,
  name the doc/file you followed). That citation _is_ the proof the DoD asks for.
- If your change needs a genuinely new pattern, that's allowed — but the
  convention doc lands in the **same change**, reviewed alongside the code. A new
  pattern with no doc is arbitrary construction by definition.
- Enforcement is **review-blocking**. `Typecheck` catches some drift (a token
  that breaks `ProductFoundations`, an export renamed out of the barrel), but the
  reviewer is the real gate. See [definition-of-done.md](./definition-of-done.md).

## Gotchas

- The codegen is **schema-tolerant on purpose** (it walks arbitrary token
  trees), so a malformed-but-typed token group will still emit artefacts. Passing
  `tokens:check` does **not** mean your structure matches house style — that's a
  review call.
- "Add it to `dist/`" is never a fix. `dist/` is generated and git-ignored; edits
  there vanish on the next `pnpm tokens:build`.
- Deferring is fine; inventing is not. If the right pattern is missing and you
  can't add it now, file it in [../project/wishlist.md](../project/wishlist.md)
  rather than building something ad hoc.

## Related

- [definition-of-done.md](./definition-of-done.md) — the governing charter
- [adding-a-token.md](./adding-a-token.md) — the blessed token recipe
- [adding-a-product.md](./adding-a-product.md) — the blessed product recipe
- [../project/wishlist.md](../project/wishlist.md) — where deferred work is filed
