---
type: Reference
title: Start here — the whole system on one page
description: What this repo is, its domain model, stack, dev loop, release/deploy loop, and the non-negotiables — in one read.
tags: [reference, overview, start-here]
origin: code
timestamp: 2026-08-29
---

# Start here — the whole system on one page

**Read the charter first:**
[conventions/definition-of-done.md](./conventions/definition-of-done.md) governs
every change. This page is the map; that doc is the law.

## What this is

A **pnpm monorepo whose product is design tokens.** One TypeScript source of
truth per product — `packages/<slug>/src/foundations.ts` — is compiled and run
through a codegen CLI into shippable artefacts, published to GitHub Packages, and
rendered live by a private Next.js dashboard. Downstream apps install the
packages; they never touch this repo's internals.

## The domain model

- **Product** — a design-system scope (`web`, `core`, `scrapy`, `extract-summit`),
  one `@zytedata/ds-<slug>` package. → [packages/index.md](./packages/index.md)
- **Foundations** — the typed token source of truth (`foundations.ts`, typed as
  `ProductFoundations`). → [conventions/token-authoring.md](./conventions/token-authoring.md)
- **Artefacts** — the generated `dist/` outputs consumers use: `tokens.css`,
  `tokens.scss`, `tokens.tailwind.cjs`, `tokens.json`, `design.md` (+ Web
  templates). → [architecture/output-surfaces.md](./architecture/output-surfaces.md)
- **Codegen** — `@zytedata/tokens-build`, the build-time engine that turns
  foundations into artefacts. → [architecture/codegen-engine.md](./architecture/codegen-engine.md)
- **Contract** — `@zytedata/ds-types`, the shared shapes.
  → [architecture/type-contract.md](./architecture/type-contract.md)
- **Dashboard** — `apps/dashboard`, the private DesignOps app that renders it all.
  → [architecture/dashboard-runtime.md](./architecture/dashboard-runtime.md)

## The stack (verified)

- **Monorepo:** pnpm `8.15.4` (pinned), Node ≥ `20.9`, TypeScript `^6`, workspaces
  `apps/*` + `packages/*`. Cross-package deps `workspace:*`.
- **Packages:** `@zytedata/ds-types`, `@zytedata/tokens-build`, and four
  `@zytedata/ds-*` products. `type: module`, `strict`, `NodeNext`.
- **Dashboard:** Next.js `16.3.3` (App Router; `middleware`→`proxy` rename),
  React `19.2.8`, Tailwind **v4** (CSS-first `@theme`), shadcn, `jose` for auth.
- **Release:** Changesets → GitHub Packages (`access: restricted`).
- **Deploy:** Vercel via CLI + `VERCEL_TOKEN` in `validate.yml`.
- **Reality checks:** **no test suite**, package `lint` scripts are stubs (only
  the dashboard lints), Prettier isn't in CI. See
  [environment/quality-gates.md](./environment/quality-gates.md).

## The dev loop

```bash
corepack enable && pnpm install
pnpm -r --filter "./packages/*" run build   # one-off; dist/ is gitignored
pnpm dev                                     # dashboard on :3000
```
Then edit `foundations.ts` → `pnpm --filter @zytedata/ds-<slug> run build:tokens`
→ refresh `/products/<slug>/foundations`. Full recipe:
[conventions/adding-a-token.md](./conventions/adding-a-token.md). Setup detail:
[environment/local-development.md](./environment/local-development.md).

## The release / deploy loop

Merge to `main` (CI `validate` green) → deploy job ships the dashboard to Vercel.
For a package version: merge with a `.changeset/*.md` → run the manual `release`
workflow to open the version PR → merge it → run `release` again to publish.
→ [environment/release-and-publish.md](./environment/release-and-publish.md)

## The non-negotiables (don't violate these)

1. One source of truth — never hand-edit `dist/`.
2. No arbitrary construction — follow a pattern or add a reviewed convention.
3. No secrets in code.
4. The dashboard stays `@zyte.com`-gated.
5. Published changes are dual-recorded (`changelog.ts` + changeset).

Each links to its enforcing doc in
[project/non-negotiables.md](./project/non-negotiables.md).

## Where to go next

New here? Read the ordered list in [index.md](./index.md). Changing a token?
[conventions/adding-a-token.md](./conventions/adding-a-token.md). Adding a product?
[conventions/adding-a-product.md](./conventions/adding-a-product.md).
