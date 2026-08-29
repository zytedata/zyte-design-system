---
type: Integration
title: The Figma plugin
description: How the figma-plugin syncs design tokens into Figma variables, the generated-vs-hand-maintained split, and its drift risk.
tags: [integration, figma, plugin, drift]
origin: code
timestamp: 2026-08-29
---

# The Figma plugin

## What it is

`figma-plugin/` is a Figma desktop plugin ("Zyte Design System 2.0") that creates
and syncs Figma color + typography **variable collections** from the design
system's per-product foundations, applies variables to a selection, and documents
frames. It is a **consumer** of the tokens, on the far side of the package
boundary.

## The pieces

- `manifest.json` — points at `code.js` (id `color-variable-scrapper`); opens
  `ui.html` (400×560).
- `code.js` — the plugin logic; handles messages `plot-colors`,
  `create-spec-page`, `create-typography-page`, `apply-variables`, `get-products`,
  `sync-product-foundations`, `document-frame`, … It embeds per-product
  foundations because a Figma plugin runs sandboxed (no `fs`/network at runtime).
- `scripts/gen-foundations.js` — regenerates the **Web** foundations block inside
  `code.js` from `packages/web/dist/tokens.json` (run
  `node figma-plugin/scripts/gen-foundations.js`; `--src <path>` / `$TOKENS_JSON`
  override). It rewrites the region between
  `// <<<GEN:WEB_FOUNDATIONS START>>>` / `... END>>>` markers. Chain:
  `foundations.ts` → `pnpm tokens:build` → `dist/tokens.json` → generator →
  `code.js`.
- `code-shadcn.js` — a separate, self-contained script (**not** wired into the
  manifest) that builds a shadcn-style primitive collection from its own
  hardcoded colors.

## The contract

- **Web is generated; Core / Scrapy / Extract Summit are hand-maintained.**
  `code.js` says so explicitly: web comes from the generator, the others are
  "hand-maintained mirrors for now" (a comment notes Phase 2 will replace them
  with an MCP `fetch`).
- Syncing after a color change (per the `change-foundation` skill §6):
  - **web** → build the package, then run `gen-foundations.js`.
  - **core/scrapy/extract-summit** → edit the matching `*_COLORS` object in
    `code.js` by hand, then `node --check figma-plugin/code.js`.
  Reloading the plugin in Figma is a manual user step.

## Gotchas

- **The plugin is git-tracked, NOT gitignored.** All 5 files are tracked
  (`.gitignore` has no figma entry). The `change-foundation` skill previously
  called it "gitignored / local-only"; that clause was corrected in this build to
  "git-tracked and hand-maintained."
- **Snapshot drift is real and current.** The embedded Web block is stamped with
  a generation timestamp and can lag `foundations.ts` (it was observed missing
  `typography.size."7xl"` added after the last regen). Regenerate after a Web
  token change, or the plugin serves stale values.
- Not part of the pnpm workspace (no `package.json`); run with plain `node`, no
  bundler, no build step.

## Related

- [../architecture/output-surfaces.md](../architecture/output-surfaces.md) — `tokens.json`, its input
- [../conventions/adding-a-token.md](../conventions/adding-a-token.md) — where the sync step lives
- [../packages/ds-web.md](../packages/ds-web.md) — the generated product
- [../project/wishlist.md](../project/wishlist.md) — the drift + doc-fix follow-ups
