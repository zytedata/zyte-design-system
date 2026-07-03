# Web — Design System

This document defines the visual and implementation language for **Zyte Web** (the marketing website, blog, pricing, and supporting docs UI).

The YAML front matter is the **machine-readable token layer** for agents. The prose below is the **human-readable implementation spec**.

## How to use this file

This document is **self-contained**. Depending on how you obtained it, you're in one of two scenarios — read the one that applies:

**Scenario 1 — you installed the `@zytedata/ds-web` package (preferred).**

- **Tokens:** consume them from the package — `@zytedata/ds-web` ships `tokens.css`, `tokens.json`, `tokens.scss` and a Tailwind preset. Don't copy hex/spacing values by hand; import the token layer so you track updates.
- **Components & assets:** import from the package (e.g. the logo via `@zytedata/ds-web/assets/*` — see Logo → Asset source).
- Treat this file as the human/agent-readable **spec**; the package is the **runtime source of truth**.

**Scenario 2 — you only have this Markdown file (no package installed).**

- Everything you need to stay on-brand is **inline in this document**: the complete token set (colours, typography, spacing, radius, shadow, breakpoints, opacity) is in the **YAML frontmatter above**, the rules are in the **prose below**, and the **logo is embedded as an inline SVG** in the Logo section.
- Use the **frontmatter tokens as the source of truth** for all colour/type/spacing values. **Do not invent values** that are not present in this file.
- This is enough to design and build on-brand. To upgrade to live tokens, real components and all logo variants later, install `@zytedata/ds-web`.

> If you are reading a **use-case file** (marketing / report / deck), the base rules above still apply in full; the sections after the `---` divider are the use-case overlay and take precedence where they say `Overrides base:`.

## Overview

### Brand DNA

**Design direction:** Modern product-marketing editorial + confident technical tone. Clean, professional SaaS. Font: Yellix only. No exceptions. Never Inter, Geist, Roboto, or system fonts. Icons: Lucide only. Never inline SVG paths, never Font Awesome. Framework: Tailwind v3 + React. No custom CSS files unless absolutely necessary.

**Audience:** Builders and teams using Zyte products (engineers, data, product).  
**Voice:** Clear, direct, helpful. Crisp hierarchy; no visual noise.

### Core Principles

- Use **tokens** (CSS variables / SCSS tokens / product foundations) as the source of truth — avoid hard-coded hex and magic numbers.
- Prefer **strong typographic hierarchy** over decorative effects.
- Components should feel **composed from primitives**: spacing, radius, surface, and semantic colors.
- Keep layouts **responsive by default**; start from content width constraints and spacing scales.
- **Default to the light theme.** Light surfaces are the baseline for Web; dark is the deliberate exception (hero moments, code, immersive sections), not the default.
- Build with **Tailwind v3 + React**; avoid custom CSS files unless absolutely necessary.
- **Gradients are for hero sections only** — never on cards or components.
- **The nav is always white** (`#FFFFFF`) with a bottom border — never dark, never gradient (see Components → Navigation).
- Cards never have shadows. Outline only: 0.5px solid `neutral.200` (#e5e5e5). No box-shadow.


## Colors

### Colour Tokens

Canonical palettes live in:

- `packages/web/src/foundations.ts` (the full product snapshot used in Foundations + agentic bundle — includes every palette, scale and typography token)

Use the palette names as your mental model:

- **surface layers (chrome)**: `surfaceDark.*` / `surfaceLight.*` — four-step stacks (background → page sections → secondary → cards) for dark and light app shells
- **surfaces/text (neutral ramp)**: `neutral.*` for borders, text, and legacy neutral fills
- **brand**: `primary` — **Zyte Fuchsia** (base `primary.500` = `#b02cce`; `primary.600`/`primary.700` for hover/pressed)
- **secondary**: `secondary` — **Indigo / Navy** (base `secondary.500` = `#181e5a`)
- **accent**: `accent` — **Pink / Crimson** (base `accent.500` = `#db005f`); semantic `accent` role maps here
- **headline gradient**: `headlineGradient` — linear **orange → fuchsia**; **headline highlights only**

### Runtime Semantic Values

- **Primary CTA / active brand**: `primary.500` (#b02cce, fuchsia) — fill for the primary button; use `primary.600`/`primary.700` for hover and pressed states
- **Links / technical emphasis**: `primary.500` (#b02cce); hover `primary.700`
- **Secondary emphasis / accent highlights**: `accent.500`–`600` (rose #db005f); on dark backgrounds use a lighter step (`accent.300`/`accent.400`) for luminance
- **Headline highlight**: `headlineGradient` only where editorial treatment calls for orange-to-fuchsia; not for UI chrome
- **Negative/destructive**: foundations has **no destructive ramp** — use explicit hardcoded semantic values (see Components → Pills & Badges) or neutral emphasis until a dedicated ramp is added.
- **Page chrome (dark UI)**: `surfaceDark.background` → `surfaceDark.pageSections` → `surfaceDark.secondary` → `surfaceDark.cards` for nested elevation
- **Page chrome (light UI)**: same layer names under `surfaceLight.*`
- **Backgrounds / text / borders (neutral ramp)**: `neutral.0`–`1000` for typography, borders (`neutral.200`–`300`), text (`neutral.700`–`900`); prefer **`surfaceLight` / `surfaceDark`** for app shell backgrounds instead of reusing arbitrary neutral stops for chrome

### Colour Usage Rules

- Use **brand fuchsia** (`primary.500`) for the primary CTA and high-salience highlights; don’t “paint the UI” with it.
- Use **accent** (`accent.500`, rose) for secondary emphasis and accent highlights; links use brand fuchsia (`primary.500`).
- Use **secondary** (`secondary.500`) for section labels, eyebrows and section numbers.
- Reserve **headline gradient** for display headlines and the ribbon mnemonic, not buttons or form controls.
- Ensure **accessible contrast** on text, icons, and interactive states.

## Typography

### Font Families

- Yellix only. Never Inter, Roboto, Geist, Space Grotesk, or system fonts. Always set -webkit-font-smoothing: antialiased on html and body. Max weight: 700. Never 800 or 900.

- **Default / UI / body:** **Yellix** — the default Web typeface for running text, controls, captions and metadata. Tokenized as `typography.family.sans` → `var(--font-yellix), Yellix, …` (Geist Sans is the fallback if Yellix fails to load).
- **Display / headlines:** **Yellix** at weight 600 — the same face, used heavier for the main hero unit, headlines (H1/H2) and large display numbers. Tokenized as `typography.family.display` → `var(--font-yellix), Yellix, sans-serif`.
- **Code / technical:** **Geist Mono** — code, snippets, token names and technical metadata.


### Main Hero Unit

The hero is the single largest type moment on a page. Use the display face at its full weight:

```css
.hero-title {
  font-family: Yellix, sans-serif;
  font-feature-settings: normal;
  font-size: 68px; /* typography.size.7xl */
  font-variation-settings: normal;
  font-weight: 600;
}
```

- Exactly **one hero unit per page** — it is the H1 (see below). Size = `size.7xl` (68).
- Keep line-height tight; let the headline span at most two or three lines.
- Scale the `7xl` (68px) size down responsively at small breakpoints; never wrap awkwardly on mobile.

**Landing-page hero background.** The **landing-page** hero unit — and only that one — uses the brand navy → fuchsia diagonal gradient as its main background:

```css
.hero--landing {
  background: linear-gradient(
    113.78deg,
    rgb(19, 20, 87) 39.45%,
    rgb(176, 44, 206) 108.24%
  );
}
```

- This gradient is **exclusive to the landing-page hero** — don't reuse it on other heroes, sections, cards or UI chrome.
- On this background the hero is a dark surface: use reversed/light text and the white logo variant, and keep accessible contrast.

### Headings

Headings use **Yellix** at weight **600** with tight line-height. Keep a clear step between levels:

- **H1** — the hero unit: **`size.7xl` (68px) / 600**, `Yellix, sans-serif`. One per page. Don't add gradient to letters. 
- **H2** — major section titles: **`size.5xl` (48px) / 600**, `Yellix, sans-serif`.
- Lower levels (H3+) step down through the tokenized scale.
- Don't skip levels for visual sizing — pick the level by document structure, then style with tokens.

### Headline Usage

- A **headline** is the display-face title that opens a section or page. Use it to state the value, not to decorate.
- Pair each headline with **one sublead** (see below) and, where applicable, a **section number eyebrow** (see Sections).
- Reserve the `headlineGradient` (orange → fuchsia) for **headline highlights only** — never on buttons, body copy or UI chrome.
- One headline per section; don't stack competing display titles.
- **Never end a headline with a full stop.** Headlines (and subheads/display titles) carry no terminal period — e.g. "Extract data from any website", not "Extract data from any website." A question mark or exclamation mark is allowed when the headline genuinely asks or exclaims; a plain full stop is not.

### Subleads

A **sublead** is the supporting paragraph directly under a headline that expands on it.

- One sublead per headline. Set it in **Yellix, regular weight**, at a calm secondary text color (neutral ramp, not brand).
- Constrain to a readable measure (≈ 60–75 characters); don't let it run the full page width.
- The sublead clarifies — it never repeats the headline or introduces a second idea.

### Labels & Eyebrows

- **All labels and eyebrows use `text-transform: uppercase`.** This covers section labels, eyebrows, tags, and small overline text.
- Keep them short, with generous letter-spacing and a smaller size than body copy.
- **Section labels** sit on **no background — they are not pills or chips.** Render them as plain uppercase text in the **secondary** color (`secondary.500`).

### Numbers

- Use **tabular figures** (`font-variant-numeric: tabular-nums`) wherever numbers align or update — stats, tables, pricing, metrics — so columns and changing values don't jitter.
- Large display numbers (stat callouts, big metrics) use **Yellix at weight 600** to match the headline voice.
- Keep units and symbols consistent; don't mix figure styles within the same group.

### Font Loading

Web uses **Yellix** as the default UI/body and display face, with **Geist Sans** as the fallback and **Geist Mono** for code. Geist ships via the [`geist`](https://www.npmjs.com/package/geist) package (Vercel). Token stacks in `foundations.ts` reference `var(--font-yellix)` — it leads both `typography.family.sans` (default body/UI) and `typography.family.display` (headlines). Expose Yellix under that CSS variable and map your global `font-family` / Tailwind `font-sans` to it; without it, the stack falls back to an installed `Yellix`, then Geist Sans, then system UI.

Resolve the Yellix files from one of two sources, in this priority order.

1. **If the `@zytedata/ds-web` package is installed (npm) — preferred.** The package ships the Yellix `woff2`/`woff` files (weights 300/400/600/700, under `@zytedata/ds-web/fonts/*`) and a ready-made `@font-face` stylesheet.
   - Drop-in CSS (simplest): `import "@zytedata/ds-web/fonts.css";` once at your app root — this registers all four weights as `font-family: "Yellix"`. Then bind the token variable in your global CSS: `:root { --font-yellix: "Yellix"; }`.
   - Prefer `next/font/local`? Its `src.path` only accepts a path relative to the file it's called in, not a package specifier — so copy the four `Yellix-*.woff2` files out of `node_modules/@zytedata/ds-web/fonts/` into your app (e.g. `app/fonts/`) and point `localFont({ src, variable: "--font-yellix", display: "swap" })` at those local copies.
2. **If you only have this `design.md` file (package not installed) — fallback.** Use the hosted webfont on the design system site (served with permissive CORS, so it embeds cross-origin from anywhere).
   - Embed the ready-made `@font-face` stylesheet, then bind the variable:
     ```css
     @import url("https://zyte-design.vercel.app/fonts/yellix.css");
     :root { --font-yellix: "Yellix"; }
     ```
     (or `<link rel="stylesheet" href="https://zyte-design.vercel.app/fonts/yellix.css">` in the document head).
   - Direct downloads (self-host the files if you prefer): `https://zyte-design.vercel.app/fonts/Yellix-Light.woff2`, `…/Yellix-Regular.woff2`, `…/Yellix-SemiBold.woff2`, `…/Yellix-Bold.woff2` (each also available as `.woff`). The same files can be downloaded from the Typography page in the design system.

Yellix is a licensed typeface — use it only for Zyte properties and don't redistribute the files outside Zyte.

### Type Scale

Use tokenized sizes/weights (see front matter). Keep headings tight and body copy readable:

- Headings: **Yellix**, weight 600, tighter line-height (H1 `7xl` 68px, H2 `5xl` 48px — see Headings)
- Body: **Yellix** (default), regular, normal/relaxed line-height
- Mono: **Geist Mono** for code, snippets, token names, and technical metadata

## Layout

### Grid & Width

- Use consistent content widths (container + readable line length).
- Prefer 12-column thinking for complex pages, but don’t force columns when the content doesn’t need it.
- Spacing comes from this product's `spacing` scale in `foundations.ts`.

### Spacing & Rhythm

- **All spacing comes from the `spacing` scale** — never hand-pick pixel gaps. Padding, gaps and margins step through the same scale.
- Keep a consistent **vertical rhythm between sections**; major sections share the same top/bottom padding so the page reads as evenly stacked bands.
- Space components by **relationship**: tight gaps inside a group (label → headline → sublead), larger gaps between unrelated groups.
- Let content **breathe** — generous whitespace is part of the brand. Don't crowd cards, headlines or CTAs to fit more above the fold.

### Responsiveness

- Breakpoints mirror Tailwind's defaults (`sm/md/lg/xl/2xl`) — declared in this product's `breakpoint` scale.
- Components should stack cleanly and preserve hierarchy at small widths.

### Section Backgrounds

| Background | Use | Text colour |
|---|---|---|
| `surfaceLight.cards` #ffffff | Default content | `secondary.500` #181e5a |
| `surfaceLight.pageSections` #f0f0f2 | Alternating sections | `secondary.500` #181e5a |
| `primary.50` #fdf4ff | Feature sections | `secondary.500` #181e5a |
| `secondary.800` #101339 | Code / integration blocks | `neutral.0` #ffffff |
| `heroGradient` | Hero sections only | `neutral.0` #ffffff |



### Page Metrics

- **Page background:** `surfaceLight.background` #f7f7f8
- **Max content width:** 1080px · **narrow:** 898px — *layout constants; foundations has no `maxWidth`/`container` token scale yet (see note below)*
- **Section padding (desktop):** `spacing.32` (128)
- **Section padding (mobile):** `spacing.20` (80) vertical · `spacing.6` (24) horizontal
- **Card gap:** `spacing.5` (20)
- **Radius scale:** use `radius` tokens — `md` 6 / `lg` 8 / `xl` 12 / `2xl` 16 / `full` 9999

## Elevation & Depth

- Prefer **borders + surface contrast** over shadows to express depth.
- **No shadows on cards.** Cards are flat and defined by a 0.5px `neutral.200` (#e5e5e5) border only (see Components → Primitive Style Rules → Surfaces).
- Avoid heavy blur/glow effects; if a shadow is ever used it must be a single, subtle step from the `shadow` scale on a non-card surface.

## Shapes

### Shape Language

The shape language is **soft and consistent** — rounded corners drawn from the `radius` scale in `foundations.ts`; never square-cornered, and never an ad-hoc pixel value.

- Reference the `radius` tokens, don't hard-code pixels: `md` 6 · `lg` 8 · `xl` 12 · `2xl` 16 · `full` 9999.
- Per-component defaults (see Components → Primitive Style Rules):
  - Buttons, inputs, code blocks: `radius.lg` (8). Nav buttons and media frames: `radius.xl` (12).
  - Cards: `radius.2xl` (16).
  - Toggles / checkboxes: `radius.md` (6).
  - Pills, badges, avatars, pagination dots: `radius.full` (9999).
- Keep radii **consistent within a component group** — don't mix unrelated radii in one composition.
- **No shadows on cards** — a 0.5px `neutral.200` (#e5e5e5) border carries the edge instead.

## Components

### Component Sources

- Web component catalog: `src/app/design-system-data/web/` (render-kit-backed list)
- Rendering source of truth: `zyte-website-nextjs` (via render-kit metadata)

### Composition Rules

- Use existing primitives: spacing, radius, surface, semantic color.
- Keep states explicit: hover/focus/active/disabled.
- Prefer consistent button/link patterns across pages.

### Primitive Style Rules

Token-backed style rules for the generic primitives the UI is composed from. All values reference `foundations.ts`; literal values are shown inline for the key brand stops. Role split (aligned with `foundations.ts` naming): **primary CTA / active brand / nav / links / pills / badges = `primary.*` (fuchsia #b02cce)**, **secondary emphasis & accents = `accent.*` (rose #db005f)**, **text / eyebrows / labels = `secondary.*` (navy #181e5a)**.

Shared across all primitives unless overridden: font `typography.family.sans` (Yellix), max weight `weight.bold` (700), button/control padding `spacing.3` (12) y · `spacing.5` (20) x.

#### Buttons

Radius `radius.lg` (8) for all; nav buttons use `radius.xl` (12). Label `size.base` (16) · `weight.semibold` (600). Rounded, never square.

| Variant | Background | Text | Border | Radius | Notes |
|---|---|---|---|---|---|
| primary | `primary.500` #b02cce | `neutral.0` | — | `radius.lg` (8) | hover `primary.600` #c026d3 |
| secondary | transparent | `accent.500` | 2px `accent.500` | `radius.lg` (8) | |
| ghost | transparent | `secondary.500` #181e5a | 2px `secondary.500` | `radius.lg` (8) | |
| ghost-dark | transparent | `neutral.0` | 2px `neutral.0` @ `opacity.25` | `radius.lg` (8) | dark surfaces |
| nav-dark | `secondary.800` #101339 | `neutral.0` | — | `radius.xl` (12) | nav only |
| nav-accent | `primary.500` #b02cce | `neutral.0` | 1px `neutral.0` @ `opacity.25` | `radius.xl` (12) | nav only |
| disabled | `neutral.200` #e5e5e5 | `neutral.400` #a3a3a3 | — | `radius.lg` (8) | |

- One primary CTA per view — **never two primary buttons side by side**; pair with a quieter secondary/ghost.
- Labels follow the label rules — short, and uppercase where they act as eyebrow-style overlines.

#### Typography

| Element | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| Headline H1 | `family.display` | `size.7xl` (68) | 600 | `secondary.500` #181e5a | `lineHeight.tight` · `tracking.tight`; dark: `neutral.0`; highlight = `headlineGradient` (text-clip) only |
| Headline H2 | `family.display` | `size.5xl` (48) | 600 | `secondary.500` | |
| Headline H3 | `family.display` | `size.3xl` (30) | 600 | `secondary.500` | |
| Subtext (sublead) | `family.sans` | `size.lg` (18) | 400 | `neutral.600` #525252 | `lineHeight.relaxed`; ~60–75ch; dark: `neutral.300` |
| Body text | `family.sans` | `size.base` (16) | 400 | `neutral.700` #404040 | `lineHeight.normal` |
| Eyebrow | `family.sans` | `size.xs` (12) | 600 | `secondary.500` (label) · `primary.500` (section number) | `tracking.wider` (0.8) · UPPERCASE · no bg · mb `spacing.2`; dark: label `neutral.0`, number `primary.300` |
| Text link | `family.sans` | inherit | 500 | `primary.500` #b02cce | hover `primary.700`; dark: `neutral.0`→`primary.300`; trailing Lucide arrow `spacing.4` |

#### Pills & Badges

Radius `radius.full` · `size.xs` (12) · 600 · padding `spacing.1` (4) y · `spacing.3` (12) x.

| Variant | Background | Text |
|---|---|---|
| Pill (chip/tag) | `primary.50` #fdf4ff | `primary.500` #b02cce |
| Badge brand | `primary.100` #fae8ff | `primary.700` #a21caf |
| Badge neutral | `surfaceLight.pageSections` #f0f0f2 | `neutral.600` #525252 |
| Badge dark | `secondary.500` #181e5a | `neutral.0` |
| Badge success | `rgba(0,179,136,0.09)` ⚠ | #008A69 ⚠ |
| Badge warning | `rgba(255,158,27,0.1)` ⚠ | #a06010 ⚠ |
| Badge error | `rgba(219,0,4,0.07)` ⚠ | #A10003 ⚠ |

⚠ Semantic badge colours are hardcoded — foundations has no `success`/`warning`/`error`/`info` ramp yet.

#### Surfaces (Card / Media frame / Code block)

| Surface | Background | Text | Border | Radius | Padding |
|---|---|---|---|---|---|
| Card default | `surfaceLight.cards` #ffffff | inherit | 0.5px `neutral.200` #e5e5e5 | `radius.2xl` (16) | `spacing.6` (24) |
| Card feature | `surfaceLight.cards` #ffffff | inherit | 0.5px `neutral.200` + 3px top in accent colour | `radius.2xl` (16) | `spacing.6` (24) |
| Card pricing-featured | `primary.500` #b02cce | `neutral.0` | 1px `primary.500` | `radius.2xl` (16) | `spacing.6` (24) |
| Card on-dark | `surfaceDark.cards` #0d0d14 | `neutral.0` | 1px `neutral.0` @ `opacity.25` | `radius.2xl` (16) | `spacing.6` (24) |
| Media frame | `surfaceLight.cards` #ffffff | — | 1px `neutral.200` #e5e5e5 | `radius.xl` (12) | — |
| Code block | `surfaceDark.secondary` #0a0a0e | `neutral.300` #d4d4d4 | — | `radius.lg` (8) | `spacing.4` (16) |

- Cards carry **no shadow** — the 0.5px `neutral.200` (#e5e5e5) outline carries the edge; depth comes from border + surface contrast, not elevation.
- **Never use `Card default` on dark backgrounds — use `Card on-dark`.**
- Code block uses `family.mono` (Geist Mono) · `size.sm` (14); language switcher = Tab.

#### Form controls

| Element | Background | Text / Fill | Border | Radius | Notes |
|---|---|---|---|---|---|
| Input / select | `surfaceLight.cards` #ffffff | `secondary.500` #181e5a | 1px `neutral.300` #d4d4d4 | `radius.lg` (8) | focus ring 2px `primary.500`; padding `spacing.2`/`spacing.3` |
| Toggle / checkbox (active) | `accent.500` #db005f | `neutral.0` | — | `radius.md` (6) | |
| Tab inactive | — | `neutral.500` #737373 | — | — | padding `spacing.3` (12) · `weight.medium` (500) |
| Tab selected | — | `primary.500` #b02cce | 2px `primary.500` indicator | — | left or bottom indicator |

#### Atoms (Icon / Avatar / Rating / Pagination)

| Element | Color | Size | Radius | Notes |
|---|---|---|---|---|
| Icon | `currentColor` | `spacing.4/5/6` (16/20/24) | — | Lucide only; size explicit, consistent per group |
| Avatar | — | `spacing.8`/`spacing.10` (32/40) | `radius.full` | 1px `neutral.200` border optional |
| Rating (stars) | ⚠ no amber token | `spacing.4` (16) | — | Lucide Star; gap `spacing.0.5` (2) |
| Pagination dots | inactive `neutral.300` / active `primary.500` | `spacing.2` (8) | `radius.full` | gap `spacing.2` (8) |
| Pagination arrows | `neutral.500` → hover `secondary.500` | — | — | Lucide icon button |

- Import icons from `lucide-react`. **Never inline SVG paths, and never mix in Font Awesome** or other icon sets.
- Icons support text — they don't replace labels for primary actions; pair an icon with a label unless the control is unambiguous.
- Size icons explicitly and set colour on the parent so the icon inherits `currentColor`; keep weight/size consistent within a group.

#### Navigation

| Element | Value |
|---|---|
| Nav bar background | always `#FFFFFF` — **never dark, never gradient** |
| Nav bar border | `border-bottom: 1px solid` `surfaceLight.pageSections` #f0f0f2 (spec: #F3F4F5) |
| Nav buttons | `nav-dark` / `nav-accent` variants — `radius.xl` (12) (see Buttons) |
| Nav links / badges / pills | `primary.500` #b02cce (see Text link / Pills & Badges) |

> **Exception — transparent-on-hero nav.** Over the landing-page hero gradient the nav bar is transparent with the reversed (white) logo and light text; it becomes the white bar (above) on scroll / on all other pages.

> **Foundations gaps** (left as hashes / need a decision): on-dark opacities `0.05`/`0.1` are missing from the `opacity` scale (0/25/50/75/100) · no semantic `success`/`warning`/`error`/`info` ramp · no rating/amber token · no `maxWidth`/`container` scale (content widths 1080/898 are documented as constants).

## Sections

### Section Numbering & Eyebrows

Every major section opens with a **section number eyebrow** above the title:

- Format the eyebrow as an uppercase overline (e.g. `01`, `02`, `SECTION 01`) following the Labels & Eyebrows rules.
- It sits **above the headline**, on **no background — not a pill or chip**. Colour the **section number in brand `primary.500`** (fuchsia), on white background. On dark surfaces use `primary.300` for the number and label.
- Numbering runs in document order down the page and helps readers track where they are.
- Pair the eyebrow + headline + sublead as one tight group, then add section-scale spacing around it.

### Brand Mnemonic (Ribbon)

The **ribbon** is our brand mnemonic — a recognisable, repeatable shape device, not a generic decoration.

- Use it **sparingly** as a signature accent: a section divider, hero motif, or a way to draw the eye to a single key moment per page.
- It may carry the `headlineGradient` (orange → fuchsia) as a brand flourish; keep it out of dense UI, body copy and controls.
- One mnemonic per view — don't repeat the ribbon until it becomes wallpaper.
- Treat it as a brand asset: pull the approved shape, don't redraw or restyle it ad hoc.

## Logo

The Zyte logo is our most recognisable, most protected asset. Don't do any modifications. 

### Variants

- **Primary (brand fuchsia)** — the default wordmark for web, product UI, documents, slides and light surfaces.
- **Reversed (white)** — use on dark or photographic backgrounds where the fuchsia wordmark would fail contrast.
- **Monochrome (single ink or single white)** — one-colour print, embroidery, engraving or any context restricted to a single colour.
- **Gradient mark** — the alternative to the wordmark: a standalone, square symbol carrying the brand gradient. Use it as a favicon, app icon, avatar or in tight/square UI slots where the full lockup would drop below its minimum size.

### Rules

- The default logo is the primary (brand fuchsia) wordmark.
- One variant per surface — don't mix logo variants in the same view.
- The standalone gradient mark is the alternative to the wordmark — reserved for avatars, favicons, app icons and tight/square UI slots where the full lockup would fall below minimum size. It has its own baked-in gradient, so keep it on a plain surface and never recolour it.
- Minimum clear space equals the height of the ‘Z’ on all sides.
- Minimum size: 24 px tall for the mark, 96 px wide for the full lockup on screen.

### Asset source (how to obtain the logo)

Resolve the logo from one of two sources, in this priority order. Never recreate, trace, fetch or restyle the wordmark — only ever use a supplied SVG.

1. **If the `@zytedata/ds-web` package is installed (npm) — preferred.** Import the SVG from the package `assets` export. This is the canonical source; always use it when the package is available.
   - Import path: `@zytedata/ds-web/assets/<file>`
   - Variant → file:
     - Primary (brand fuchsia, default) → `logo.primary.svg`
     - Reversed (white) → `logo.reversed.svg`
     - Monochrome (single ink or single white) → `logo.mono.svg`
     - Gradient mark (alternative / favicon) → `mark.svg`
   - Example: `import logoUrl from "@zytedata/ds-web/assets/logo.primary.svg";`
   - Favicon example: `import faviconUrl from "@zytedata/ds-web/assets/mark.svg";`
2. **If you only have this `design.md` file (package not installed) — fallback.** Use the inline `<svg>` embedded directly below, verbatim, as the logo source. It is the primary (brand fuchsia) lockup. Do not fabricate, redraw or recolour it; the other variants are only available via the package above.

<svg xmlns="http://www.w3.org/2000/svg" width="74" height="32" fill="none" viewBox="0 0 192 83" color="currentColor"><path fill="#B02CCE" d="M113.082 0v13.728h-9.734v11.11h9.734V45.69c0 12.994 7.536 19.912 18.845 19.912 1.882 0 4.502-.211 6.281-.63V54.177c-1.153.316-2.512.42-3.769.42-5.654 0-9.63-2.62-9.63-9.118V24.838h13.399v-11.11h-13.399V0z"></path><path fill="#B02CCE" fill-rule="evenodd" d="M166.982 12.678c13.817 0 25.018 10.587 25.018 25.573 0 1.36-.108 3.984-.315 4.926h-39.258c1.467 7.548 6.699 12.263 14.969 12.263 6.285 0 11.206-2.934 12.25-7.337h11.724c-1.882 10.794-11.62 17.92-24.181 17.92-14.969 0-26.589-12.052-26.589-26.934s11.62-26.41 26.382-26.41m-.63 10.587c-6.911 0-11.935 3.668-13.61 9.956h26.589c-1.044-5.868-6.069-9.956-12.979-9.956" clip-rule="evenodd"></path><path fill="#B02CCE" d="m60.865 13.728 13.713 34.898 13.713-34.898h12.561L71.962 83H59.397l9.216-20.75-20.31-48.522zM31.419 24.942H0V13.728h45.746v11.214L14.24 53.763h31.506v11.214H0V53.763z"></path></svg>

**Do**

- Use the supplied SVGs at their native proportions.
- Place the logo on backgrounds that pass contrast requirements.

**Don’t**

- Stretch, rotate, recolour or add effects to the logo.
- Recreate the wordmark in a different typeface.
- Do not any additional elements to logo, like dots, squares on anything else. 

## Mark

The **gradient mark** is the standalone Zyte symbol — the alternative to the wordmark. Reach for it as a favicon, app icon, avatar or in any tight or square slot where the full lockup would drop below its minimum size. It carries its own baked-in gradient, so it always shows in full colour on a plain surface.

### Rules

- The mark is the alternative to the wordmark, not a replacement — prefer the full lockup wherever it fits and drop to the mark only in tight or square spaces.
- Use it for favicons, app icons, avatars and other small/square placements, especially below the wordmark’s 96px minimum width.
- It ships with a fixed gradient — never recolour, flatten or re-gradient it; place it on a plain, low-noise surface so the gradient stays legible.
- Keep clear space around the mark and never crop, rotate or distort the symbol.
- One mark, one gradient — don’t pair it with the wordmark in a single lockup or repeat it until it becomes a pattern.

### Asset source (how to obtain the mark)

Resolve the mark from one of two sources, in this priority order. Never recreate, trace or restyle it — only ever use the supplied SVG.

1. **If the `@zytedata/ds-web` package is installed (npm) — preferred.** Import the SVG from the package `assets` export.
   - Import path: `@zytedata/ds-web/assets/mark.svg`
   - Example: `import faviconUrl from "@zytedata/ds-web/assets/mark.svg";`
2. **If you only have this `design.md` file (package not installed) — fallback.** Use the inline `<svg>` embedded directly below, verbatim, as the mark source. Do not fabricate, redraw or recolour it.

<svg width="64" height="70" viewBox="0 0 386 421" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.3201 6.28266H322.063L348.141 56.949L337.71 68.8704H17.3201V6.28266Z" fill="url(#paint0_linear_41_1364)"/><path d="M115.604 237.849L115.606 237.849L309.419 6.1367L321.871 6.1367L348.39 56.7219L171.119 269.143L171.116 269.143L115.604 237.849Z" fill="url(#paint1_linear_41_1364)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M72.786 195.572H8.70803L8.70801 366.21L8.70803 377.374L63.7835 398.214L63.8449 398.249L168.316 273.063L115.288 238.789L72.786 289.602V195.572Z" fill="url(#paint2_linear_41_1364)"/><mask id="mask0_41_1364" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="6" width="341" height="393"><path d="M116.007 237.849L116.009 237.849L309.821 6.1367L322.274 6.1367L348.793 56.7219L171.522 269.143L171.519 269.143L116.007 237.849Z" fill="url(#paint3_linear_41_1364)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M72.9832 195.469H8.90527V377.272L63.9813 398.112L64.0421 398.147L168.513 272.961L115.485 238.687L72.9832 289.5V195.469Z" fill="url(#paint4_linear_41_1364)"/></mask><g mask="url(#mask0_41_1364)"><g opacity="0.75" filter="url(#filter0_f_41_1364)"><ellipse cx="146.013" cy="261.538" rx="44.4153" ry="34.0728" transform="rotate(-63.7746 146.013 261.538)" fill="black"/></g></g><path d="M8.54826 214.8L8.54566 195.439L59.424 168.615L385.696 364.604L352.701 419.534L8.54826 214.8Z" fill="url(#paint5_linear_41_1364)"/><path d="M8.54826 214.8L8.54566 195.439L59.424 168.615L385.696 364.604L352.701 419.534L8.54826 214.8Z" fill="url(#paint6_linear_41_1364)"/><defs><filter id="filter0_f_41_1364" x="73.6841" y="182.933" width="144.658" height="157.21" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="18" result="effect1_foregroundBlur_41_1364"/></filter><linearGradient id="paint0_linear_41_1364" x1="19.34" y1="9.25283" x2="281.613" y2="43.5271" gradientUnits="userSpaceOnUse"><stop stop-color="#7D1695"/><stop offset="1" stop-color="#E2337F"/></linearGradient><linearGradient id="paint1_linear_41_1364" x1="304.729" y1="105.224" x2="114.731" y2="330.987" gradientUnits="userSpaceOnUse"><stop stop-color="#E2337F"/><stop offset="1" stop-color="#FA6861"/></linearGradient><linearGradient id="paint2_linear_41_1364" x1="44.2571" y1="283.488" x2="92.6929" y2="384.079" gradientUnits="userSpaceOnUse"><stop stop-color="#FA6861"/><stop offset="1" stop-color="#F9423A"/></linearGradient><linearGradient id="paint3_linear_41_1364" x1="305.132" y1="105.224" x2="115.133" y2="330.987" gradientUnits="userSpaceOnUse"><stop stop-color="#E2337F"/><stop offset="1" stop-color="#CE55A3"/></linearGradient><linearGradient id="paint4_linear_41_1364" x1="44.4543" y1="283.385" x2="92.8902" y2="383.977" gradientUnits="userSpaceOnUse"><stop stop-color="#DF7585"/><stop offset="1" stop-color="#C34FAE"/></linearGradient><linearGradient id="paint5_linear_41_1364" x1="74.6432" y1="252.8" x2="383.111" y2="364.564" gradientUnits="userSpaceOnUse"><stop stop-color="#DF7585"/><stop offset="1" stop-color="#E89844"/></linearGradient><linearGradient id="paint6_linear_41_1364" x1="74.6432" y1="252.8" x2="383.111" y2="364.564" gradientUnits="userSpaceOnUse"><stop stop-color="#DE3C34"/><stop offset="1" stop-color="#973AE3"/></linearGradient></defs></svg>

**Do**

- Use the supplied mark SVG at its native proportions.
- Use it at favicon and app-icon sizes where the wordmark would be illegible.

**Don’t**

- Recolour, flatten or add effects to the mark’s gradient.
- Use the mark where the full wordmark comfortably fits.

## Voice & Tone

Our voice is the constant; our tone flexes with context. Marketing can be bold and energetic; product and errors stay calm, precise and reassuring. We write for busy engineers who value their time.

### Principles

- Lead with the value, then the detail — front-load the point.
- Short sentences. Active voice. Concrete nouns over buzzwords.
- Confident, not boastful — show results instead of claiming greatness.
- Helpful in failure — errors explain what happened and what to do next.

**Do**

- Say “extract data from any website” rather than “leverage synergistic data solutions”.
- Use “you” and “we”; keep it conversational.

**Don’t**

- Use hype words: revolutionary, game-changing, next-gen.
- Hide meaning behind jargon or acronyms.

## AI / Agentic Expression

As Zyte becomes more agentic, the brand extends to how AI speaks and behaves. The assistant is competent and candid — it shows its reasoning, flags uncertainty, and never pretends to be human.

### Principles

- Be transparent — distinguish generated output from verified data.
- Show confidence levels and sources; admit when unsure.
- Keep the assistant voice consistent with Voice & Tone — calm and precise.
- Use a consistent visual signal (e.g. accent shimmer) for AI-generated content.

**Do**

- Surface citations and let users verify agent output.
- Offer a clear way to undo or correct agent actions.

**Don’t**

- Imply certainty the model does not have.
- Anthropomorphise the assistant or give it a fake persona.

## Asset Usage

Brand assets — logos, icons, illustrations, templates — live in one place and ship in approved formats.

### Principles

- Pull assets from the central brand library, not from screenshots or old decks.
- Prefer SVG for logos and icons; use optimised raster only when required.
- Co-branding keeps equal clear space between Zyte and partner marks.
- Partner and press usage follows the published brand guidelines and licence.

**Do**

- Check the asset’s intended surface (light/dark) before placing it.
- Request new assets through the brand team rather than improvising.

**Don’t**

- Re-export or recolour assets to fit a one-off need.
- Distribute brand assets externally without approval.

## What NOT To Do

| ❌ Never | ✅ Instead |
|---|---|
| Inter, Roboto, Geist, system fonts | Yellix only |
| Font Awesome, custom SVG icon paths | Lucide only |
| box-shadow on cards | `0.5px solid` `neutral.200` (#e5e5e5) outline only |
| Hardcoded hex not in token list | Use tokens |
| `#DB005F` (rose `accent`) for the primary CTA | Use `#B02CCE` = `primary.500` (fuchsia) |
| `#DB005F` for nav / badges / pills | Use `#B02CCE` = `primary.500` (fuchsia) |
| Dark/gradient nav background | Nav is always `#FFFFFF` |
| gradient-hero on cards | Hero sections only |
| font-weight 800 or 900 | Max is 700 |
| border-radius outside scale | use `radius` tokens (6/8/12/16/9999) |
| Two primary buttons side by side | primary + ghost pairing |
| Full stop at the end of a headline | No terminal period on headlines/subheads (`?`/`!` only when the headline truly asks/exclaims) |
| Ignore tokens or product foundations | Build from `tokens` + product foundations |
| Flatten or bury the type hierarchy | Keep it obvious: heading → subhead → body → meta |
| Flood surfaces with brand/accent | Use brand/accent sparingly and intentionally |
| Mix multiple radii in one composition | One consistent radius per composition |
| Section labels/eyebrows as pills or with a background | Plain uppercase in `secondary` |
| `headlineGradient` on buttons, body or UI chrome | Headline highlights / ribbon only |
| New “one-off” components when composition works | Compose existing components |


