<!--
  CHANGELOG (mock — see ../changelogs.ts for the rendered version)
  - 2026-04-29 — arkadiusz — added: First draft. Foundations-only spec for Scrapy product surfaces.
-->
---
version: alpha
name: Scrapy
description: Zyte Scrapy design system covering documentation, dashboards and pattern libraries.
colors:
  brand-500: "#188644"
  brand-600: "#126B37"
  brand-700: "#0D522A"
  neutral-0: "#FFFFFF"
  neutral-50: "#FAFAFA"
  neutral-100: "#F5F5F5"
  neutral-200: "#E5E5E5"
  neutral-700: "#404040"
  neutral-900: "#171717"
typography:
  family:
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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

# Scrapy — Design System

This document defines the visual and implementation language for **Zyte Scrapy** surfaces (documentation, framework UI, ecosystem dashboards). Scrapy currently ships **foundations only** — a published component catalog will follow.

The YAML front matter is the **machine-readable token layer** for agents. The prose below is the **human-readable implementation spec**.

## Overview

### Brand DNA

**Design direction:** Open-source clarity — confident, technical, approachable.
**Audience:** Engineers, scientists, data teams, framework contributors.
**Voice:** Documentation-first. Concrete examples, copy-paste-ready code.

### Core Principles

- **Code is the hero.** Inline snippets and rendered runbooks dominate every page.
- **Green for go.** The Scrapy spider green (`primary.500` = `#188644`) signals action and identity.
- **Minimal chrome.** Doc layouts are content-led; chrome appears only when navigating.
- **Long-form readability.** Pick line lengths and spacing that survive 2000-word pages.

## Colors

### Colour Tokens

Canonical palettes live in:

- `src/data/products/scrapy/foundations.ts` (the full product snapshot — neutral surface is currently a duplicate of Web's neutrals, owned here and free to diverge)

Use the palette names as your mental model:

- **brand**: `primary` (Scrapy green; e.g. `primary.500` = `#188644`)
- **surfaces/text**: `neutral.*`

### Runtime Semantic Values

- **Primary CTA**: brand (`primary.500`)
- **Inline links**: brand (`primary.600` for resting, `700` for hover)
- **Code highlight**: brand (`primary.50`–`100` background, `primary.700` text)
- **Backgrounds**: `neutral.0`–`50`
- **Borders**: `neutral.100`–`200`
- **Body text**: `neutral.700`–`900`

### Colour Usage Rules

- Use **brand green** sparingly outside CTAs; once per content card or callout maximum.
- Don't recolour code blocks — they are syntax-highlighted by the doc renderer.
- Reserve `accentSecondary` and friends for cross-product callouts (Web → Scrapy bridges).

## Typography

### Font Loading

Scrapy uses **Inter** as the primary sans family. Load via the doc shell's font pipeline.

### Type Scale

Use tokenized sizes/weights (see front matter). Tune for long-form reading:

- Headings: semibold, tight line-height
- Body: regular, normal/relaxed line-height (`1.5`–`1.625`)
- Code (inline): mono, `sm`–`base`
- Code (blocks): mono, `sm`, `1.625` line-height, soft brand-tinted background

## Layout

### Grid & Width

- Documentation columns are width-capped at the `2xl` breakpoint for readability.
- Tables of contents anchor right on `lg`+, collapse into a top sticky chip on smaller viewports.
- Spacing comes from this product's `spacing` scale in `foundations.ts`.

### Responsiveness

- Breakpoints mirror Tailwind defaults — declared in this product's `breakpoint` scale.
- Code blocks scroll horizontally rather than wrap.

## Elevation & Depth

- Avoid shadows in long-form content.
- Reserve subtle shadows for floating menus (TOC popouts, sidebar copy buttons) only.

## Shapes

- Radius is tokenized in this product's `radius` scale.
- Default Scrapy radius is `md` (6px) for cards and `sm` (2px) for inline code — keep things visually quiet.

## Components

### Component Sources

- Scrapy component catalog: `src/data/products/scrapy/components.ts` (`SCRAPY_COMPONENT_CATEGORIES` — empty until the published library lands).
- Documentation surfaces: drawn from the same primitives once Scrapy components ship.

### Composition Rules

- Use existing primitives: spacing, radius, surface, semantic color.
- Keep code blocks copy-able (no decorative wrappers that block selection).
- Status banners (deprecated, breaking change) use a single brand-anchored colour.

## Do's and Don'ts

**Do**

- Build from tokens and shared foundations until Scrapy diverges.
- Lead with code samples, then explanatory prose.
- Document migration paths beside breaking changes.

**Don't**

- Wrap code blocks in heavy chrome (shadows, borders, rounded backgrounds).
- Use Scrapy green to indicate state (success/error) — keep it as identity only.
- Introduce ad-hoc page templates when the doc shell template works.
