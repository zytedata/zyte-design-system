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

Canonical palette aliases live in:

- `src/data/products/core/foundations.ts` (the full product snapshot — Core today duplicates Web's accent-primary and neutral hexes as its own; values are owned by this file and free to diverge)

Use the palette names as your mental model:

- **brand**: `primary` (e.g. `primary.600` = `#3F4FED`) — Core re-exports Web's accent primary
- **supporting accents**: `accentSecondary`, `accentSecondaryPurple`
- **surfaces/text**: `neutral.*`

### Runtime Semantic Values

- **Primary CTA / focus ring**: brand (`primary.500`–`600`)
- **Negative / destructive**: accent secondary warm (`accentSecondary.500`–`700`)
- **Highlights**: accent secondary purple (`accentSecondaryPurple.500`)
- **Backgrounds**: `neutral.0`–`50` (light) and `neutral.700`–`900` (dark)
- **Borders / dividers**: `neutral.100`–`200` (light) and `neutral.700`–`800` (dark)

### Colour Usage Rules

- Reserve **brand** for the primary action in any flow. One per screen.
- Use **destructive** with `accentSecondary` only — never recolor warnings as `brand`.
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
