---
type: Package
title: "@zytedata/ds-scrapy"
description: The Scrapy design system — a deliberately minimal, in-progress product with primary + neutral palettes.
tags: [package, product, scrapy]
origin: code
timestamp: 2026-08-29
---

# @zytedata/ds-scrapy

## What it is

The design system for Scrapy product docs and patterns. `label: "Scrapy"`,
version `0.1.1`, `canonicalDoc.version` `1.0`. Its own description is candid:
"Scrapy product docs and patterns (**foundations in progress**)" — the leanest,
least-finished product.

## The pieces

`packages/scrapy/src/`:

- `foundations.ts` — `SCRAPY_FOUNDATIONS`. Minimal color set: `primary` +
  `neutral` palettes, with the full typography/spacing/radius/shadow/breakpoint/
  opacity/zIndex scales and `semanticColors`.
- `design.body.md`, `changelog.ts`, `components.ts`, `documentation.ts`.
- `index.ts` — barrel of `foundations`, `changelog`, `components`,
  `documentation` (no branding/content/templates/assets).

## The contract

- Same build shape and export surface as every product. Being "in progress" does
  not exempt it from the gates — it still builds and passes `tokens:check`.

## Gotchas

- Because it's intentionally sparse, don't treat missing palettes as a bug to
  "fill in" arbitrarily — expanding Scrapy's foundations is a design decision, not
  a cleanup. File scope changes rather than inventing tokens
  ([../conventions/no-arbitrary-construction.md](../conventions/no-arbitrary-construction.md)).
- Scrapy's colors are hand-maintained in the Figma plugin (not generated).

## Related

- [../conventions/token-authoring.md](../conventions/token-authoring.md) — the shape rules
- [ds-extract-summit.md](./ds-extract-summit.md) — the other nascent product
- [../project/scope-and-roadmap.md](../project/scope-and-roadmap.md) — product maturity
