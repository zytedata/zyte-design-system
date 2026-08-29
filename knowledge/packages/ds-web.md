---
type: Package
title: "@zytedata/ds-web"
description: The Web marketing design system — the richest product, shipping branding, use-case templates, and Yellix fonts + logo assets alongside tokens.
tags: [package, product, web]
origin: code
timestamp: 2026-08-29
---

# @zytedata/ds-web

## What it is

The design system for the public Zyte website (`zyte-website-nextjs`) — marketing
site, blog, pricing. `label: "Web"`, package version `0.6.0`,
`canonicalDoc.version` `1.3`. The most feature-complete product and the most
frequently changed file set in the repo (git hotspots: `design.body.md`,
`package.json`, `changelog.ts`).

## The pieces

`packages/web/src/`:

- `foundations.ts` — `WEB_FOUNDATIONS`. Flat Tailwind-style palettes
  (`primary`, `secondary`, `accent`, `neutral`) plus `surfaceDark`/`surfaceLight`
  layer models and gradient tokens (`headlineGradient`, `heroGradient` via
  `DEFAULT`). `semanticColors: { brand: "primary", accent: "accent",
  surface: "neutral" }`.
- `design.body.md` — the prose spec (Brand DNA: "Yellix only", "Lucide only",
  light-theme-default).
- `branding.ts` — `WEB_BRANDING` (editorial guidance; the only product that ships
  branding today).
- `content.ts` — `WEB_FRONTEND_STACK` / `WEB_DESIGN_LAYERS` narrative (describes
  the **consumer** app's stack, not this repo's).
- `components.ts` — `WEB_COMPONENT_CATEGORIES` (Marketing + Form contracts).
- `documentation.ts` — `WEB_DOCUMENTATION` (the Documentation-page content).
- `changelog.ts` — `WEB_FILE_CHANGELOGS`.
- `templates/` — `marketing`, `report`, `deck` overlays (each `<id>.md` +
  `<id>.html`), flattened into self-contained `dist/templates/<id>.md`.
- `assets/` — Yellix webfonts (`fonts/*`, `fonts/yellix.css`) and logo SVGs
  (`logo.primary/reversed/mono.svg`, `mark.svg`, `hero-ribbon.svg`), served via
  the package's extra `exports` (`./assets/*`, `./fonts.css`, `./fonts/*`).
- `index.ts` — barrel re-exporting all of the above.

## The contract

- Exports the full surface: the five token artefacts, `design.md`, typed
  `foundations`, plus the asset/font paths. See
  [../architecture/output-surfaces.md](../architecture/output-surfaces.md).
- It is the **only** product with `branding.ts`, `templates/`, and `assets/`
  (Extract Summit also ships `content.ts`). `readBranding` in the codegen picks up
  `WEB_BRANDING` and emits a `branding` block into `design.md`; other products
  omit it.
- Standard build/lint/typecheck shape (lint is an `echo` stub).

## Gotchas

- `canonicalDoc.version` (`1.3`) is the design-doc version, **not** the npm
  version (`0.6.0`); they move independently.
- Web's Figma foundations are the **generated** ones (via
  `gen-foundations.js` reading `dist/tokens.json`) — and the checked-in snapshot
  can drift (see [../integrations/figma-plugin.md](../integrations/figma-plugin.md)).
- Fonts/logos are copied straight from `src/assets/`, not codegen output — treat
  them as real committed source, not `dist/`.

## Related

- [../conventions/adding-a-token.md](../conventions/adding-a-token.md) — how to change its tokens
- [../architecture/output-surfaces.md](../architecture/output-surfaces.md) — its export surfaces
- [../integrations/figma-plugin.md](../integrations/figma-plugin.md) — the generated Figma snapshot
- [ds-core.md](./ds-core.md) — the sibling for app UI
