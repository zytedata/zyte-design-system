---
type: Architecture
title: The dashboard runtime (apps/dashboard)
description: How the Next.js DesignOps app resolves and renders each product's generated dist/ artefacts at request time.
tags: [architecture, dashboard, nextjs, runtime, fs]
origin: code
timestamp: 2026-08-29
---

# The dashboard runtime (apps/dashboard)

## What it is

`apps/dashboard` is the private DesignOps app (Next.js 16.3.3, React 19.2.8,
Tailwind v4, shadcn) that renders each product's tokens, palette, typography,
`design.md`, brand pages, and changelog. It is **never published** (it's in the
Changesets `ignore` list). It consumes the product packages two ways: static TS
imports for typed data, and **filesystem reads of `dist/`** for generated
artefacts.

## The pieces

- **Two data paths:**
  - *Typed objects* (foundations, changelogs) come from normal package imports —
    `apps/dashboard/src/data/foundations/index.ts` imports `WEB_FOUNDATIONS`,
    `WEB_FILE_CHANGELOGS`, etc. and builds `PRODUCT_FOUNDATIONS` /
    `PRODUCT_CHANGELOGS` maps. `src/data/products.ts` is static product/nav config.
  - *Generated artefacts* (`tokens.{json,css,scss,tailwind.cjs}`, `design.md`)
    are read from disk in `apps/dashboard/src/data/foundations/docs.ts` via
    `fs.promises.readFile`, path-joined at
    `process.cwd()` → `../..` (workspace root) → `packages/<slug>/dist/<file>`.
- **Why `fs` and not `require.resolve`:** `docs.ts` carries a load-bearing comment
  — Turbopack rewrites `import.meta.url` to a bundle-internal path that can't see
  the workspace `node_modules`, so anchoring at `process.cwd()` is the one
  strategy that works in local dev, the Vercel lambda, and future registry
  installs. The per-product layout
  `apps/dashboard/src/app/(app)/products/[productId]/layout.tsx` reads
  `dist/tokens.css` the same way and injects it via a `<style>` block;
  `src/data/git-status.ts` reuses the same workspace-root anchor too, but for
  `execFile` git branch/sha status — not artefact reads.
- **Next config wiring** (`apps/dashboard/next.config.ts`) makes the `fs` reads
  survive bundling: `serverExternalPackages` lists all `@zytedata/ds-*` (they ship
  non-JS artefacts read at runtime), `outputFileTracingRoot` = workspace root, and
  `outputFileTracingIncludes` explicitly bundles `packages/{web,core,scrapy,extract-summit}/dist/**`
  per route (Next's tracer can't follow dynamic `fs.readFile`).
- **Routing:** App Router under `src/app/`, with an authenticated route group
  `(app)/` and dynamic product routes `(app)/products/[productId]/{foundations,
  documentation,changelog,brand,assets,templates,studio,agentic,...}`. Other
  `(app)/` routes: a component catalog (`components`, `components/[slug]`) and
  top-level `templates` + `prototyping`. Outside the group: `/` (public landing),
  `/sign-in`, `/test`, `/p` (the share-link viewer — see below), and `src/app/api/`
  (OAuth + Studio).
- **Share links** (`src/lib/share-link.ts` + the `/p` route): a page's HTML is
  deflated + base64url-encoded into the URL **fragment** (`/p#<token>`) and decoded
  entirely client-side — nothing is stored or sent to the server. `/p` is **not**
  in the proxy matcher exclusions, so it is still behind the auth gate like any
  other app route (see [auth-model.md](./auth-model.md)).
- **UI:** shadcn primitives in `src/components/ui/*`; feature components grouped
  under `components/{layout,products,foundations,brand,assets,landing,studio,
  templates,common,providers}`. `cn()` = `twMerge(clsx(...))` in `src/lib/utils.ts`.

## The contract

- The dashboard **requires each product's `dist/` to exist** before it can render
  it. The `predev`/`prebuild` hooks run `pnpm -w run tokens:build` first; a fresh
  checkout still needs one `pnpm -r --filter "./packages/*" run build`.
- `readCanonicalDoc` reads `dist/design.md` with **no fallback** to
  `src/design.body.md` — a missing build surfaces as "missing," never as stale.
- Adding a product means adding it to `serverExternalPackages`,
  `outputFileTracingIncludes`, and the `SLUG_BY_PRODUCT_ID` resolver — see
  [../conventions/adding-a-product.md](../conventions/adding-a-product.md).

## Gotchas

- **Failures degrade to `null`/`[]` silently.** The `fs` helpers are wrapped
  `try { … } catch { return null; }` with **no logging anywhere** in the app (see
  [observability.md](./observability.md)). "Why is my artefact missing" has no log
  line — inspect the null-returning call site.
- **No `error.tsx`, `not-found.tsx`, or `loading.tsx`** exist in `src/app/` — the
  app has no custom error boundary or loading UI. Adding a route that can throw
  won't get a friendly error page unless you add one.
- The dashboard uses **Tailwind v4 CSS-first** (`@theme` in `src/app/globals.css`,
  oklch, no `tailwind.config.*`); it does **not** use the packages' v3 Tailwind
  presets. Don't conflate the two systems.

## Related

- [output-surfaces.md](./output-surfaces.md) — the artefacts it reads
- [auth-model.md](./auth-model.md) — the Google/JWT gate in front of it
- [../integrations/llm-providers.md](../integrations/llm-providers.md) — the Markdown Studio AI feature
- [../conventions/adding-a-product.md](../conventions/adding-a-product.md) — wiring a new product in
