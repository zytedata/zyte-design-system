---
type: Package
title: "@zytedata/ds-extract-summit"
description: The Extract Summit event-site design system — a brutalist, deeply-nested token tree that proves the codegen's schema tolerance.
tags: [package, product, extract-summit]
origin: code
timestamp: 2026-08-29
---

# @zytedata/ds-extract-summit

## What it is

The design system for the Extract Summit event site. `label: "Extract Summit"`,
version `0.1.1`, `canonicalDoc.version` `1.0`. Its token tree is the outlier: a
"brutalist" scale with deeply-nested, kebab-named leaves and extreme typographic
range — the concrete proof that the codegen walker handles arbitrary shapes.

## The pieces

`packages/extract-summit/src/`:

- `foundations.ts` — `EXTRACT_SUMMIT_FOUNDATIONS`, assembled from named consts
  (`EXTRACT_SUMMIT_COLORS`, typography scales, `EXTRACT_SUMMIT_COMPONENTS`).
  Colors nest with `DEFAULT`/`hover`/`on` and kebab keys
  (`surface.card-border`, `ghost.on-black`); typography `size` runs `9`→`260`
  (`form-label` → `ghost-letterform`); `radius: { none: 0 }`,
  `shadow: { none: "none" }`. Uses `semanticColors` and ships a `components`
  contract.
- `content.ts` — narrative content (like Web, unlike Core/Scrapy).
- `design.body.md`, `changelog.ts`, `components.ts`, `documentation.ts`.
- `index.ts` — barrel including `content` (no branding/templates/assets).

## The contract

- Same build shape and export surface as every product. Its nested colors still
  emit correct `--extract-summit-<palette>-<leaf>` vars because the walker
  recurses and `DEFAULT` collapses — no special-casing in the codegen.
- The slug is the two-word `extract-summit`, so the export const is
  `EXTRACT_SUMMIT_FOUNDATIONS` (hyphen → underscore, upcased) and every var is
  `--extract-summit-*`.

## Gotchas

- Its structure is intentionally unlike the flat products — do not "normalize" it
  to match Web/Core; the shape is the brand.
- Extreme font sizes and negative letter-spacing are deliberate; they're still
  just numbers to the codegen (emitted with `px`).
- Colors are hand-maintained in the Figma plugin (not generated).

## Related

- [../architecture/codegen-engine.md](../architecture/codegen-engine.md) — why nested trees work
- [../conventions/token-authoring.md](../conventions/token-authoring.md) — the shape rules
- [ds-scrapy.md](./ds-scrapy.md) — the other nascent product
