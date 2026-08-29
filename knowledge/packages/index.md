---
type: Index
title: Packages
description: The publishable workspace units — four product token packages plus the shared type contract and the codegen CLI.
tags: [index, packages]
origin: code
timestamp: 2026-08-29
---

# Packages

Everything under `packages/` is a publishable `@zytedata/*` workspace package
(the `apps/dashboard` consumer is documented under
[../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md)).
Cross-package deps are `workspace:*`; all publish to GitHub Packages with
`access: restricted`.

**Products** (each owns one `foundations.ts` + `design.body.md`):

- [ds-web.md](./ds-web.md) — `@zytedata/ds-web` (the richest product: branding,
  content, templates, Yellix fonts + logo assets).
- [ds-core.md](./ds-core.md) — `@zytedata/ds-core` (platform / dashboards /
  internal tools; large semantic palette).
- [ds-scrapy.md](./ds-scrapy.md) — `@zytedata/ds-scrapy` (Scrapy docs & patterns;
  self-described "foundations in progress").
- [ds-extract-summit.md](./ds-extract-summit.md) — `@zytedata/ds-extract-summit`
  (event site; brutalist nested scales — the schema-tolerance proof).

**Shared infrastructure:**

- [ds-types.md](./ds-types.md) — `@zytedata/ds-types`, the shared type contract.
- [tokens-build.md](./tokens-build.md) — `@zytedata/tokens-build`, the build-time
  codegen CLI.

All four products share an identical build shape (`build:js` → `build:tokens`),
the same `exports` map surfaces, and stub `lint` scripts (only the dashboard
lints for real — see [../environment/quality-gates.md](../environment/quality-gates.md)).
