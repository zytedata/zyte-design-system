---
type: Architecture
title: The type contract (@zytedata/ds-types)
description: The shared TypeScript types that every product package and the dashboard depend on — the seam that keeps the system consistent.
tags: [architecture, types, contract, ds-types]
origin: code
timestamp: 2026-08-29
---

# The type contract (@zytedata/ds-types)

## What it is

`@zytedata/ds-types` is a **types-only** package (`packages/types/src/index.ts`,
~150 lines) that defines the shapes every product's source files are typed
against and that the codegen + dashboard both consume. It is the seam that makes
four independently-authored products interchangeable to the tooling.

## The pieces

Exported types (all in `packages/types/src/index.ts`):

- **`ProductFoundations`** — the token source-of-truth shape: `label`,
  `description`, `colors: ColorPalettes`, `semanticColors: Record<string,string>`,
  `typography: TypographyFoundations`, `spacing/radius/breakpoint/opacity/zIndex:
  NumericScale`, `shadow: StringScale`, optional `components:
  ProductComponentContract`, optional `canonicalDoc { assetPath, title, version }`.
- **`TypographyFoundations`** — `family: StringScale` + `size/weight/lineHeight/
  letterSpacing: NumericScale`.
- **`ColorPalettes`** = `Record<paletteName, Record<shade, hex>>`
  (`ColorShadeMap`).
- **`FileChangelog` / `FileChangeEntry`** — the `changelog.ts` shape (`file` +
  `entries[]` with `date/author/kind/message`, `kind ∈ added|changed|removed|fixed`).
- **`DsCategory` / `DsItem`** — the `components.ts` shape (grouped component
  contracts with `implemented?`).
- **`ProductDocumentation` / `DocSection` / `DocStep` / `DocCallout` /
  `DocCodeBlock`** — the `documentation.ts` shape rendered by the dashboard's
  Documentation page.
- **`ProductBranding` / `BrandingSection`** — the `branding.ts` shape rendered by
  the dashboard's Brand pages; section `slug`s must match the dashboard's Brand
  sub-navigation.
- **`FoundationColorRow`** — a UI row shape used by the dashboard.

## The contract

- **Everything typed against this compiles under `strict`.** A token that breaks
  `ProductFoundations` fails `Typecheck` (CI) — one of the few structural rules
  that _is_ machine-enforced.
- `ds-types` is a build dependency of every product and of `tokens-build`
  (`"@zytedata/ds-types": "workspace:*"`), and a dependency of the dashboard. It
  must build before them; `pnpm -r … build` handles the ordering.
- It ships **types only** — `dist/index.js` is effectively empty of runtime code;
  consumers import types (and the dashboard imports the concrete foundations from
  the product packages, not from here).

## Gotchas

- `components` and `canonicalDoc` are **optional** on `ProductFoundations`; Core
  and Scrapy omit `content.ts`/assets entirely. Don't assume a product ships
  every optional surface — check the package's `src/index.ts` barrel.
- Adding a required field here is a breaking change across all four products at
  once; prefer optional fields and migrate.

## Related

- [codegen-engine.md](./codegen-engine.md) — the consumer that walks these types
- [../conventions/token-authoring.md](../conventions/token-authoring.md) — authoring to this contract
- [../packages/ds-types.md](../packages/ds-types.md) — the package as a unit
