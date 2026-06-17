# Core — Design System

This document defines the visual and implementation language for **Zyte Core** (the platform UI: dashboards, settings, admin surfaces, and internal tooling that backs the customer experience).

The YAML front matter is the **machine-readable token layer** for agents. The prose below is the **human-readable implementation spec**.

## Overview

### Brand DNA

**Design direction:** Functional, dense, and trustworthy — built for power users.
**Audience:** Customers and operators interacting with Zyte product internals.
**Voice:** Precise, status-first, helpful. Surface decisions clearly; never bury controls.

### Core Principles

- **Information density wins.** Default to compact, scannable layouts before any decorative spacing.
- **Status is signal.** Errors, warnings, and success states are first-class — never silent.
- **Predictable interactions.** Same control, same shortcut, same affordance everywhere.
- **Composition over configuration.** Build screens from a small set of primitives (cards, panels, tables) instead of one-off layouts.
- **Reuse Web's accent palette** until Core formally diverges (`brand` is `accentPrimary` from Web).

## Colors

### Colour Tokens

Core's palette mirrors the **live Dash foundation** (`dash-frontend-4rk/src/styles/colors/palette.scss`) — same names and hex values, 1:1. Tokens are owned by `foundations.ts` and emitted as `--core-*` CSS variables by `tokens-build`.

Primitive palettes:

- **actionPrimary** — magenta action ramp, base `actionPrimary.500` = `#db005f`
- **accentPrimary** — indigo ramp, base `accentPrimary.400` = `#3f4fed`
- **accentSecondaryCold** — purple, base `accentSecondaryCold.500` = `#b02cce` (the brand/primary semantic)
- **accentSecondaryWarm** — coral/red, base `accentSecondaryWarm.500` = `#f9433b`
- **colorGray** — cool blue-grey neutrals (`darker` `#33525f` → `lighter` `#f3f4f5`, plus `icon`)
- **surface** (`white`, `grey`, `lightBlue`) and **colorBorder** (`grey`)
- **text** — `text.700` `#050c4d` → `text.50` `#fefefe`
- **status ramps** — `info`, `success`, `warning`, `error` (steps 100–800)
- **legacy named brand colors** — `parakeet`, `yolk`, `peachy`, `orange`, `blue`, `lime`, `indigo`, `cobalt`, `pink`, plus `lightGreen` and `syntaxHighlight` (`keyword`/`string`/`number`)

### Runtime Semantic Values

`semanticColors` maps each role onto a primitive palette:

- **brand / primary CTA**: `accentSecondaryCold` (e.g. `.500` = `#b02cce`)
- **success**: `success.*` (base `#00b388`)
- **danger / destructive**: `error.*` (base `#db0004`)
- **warning**: `warning.*` (base `#ff9e1b`)
- **info**: `info.*` (base `#41b6e6`)
- **surface / backgrounds**: `surface.*`

### Colour Usage Rules

- Reserve **brand** (`accentSecondaryCold`) for the primary action in any flow. One per screen.
- Use status ramps for their meaning — `error` for destructive, `warning` / `success` / `info` for state; never recolor a warning as `brand`.
- Prefer `text.*` for foreground and `colorGray.*` for muted text / dividers over raw hex.
- Never tint disabled controls — use opacity from the shared opacity scale instead.

## Typography

### Font Loading

Core uses **Montserrat** as the primary sans family. Load via the platform shell's existing font pipeline.

### Type Scale

Use tokenized sizes/weights (see front matter). Keep tables tight and forms readable:

- Headings: semibold, tighter line-height
- Body / table cells: regular, snug line-height (`1.375`)
- Labels: medium weight, `xs` size
- Mono: for IDs, status codes, request payloads, anything machine-generated

## Layout

### Grid & Width

- Default to **fluid containers** — Core screens are tools, not magazine spreads.
- Use 12-column thinking inside dashboards; collapse to single-column on narrow viewports.
- Spacing comes from this product's `spacing` scale in `foundations.ts`.

### Responsiveness

- Breakpoints mirror Tailwind defaults — declared in this product's `breakpoint` scale.
- Below `md`, prefer hiding or collapsing rather than reflowing dense tables.

## Elevation & Depth

- Use **subtle** shadows from this product's `shadow` scale for raised panels (popovers, menus).
- Inline UI surfaces (cards, table rows) should rely on borders + `neutral` shifts, not shadows.
- Modal/overlay shadows can go a step heavier — reserved for blocking interactions.

## Shapes

- Radius is tokenized in this product's `radius` scale.
- Default Core radius is `md` (6px) — corners are present but quiet.
- Inputs and buttons share radius for visual consistency.

## Components

### Component Sources

- Core component catalog: `src/data/products/core/components.ts` (`CORE_COMPONENT_CATEGORIES`)
- Implementation source of truth: PrimeNG (overrides authored at the Core platform level)

### Composition Rules

- Use existing primitives: spacing, radius, surface, semantic color.
- Keep states explicit: hover/focus/active/disabled/loading.
- Forms ship inline validation + a top-level summary on submit.
- Tables ship sort, filter, and pagination as first-class controls.

## Do's and Don'ts

**Do**

- Build from tokens and product foundations.
- Treat status (error/warning/success) as a colour-coded contract.
- Write copy that names the next action.

**Don't**

- Hardcode hex or spacing values when token equivalents exist.
- Use `brand` for non-action affordances (hover backgrounds, headers, etc.).
- Hide errors in toasts only — surface them inline near the source.
- Introduce new "one-off" components when a primitive composition works.
