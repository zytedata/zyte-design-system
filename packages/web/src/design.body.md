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

- `packages/web/src/foundations.ts` (the full product snapshot used in Foundations + agentic bundle — includes every palette, scale and typography token)

Use the palette names as your mental model:

- **surface layers (chrome)**: `surfaceDark.*` / `surfaceLight.*` — four-step stacks (background → page sections → secondary → cards) for dark and light app shells
- **surfaces/text (neutral ramp)**: `neutral.*` for borders, text, and legacy neutral fills
- **brand**: `primary` — **Zyte Fuchsia** (base `primary.600` = `#c026d3`)
- **accent (links / cool emphasis)**: `accentPrimary` (e.g. `accentPrimary.600` = `#3F4FED`)
- **secondary (stats, icons)**: `accentSecondary` — **Orange** (base `accentSecondary.500` = `#e8520a`)
- **orange on dark**: `accentSecondaryOnDark` (`#ff6b2b`) — brighter orange for icons/text on dark surfaces
- **headline gradient**: `headlineGradient` — linear **orange → fuchsia**; **headline highlights only**
- **supporting accent**: `accentSecondaryPurple`

### Runtime Semantic Values

- **Primary CTA / active brand**: `primary.600` (canonical fuchsia) with accessible contrast; lighter/darker steps for hover and pressed states
- **Links / technical emphasis**: `accentPrimary.600` (unchanged)
- **Secondary stats / icons**: `accentSecondary.500`–`600` range; use `accentSecondaryOnDark` on dark backgrounds where extra luminance is needed
- **Headline highlight**: `headlineGradient` only where editorial treatment calls for orange-to-fuchsia; not for UI chrome
- **Negative/destructive**: do **not** map to `accentSecondary` (it is now orange for marketing secondary). Prefer explicit destructive patterns or neutral emphasis until a dedicated destructive ramp exists.
- **Page chrome (dark UI)**: `surfaceDark.background` → `surfaceDark.pageSections` → `surfaceDark.secondary` → `surfaceDark.cards` for nested elevation
- **Page chrome (light UI)**: same layer names under `surfaceLight.*`
- **Backgrounds / text / borders (neutral ramp)**: `neutral.0`–`1000` for typography, borders (`neutral.200`–`300`), text (`neutral.700`–`900`); prefer **`surfaceLight` / `surfaceDark`** for app shell backgrounds instead of reusing arbitrary neutral stops for chrome

### Colour Usage Rules

- Use **brand (fuchsia)** for CTAs and high-salience highlights; don’t “paint the UI” with it.
- Use **accent primary** for links and cool secondary emphasis.
- Reserve **headline gradient** for display headlines, not buttons or form controls.
- Ensure **accessible contrast** on text, icons, and interactive states.

## Typography

### Font Loading

Web uses **Geist Sans** for UI/body and **Geist Mono** for code, via the [`geist`](https://www.npmjs.com/package/geist) package (Vercel). Token stacks in `foundations.ts` reference:

- `var(--font-geist-sans)` for `typography.family.sans`
- `var(--font-geist-mono)` for `typography.family.mono`

**Next.js (App Router):** install `geist`, then in the root layout attach the font variables (same names the tokens expect):

```tsx
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Map your global `font-family` / Tailwind `font-sans` / `font-mono` to those CSS variables so components pick up the loaded faces. Without these variables, the stack falls back to system UI fonts.

### Type Scale

Use tokenized sizes/weights (see front matter). Keep headings tight and body copy readable:

- Headings: semibold/bold, tighter line-height
- Body: regular, normal/relaxed line-height
- Mono: **Geist Mono** for code, snippets, token names, and technical metadata

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
- Use `headlineGradient` or `accentSecondaryOnDark` outside their documented roles (headlines / dark surfaces).
- Introduce new “one-off” components when composition of existing ones works.

