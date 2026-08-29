---
type: Project
title: Scope & roadmap
description: What this repo is for, what's in and out of scope, product maturity, and the phase signals in the codebase.
tags: [project, scope, roadmap, phases]
origin: code
timestamp: 2026-08-29
---

# Scope & roadmap

## What it is

The boundary of the project and where it's heading — grounded in what the code
and its own comments say, not an invented plan.

## The pieces

**In scope:** producing and shipping design tokens + machine-readable specs for
each Zyte product surface, and a private DesignOps dashboard to explore them.
This is the **producer** repo.

**Out of scope:** consuming the design system. Downstream apps
(`zyte-website-nextjs`, etc.) install the published `@zytedata/ds-*` packages;
they never clone this repo or run the codegen. The README's "Consuming" section
is guidance for those repos, not work that happens here.

**Product maturity** (by version + self-description):

- `@zytedata/ds-web` `0.6.0` — the mature, feature-complete product (branding,
  templates, assets).
- `@zytedata/ds-core` `0.1.1` — substantial semantic palette; early.
- `@zytedata/ds-scrapy` `0.1.1` — explicitly "foundations in progress."
- `@zytedata/ds-extract-summit` `0.1.1` — full brutalist token tree; early.

**Phase signals in the code (forward-looking, not built):**

- `.github/RELEASING.md` frames the publishable-package split as "Phase 2."
- `figma-plugin/code.js` notes a "Phase 2 (MCP)" intent: replace the
  hand-maintained core/scrapy/extract-summit Figma mirrors with a
  `fetch(mcpServerUrl + '/foundations/' + id)` call. **This is a comment, not an
  implementation** — there is no MCP server in this repo.

## The contract

- Treat product maturity as a design fact: expanding a nascent product's
  foundations is a design decision, not a cleanup
  ([../conventions/no-arbitrary-construction.md](../conventions/no-arbitrary-construction.md)).
- Deferred/roadmap work is filed in [wishlist.md](./wishlist.md), not built ad
  hoc.

## Gotchas

- Don't cite the "Phase 2 (MCP)" comment as an existing capability — it's an
  aspiration in a source comment.
- The dashboard is intentionally private and unpublished; it's not a product to
  ship, it's the window onto the products.

## Related

- [non-negotiables.md](./non-negotiables.md) — the risks/rules hub
- [wishlist.md](./wishlist.md) — the debt queue
- [../packages/index.md](../packages/index.md) — the products themselves
- [../00-start-here.md](../00-start-here.md) — the system in one page
