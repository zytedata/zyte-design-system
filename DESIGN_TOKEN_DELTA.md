# Design token delta (old → new)

Working document for **mapping deprecated or renamed tokens to their replacements** while iterating on the design system. Use it to plan `foundations.ts` edits, downstream migrations, and later to lift entries into per-package `changelog.ts` and consumer-facing release notes.

## How this relates to the repo

| Source of truth | Role |
|-----------------|------|
| `packages/*/src/foundations.ts` | Actual token values and structure shipped after build |
| `packages/*/src/changelog.ts` | Machine-readable file-level history (promote stable rows from the tables below) |
| `packages/*/src/design.body.md` | Prose spec; update when semantics or usage guidance change |

## Status

| Status | Meaning |
|--------|---------|
| `draft` | Proposed mapping, not implemented |
| `spec-only` | Documented in `design.body.md` or here; `foundations.ts` unchanged |
| `implemented` | Landed in `foundations.ts` (and build output) |
| `released` | Published in a versioned package; changelog entry added |

---

## Web (`@zyte/ds-web`)

### Brand colour direction (reference palette)

Source: Zyte Design System brand sheet — **Zyte Fuchsia** (primary), **Orange** (secondary), plus supporting tokens.

| Role | Base step | Hex | Usage |
|------|-----------|-----|--------|
| **Zyte Fuchsia** (primary) | **600** | `#c026d3` | Primary CTA, buttons, active states |
| Fuchsia scale | 50 → 300, **600 (base)**, 700 → 950 | *(full stops on sheet)* | Tint ramp for UI states |
| **Orange** (secondary) | **500** | `#e8520a` | Secondary only — stats, icons |
| Orange scale | 50 → 300, **500 (base)**, 600 → 900 | *(full stops on sheet)* | Tint ramp |
| **Orange (dark)** | — | `#ff6b2b` | Brighter orange for **dark** surfaces |
| **Gradient** | — | orange → fuchsia | **Headline highlights only** (linear orange → primary fuchsia) |

### Surface layers (reference — UI spec)

Structured **background → page sections → secondary → cards** for app chrome (dark and light). Use for page shell, regions, and elevated surfaces — distinct from brand/accent ramps above.

#### Dark mode

| Layer | Hex | Role |
|-------|-----|------|
| **Background** | `#000000` | Root canvas / app background |
| **Page sections** | `#060608` | Major layout regions under the root |
| **Secondary** | `#0a0a0e` | Nested surfaces (e.g. rails, inset bands) |
| **Cards** | `#0d0d14` | Elevated cards, panels, modals-on-dark |

#### Light mode

| Layer | Hex | Role |
|-------|-----|------|
| **Background** | `#f7f7f8` | Root canvas / app background |
| **Page sections** | `#f0f0f2` | Major layout regions under the root |
| **Secondary** | `#e8e8ec` | Nested surfaces (e.g. rails, inset bands) |
| **Cards** | `#ffffff` | Elevated cards, panels, modals-on-light |

### Delta — surface layers (`@zyte/ds-web`)

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| — *(no dedicated surface stack; `colors.neutral` used for chrome/text/borders)* | **`colors.surfaceDark`** | Flat map: `background` `#000000`, `pageSections` `#060608`, `secondary` `#0a0a0e`, `cards` `#0d0d14` — see tables above | `implemented` | 2026-05-14 |
| — | **`colors.surfaceLight`** | Flat map: `background` `#f7f7f8`, `pageSections` `#f0f0f2`, `secondary` `#e8e8ec`, `cards` `#ffffff` | `implemented` | 2026-05-14 |
| `semanticColors.surface` → `neutral` | *Follow-up* | Map `surface` semantic to new tokens (mode-aware in app) or keep `neutral` for text/border scale only — avoid double sources of truth | `draft` | 2026-05-14 |

### Delta vs `packages/web/src/foundations.ts` (today)

Current shipped Web tokens use this reference implementation in `foundations.ts`: **Zyte Fuchsia** primary (`colors.primary`, base `600` `#c026d3`), **Orange** secondary (`colors.accentSecondary`, base `500` `#e8520a`), **`accentSecondaryOnDark`** (`#ff6b2b`), **`headlineGradient`** (orange → fuchsia), plus existing `accentPrimary` (blue) and `accentSecondaryPurple` ramps. **Surface layers** (`colors.surfaceDark`, `colors.surfaceLight`) ship as four-step chrome stacks — see **Delta — surface layers**.

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| `colors.primary` (pink brand ramp; e.g. `500` `#DB005F`, `600` `#B5004F`) | `colors.primary` — **Zyte Fuchsia** | Tailwind-aligned fuchsia ramp; **base `600` = `#c026d3`**; usage: primary CTA, buttons, active | `implemented` | 2026-05-14 |
| `colors.accentSecondary` (coral/red; e.g. `500` `#F9433B`) | `colors.accentSecondary` — **Orange** | Full ramp; **base `500` = `#e8520a`**; usage: secondary only, stats, icons | `implemented` | 2026-05-14 |
| — | `colors.accentSecondaryOnDark` | `#ff6b2b` — brighter variant for dark surfaces | `implemented` | 2026-05-14 |
| — | `colors.headlineGradient` | `linear-gradient(90deg, #e8520a 0%, #c026d3 100%)` — headline highlights **only** | `implemented` | 2026-05-14 |
| `semanticColors` → `accentPrimary` / `accentSecondaryPurple` | *Follow-up* | Reconcile with new primary/secondary story (`accent` still points at `accentPrimary` today); update when semantic roles are finalized | `draft` | 2026-05-14 |

### Typography — snapshot (`packages/web/src/foundations.ts` today)

Sans/mono families target **Geist** through the same CSS variables the [`geist`](https://www.npmjs.com/package/geist) package defines for Next.js (`--font-geist-sans`, `--font-geist-mono`). Size / weight / line-height / letter-spacing ramps are unchanged from the prior Yellix-era scale unless you revise them separately.

| Group | Token key | Value |
|-------|-----------|--------|
| **family** | `sans` | `var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| **family** | `mono` | `var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace` |
| **size** (px) | `xs` … `6xl` | `12`, `14`, `16`, `18`, `20`, `24`, `30`, `36`, `48`, `60` |
| **weight** | `light` … `bold` | `300`, `400`, `500`, `600`, `700` |
| **lineHeight** | `none` … `loose` | `1`, `1.25`, `1.375`, `1.5`, `1.625`, `2` |
| **letterSpacing** | `tighter` … `widest` | `-0.8`, `-0.4`, `0`, `0.4`, `0.8`, `1.6` *(numeric values as authored in TS; see codegen for CSS output)* |

### Delta — Web typography

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| Yellix-based `typography.family.sans` | Geist Sans via `var(--font-geist-sans)` + system fallbacks | Install `geist`, apply `GeistSans.variable` (and mono) on root `<html>` per `design.body.md`. | `implemented` | 2026-05-14 |
| `typography.family.mono` (generic mono stack) | Geist Mono via `var(--font-geist-mono)` + system mono fallbacks | Same wiring as sans; see `design.body.md`. | `implemented` | 2026-05-14 |
| *(optional follow-up)* | Scale / weight / tracking tweaks | Revise steps when marketing requests a new type ramp; not required for the Geist cutover. | `draft` | 2026-05-14 |

---

## Core (`@zyte/ds-core`)

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| | | | `draft` | |

---

## Scrapy (`@zyte/ds-scrapy`)

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| | | | `draft` | |

---

## Extract Summit (`@zyte/ds-extract-summit`)

| Old token / path | New token / path | Value or notes | Status | Date |
|------------------|------------------|----------------|--------|------|
| | | | `draft` | |

---

## Cross-product / shared decisions

Decisions that affect more than one product (e.g. shared palette renames, global semantic aliases).

| Decision | Products | Notes | Status | Date |
|----------|----------|-------|--------|------|
| | | | `draft` | |

---

## Changelog snippets (copy when releasing)

Short lines you can paste into `packages/*/src/changelog.ts` under `foundations.ts` once a row is `released`:

```text
<!-- Example:
{ date: "YYYY-MM-DD", author: "you", kind: "changed", message: "Token X → Y (see DESIGN_TOKEN_DELTA.md)." },
-->
```
