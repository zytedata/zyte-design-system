---
type: Architecture
title: Performance & scale
description: The performance and scalability characteristics that matter here — a bounded codegen, fs-per-request reads, and copy-a-sibling product growth.
tags: [architecture, performance, scalability]
origin: code
timestamp: 2026-08-29
---

# Performance & scale

## What it is

This repo's performance surface is small and bounded, so the "budgets" are
mostly about not introducing unbounded work rather than shaving milliseconds.
There is **no performance gate in CI** — this dimension is review-blocking.

## The pieces

- **Codegen** (`tokens-build`) is O(number of token leaves) per package, pure,
  synchronous logic writing five small files. Build time is milliseconds per
  package (the CLI prints the elapsed ms). It scales linearly with products and
  tokens; there is no combinatorial step.
- **Dashboard reads** are per-request `fs.readFile` of already-built artefacts
  (`packages/<slug>/dist/*`), wrapped in `try/catch`. Each is a single bounded
  file read; there is no database, no N+1, no fan-out. Static token objects come
  from module imports (resolved once).
- **Product growth** is copy-a-sibling ([../conventions/adding-a-product.md](../conventions/adding-a-product.md)):
  each product is independent, built in parallel by `pnpm -r`. The walker handles
  arbitrary token-tree shapes without per-product code, so a new product adds no
  special cases.

## The contract

- New per-request work in the dashboard must stay a bounded read of a built
  artefact — don't add unbounded loops, recursive directory walks, or network
  calls to a render path.
- Keep the codegen pure and linear; a new emitter should be another
  single-pass function over `iterateTokens`, not a nested re-walk.
- Font/asset responses set long immutable cache headers (`next.config.ts`
  `headers()` for `/fonts/*`); keep new static assets cacheable.

## Gotchas

- The Vercel lambda only has the `dist/` files listed in
  `outputFileTracingIncludes`; a read outside that set returns `null` in
  production even though it worked locally (see
  [dashboard-runtime.md](./dashboard-runtime.md)).
- There are no load tests or bundle-size budgets; "is this fast enough" is a
  judgment call at review time.

## Related

- [codegen-engine.md](./codegen-engine.md) — the bounded build
- [dashboard-runtime.md](./dashboard-runtime.md) — the per-request reads
- [../conventions/definition-of-done.md](../conventions/definition-of-done.md) — dimensions 1 & 5
