<!--
  CHANGELOG (mock — see ./changelog.ts for the rendered version)
  - 2026-04-26 — maja      — changed: Tightened the "Do's and Don'ts" section.
  - 2026-04-20 — arkadiusz — added:   First draft mirroring the extract-summit canonical spec.
-->
---
version: alpha
name: Web
description: Zyte Web design system for the marketing website and docs UI.
colors:
  brand-500: "#DB005F"
  accent-primary-600: "#3F4FED"
  accent-secondary-500: "#F9433B"
  accent-secondary-purple-500: "#B02CCE"
  neutral-0: "#FFFFFF"
  neutral-50: "#FAFAFA"
  neutral-100: "#F5F5F5"
  neutral-200: "#E5E5E5"
  neutral-700: "#404040"
  neutral-900: "#171717"
typography:
  family:
    sans: "'Yellix', 'Yellix Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
  size:
    xs: 12
    sm: 14
    base: 16
    lg: 18
    xl: 20
    2xl: 24
    3xl: 30
    4xl: 36
    5xl: 48
    6xl: 60
  weight:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  lineHeight:
    none: 1
    tight: 1.25
    snug: 1.375
    normal: 1.5
    relaxed: 1.625
    loose: 2
  letterSpacing:
    tighter: -0.8
    tight: -0.4
    normal: 0
    wide: 0.4
    wider: 0.8
    widest: 1.6
rounded:
  none: 0
  sm: 2
  md: 6
  lg: 8
  xl: 12
spacing:
  0: 0
  1: 4
  2: 8
  3: 12
  4: 16
  6: 24
  8: 32
  12: 48
  16: 64
---

# Web — Design System

This document defines the visual and implementation language for **Zyte Web** (the marketing website, blog, pricing, and supporting docs UI).

The YAML front matter is the **machine-readable token layer** for agents. The prose below is the **human-readable implementation spec**.

## Overview

### Brand DNA

**Design direction:** Modern product-marketing editorial + confident technical tone.  
**Audience:** Builders and teams using Zyte products (engineers, data, product).  
**Voice:** Clear, direct, helpful. Crisp hierarchy; no visual noise.

### Core Principles

- Use **tokens** (CSS variables / SCSS tokens / product foundations) as the source of truth — avoid hard-coded hex and magic numbers.
- Prefer **strong typographic hierarchy** over decorative effects.
- Components should feel **composed from primitives**: spacing, radius, surface, and semantic colors.
- Keep layouts **responsive by default**; start from content width constraints and spacing scales.

## Colors

### Colour Tokens

Canonical palettes live in:

- `src/data/products/web/foundations.ts` (the full product snapshot used in Foundations + agentic bundle — includes every palette, scale and typography token)

Use the palette names as your mental model:

- **brand**: `primary` (e.g. `primary.500` = `#DB005F`)
- **accent**: `accentPrimary` (e.g. `accentPrimary.600` = `#3F4FED`)
- **supporting accents**: `accentSecondary`, `accentSecondaryPurple`
- **surfaces/text**: `neutral.*`

### Runtime Semantic Values

- **Primary CTA**: brand (`primary.500`) with accessible contrast
- **Links / emphasis**: accent primary (`accentPrimary.600`)
- **Negative/destructive**: accent secondary (`accentSecondary.600`–`700` range)
- **Backgrounds/surfaces**: neutrals (`neutral.0`–`100`), borders in `neutral.200`–`300`, text in `neutral.700`–`900`

### Colour Usage Rules

- Use **brand** for CTAs and high-salience highlights; don’t “paint the UI” with it.
- Use **accent primary** for links and secondary emphasis.
- Ensure **accessible contrast** on text, icons, and interactive states.

## Typography

### Font Loading

Web uses **Yellix** as the primary sans family. In the preview environment, the font may be approximated via fallbacks; in the website it is loaded via the existing font pipeline.

### Type Scale

Use tokenized sizes/weights (see front matter). Keep headings tight and body copy readable:

- Headings: semibold/bold, tighter line-height
- Body: regular, normal/relaxed line-height
- Mono: for code, snippets, token names, and technical metadata

## Layout

### Grid & Width

- Use consistent content widths (container + readable line length).
- Prefer 12-column thinking for complex pages, but don’t force columns when the content doesn’t need it.
- Spacing comes from this product's `spacing` scale in `foundations.ts`.

### Responsiveness

- Breakpoints mirror Tailwind's defaults (`sm/md/lg/xl/2xl`) — declared in this product's `breakpoint` scale.
- Components should stack cleanly and preserve hierarchy at small widths.

## Elevation & Depth

- Web uses **subtle** shadows from this product's `shadow` scale on raised surfaces.
- Avoid heavy blur/glow effects.
- Use borders + surface contrast first; add shadow only when it clarifies depth.

## Shapes

- Radius is tokenized in this product's `radius` scale.
- Default: rounded corners are allowed and should be consistent within a page.
- Avoid mixing many radii in one composition.

## Components

### Component Sources

- Web component catalog: `src/app/design-system-data/web/` (render-kit-backed list)
- Rendering source of truth: `zyte-website-nextjs` (via render-kit metadata)

### Composition Rules

- Use existing primitives: spacing, radius, surface, semantic color.
- Keep states explicit: hover/focus/active/disabled.
- Prefer consistent button/link patterns across pages.

## Do's and Don'ts

**Do**

- Build from tokens and product foundations.
- Keep hierarchy obvious: headings → subhead → body → meta.
- Use brand/accent sparingly and intentionally.

**Don’t**

- Hardcode colors or spacing values when token equivalents exist.
- Overuse shadows, gradients, or decorative patterns that compete with content.
- Introduce new “one-off” components when composition of existing ones works.

