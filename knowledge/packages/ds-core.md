---
type: Package
title: "@zytedata/ds-core"
description: The Core design system for platform, dashboards, and internal tools — a large role-based semantic palette.
tags: [package, product, core]
origin: code
timestamp: 2026-08-29
---

# @zytedata/ds-core

## What it is

The design system for the Core app surface — "platform, dashboards, internal
tools." `label: "Core"`, version `0.1.1`, `canonicalDoc.version` `1.0`. Where Web
optimizes for marketing legibility, Core carries the denser, role-based palette
app UI needs.

## The pieces

`packages/core/src/`:

- `foundations.ts` — `CORE_FOUNDATIONS`. A large **semantic** palette:
  `actionPrimary`, `accentPrimary`, `accentSecondaryCold`, `accentSecondaryWarm`,
  `colorGray`, `surface`, `colorBorder`, `text`, plus status ramps `info`,
  `success`, `warning`, `error`, single-value brand accents via `DEFAULT`
  (`white`, `black`, `parakeet`, `yolk`, `peachy`, `orange`, `blue`).
- `design.body.md`, `changelog.ts`, `components.ts`, `documentation.ts`.
- `index.ts` — barrel of `foundations`, `changelog`, `components`,
  `documentation` (no `branding`, `content`, `templates`, or `assets`).

## The contract

- Same build shape and export surface as every product (five token artefacts +
  `design.md` + typed `foundations`); no assets/branding/templates.
- `semanticColors` maps roles to these palette names — the codegen surfaces them
  in `tokens.json` under `semantic.color` and in `design.md` frontmatter.

## Gotchas

- The `change-foundation` skill notes Core's palette "mirrors the live Dash
  foundation palette" — treat Core as tracking a downstream app's colors, so
  value changes may need coordination with that app.
- Core's colors are **hand-maintained** in the Figma plugin (not generated) — a
  color change means editing `figma-plugin/code.js` directly if syncing. See
  [../integrations/figma-plugin.md](../integrations/figma-plugin.md).

## Related

- [../conventions/token-authoring.md](../conventions/token-authoring.md) — the shape rules
- [ds-web.md](./ds-web.md) — the marketing sibling
- [../architecture/output-surfaces.md](../architecture/output-surfaces.md) — its exports
