---
type: Architecture
title: The token pipeline
description: How a token flows from foundations.ts through tsc + tokens-build into the shippable dist/ artefacts, and the ordering constraint that governs it.
tags: [architecture, pipeline, build, tokens]
origin: code
timestamp: 2026-08-29
---

# The token pipeline

## What it is

The end-to-end path a token travels: from the TypeScript source of truth to the
five shippable artefacts. It is a two-stage build per package — **`tsc` first,
then codegen** — and that order is a hard constraint, not a preference.

## The pieces

For a package `packages/<slug>/` the `build` script is
`pnpm run build:js && pnpm run build:tokens`:

1. **`build:js`** = `tsc -p tsconfig.build.json` → compiles `src/*.ts` to
   `dist/*.js` (+ `.d.ts`, source maps). Critically this produces
   `dist/foundations.js` and, if present, `dist/branding.js`.
2. **`build:tokens`** = `node ../tokens-build/dist/bin/build.js` → the codegen
   ([codegen-engine.md](./codegen-engine.md)) runs in the package's cwd,
   dynamically `import()`s the compiled `dist/foundations.js`, reads
   `src/design.body.md`, and writes:
   - `dist/tokens.json`, `dist/tokens.css`, `dist/tokens.scss`,
     `dist/tokens.tailwind.cjs`
   - `dist/design.md` (prose + generated YAML frontmatter)
   - `dist/templates/<id>.{md,html}` for any `src/templates/<id>.md` that has a
     matching `<id>.html` (Web ships `marketing`, `report`, `deck`).

`check:tokens` = `node ../tokens-build/dist/bin/check.js` runs `build` **again**
then validates the output — see [output-surfaces.md](./output-surfaces.md).

## The contract

- **Order is mandatory.** `tokens-build` cannot import TypeScript directly (Node
  can't, and shipping `tsx` as a runtime would burden every consumer). If
  `dist/foundations.js` is absent it throws:
  `expected compiled module at …; run "pnpm run build:js" before "pnpm run build:tokens"`.
  Always run the full `build`, not `build:tokens` alone, after a fresh checkout.
- **`tokens-build` must itself be built first.** It's a workspace dependency; its
  `dist/bin/build.js` must exist. `pnpm -r --filter "./packages/*" run build`
  builds it in dependency order; a bare `build:tokens` in a product before
  `tokens-build` is built fails with a Node `Cannot find module
  .../tokens-build/dist/bin/build.js` error (the README's troubleshooting also
  refers to this as `tokens-build: command not found`).
- **`dist/` is a pure function of `src/`** and is git-ignored — every
  `install`/`dev`/CI run regenerates it. Never commit or hand-edit it.

## Gotchas

- The dashboard's `predev`/`prebuild` hooks run `pnpm -w run tokens:build` for
  you, but that root script only covers the pinned product list
  (`web,core,scrapy,extract-summit`) — a new product must be added there too
  (see [../conventions/adding-a-product.md](../conventions/adding-a-product.md)).
- "Failed to load design.body.md" in the dashboard means `dist/` was never
  built — run `pnpm -r --filter "./packages/*" run build`.
- Root `pnpm build` = build every package, _then_ build the dashboard; the
  dashboard reads the freshly-built `dist/` at request time
  ([dashboard-runtime.md](./dashboard-runtime.md)).

## Related

- [codegen-engine.md](./codegen-engine.md) — what `tokens-build` does internally
- [output-surfaces.md](./output-surfaces.md) — the five artefacts + design.md
- [type-contract.md](./type-contract.md) — the `ProductFoundations` shape it walks
- [../conventions/adding-a-token.md](../conventions/adding-a-token.md) — the recipe that drives this
