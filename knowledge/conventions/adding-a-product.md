---
type: Convention
title: "Recipe: adding a new product package"
description: How to add a fifth @zytedata/ds-* product — copy a sibling, wire the dashboard resolver tables, verify.
tags: [recipe, product, package, workflow]
origin: .github/RELEASING.md
timestamp: 2026-08-29
---

# Recipe: adding a new product package

## What it is

Adding a new design-system product (a fifth `@zytedata/ds-<slug>`). The canonical
short form lives in [`.github/RELEASING.md`](../../.github/RELEASING.md)
("Adding a fifth product") and in the README; this doc sequences it against the
KB with the wiring that's easy to miss.

## The pieces (from repo root)

1. **Scaffold from a sibling.**
   ```bash
   mkdir -p packages/<slug>/src
   ```
   Copy a sibling's `package.json` + `tsconfig.json` + `tsconfig.build.json`
   (Core is the leanest template) and rename the package to
   `@zytedata/ds-<slug>`. The slug must be kebab-case and match the regex the
   codegen enforces: `^@zytedata/ds-([a-z][a-z0-9-]*)$`.

2. **Add the source files** under `src/`:
   - `foundations.ts` exporting `<SLUG>_FOUNDATIONS: ProductFoundations`
     (export name = slug upcased, `-`→`_`, `+ _FOUNDATIONS`).
   - `design.body.md` (prose spec).
   - `index.ts` barrel re-exporting the modules you ship.
   - `changelog.ts`, and optionally `components.ts` / `content.ts` /
     `documentation.ts` / `branding.ts`.

3. **Register it in the build fan-outs.** The root `package.json` `tokens:build`
   and `tokens:check` scripts hard-code the product list:
   `--filter "./packages/{web,core,scrapy,extract-summit}"`. **Add your slug**
   there or the root token scripts (and CI's `tokens:check`) will skip it.

4. **Link + build + verify.**
   ```bash
   pnpm install                                   # re-link workspace bins
   pnpm -r --filter "./packages/<slug>" run build
   pnpm tokens:check
   ```

5. **Wire the dashboard** so the product renders:
   - `apps/dashboard/src/data/products.ts` — add the product entry + nav.
   - `apps/dashboard/src/data/foundations/index.ts` — import
     `<SLUG>_FOUNDATIONS` / `<SLUG>_FILE_CHANGELOGS` and add to the maps.
   - `apps/dashboard/src/data/foundations/docs.ts` — add the slug to the
     `SLUG_BY_PRODUCT_ID` resolver table.
   - `apps/dashboard/src/app/(app)/products/[productId]/layout.tsx` — the
     per-product layout that injects `dist/tokens.css`.
   - `next.config.ts` — add `@zytedata/ds-<slug>` to `serverExternalPackages`
     and add `packages/<slug>/dist/**` to `outputFileTracingIncludes` so the
     Vercel lambda can read the artefacts. See
     [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md).

6. **Changeset + changelog** for the new package, then PR per
   [adding-a-token.md](./adding-a-token.md) step 7.

## The contract

- The slug is load-bearing: it drives the package name, the export name, every
  `--<slug>-*` CSS var, the `tokens.json` `$product`, and the dashboard route.
  Pick it once and keep it consistent.
- `tokens:check` will only cover the new product **after** step 3 (the root
  filter list). Verify with `pnpm tokens:check` and confirm your slug appears in
  the output.

## Gotchas

- Missing the `serverExternalPackages` / `outputFileTracingIncludes` wiring
  (step 5) works locally but **breaks the Vercel build** — the lambda won't
  bundle the new `dist/`. This is the most common miss.
- Forgetting step 3 is silent: the package builds under `pnpm -r ... build` (a
  recursive fan-out) but `pnpm tokens:build`/`tokens:check` (the pinned list)
  skip it, so CI's `tokens:check` never validates it.

## Related

- [../environment/release-and-publish.md](../environment/release-and-publish.md) — the release pipeline
- [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md) — how the dashboard resolves packages
- [../packages/index.md](../packages/index.md) — the existing products as templates
- [no-arbitrary-construction.md](./no-arbitrary-construction.md) — copy the pattern, don't invent one
