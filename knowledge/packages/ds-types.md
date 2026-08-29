---
type: Package
title: "@zytedata/ds-types"
description: The types-only package defining ProductFoundations and every other shape the products, codegen, and dashboard share.
tags: [package, types, contract]
origin: code
timestamp: 2026-08-29
---

# @zytedata/ds-types

## What it is

The shared TypeScript contract for the whole system — types only, no runtime
logic. Version `0.1.0`. Every product package and `tokens-build` depend on it
(`workspace:*`), and the dashboard consumes it too.

## The pieces

- `packages/types/src/index.ts` — all exported types (see
  [../architecture/type-contract.md](../architecture/type-contract.md) for the
  full list: `ProductFoundations`, `TypographyFoundations`, `ColorPalettes`,
  `FileChangelog`, `DsCategory`, `ProductDocumentation`, `ProductBranding`, …).
- `package.json` — `type: module`, `main`/`types` → `dist/index.js` /
  `dist/index.d.ts`, single `.` export. `build` = `tsc -p tsconfig.build.json`.
- `tsconfig.json` / `tsconfig.build.json` — `strict`, `NodeNext`,
  `isolatedModules`; the build config emits declarations + maps to `dist/`.

## The contract

- Must build **before** its dependents; `pnpm -r … build` orders this.
- `lint`/`lint:fix` are `echo` stubs — there is no linter here. `typecheck` =
  `tsc --noEmit`.
- Adding a **required** field to `ProductFoundations` breaks all four products at
  once; prefer optional fields.

## Gotchas

- It's tempting to put helper functions here; keep it types-only. Runtime helpers
  belong in `tokens-build` (build-time) or the dashboard (app).
- `dist/` is git-ignored and rebuilt on install/CI like every package.

## Related

- [../architecture/type-contract.md](../architecture/type-contract.md) — the types in detail
- [tokens-build.md](./tokens-build.md) — the primary consumer
- [../conventions/token-authoring.md](../conventions/token-authoring.md) — authoring to the contract
