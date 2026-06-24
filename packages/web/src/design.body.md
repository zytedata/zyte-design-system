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
- **Default to the light theme.** Light surfaces are the baseline for Web; dark is the deliberate exception (hero moments, code, immersive sections), not the default.

## Colors

### Colour Tokens

Canonical palettes live in:

- `packages/web/src/foundations.ts` (the full product snapshot used in Foundations + agentic bundle — includes every palette, scale and typography token)

Use the palette names as your mental model:

- **surface layers (chrome)**: `surfaceDark.*` / `surfaceLight.*` — four-step stacks (background → page sections → secondary → cards) for dark and light app shells
- **surfaces/text (neutral ramp)**: `neutral.*` for borders, text, and legacy neutral fills
- **brand**: `primary` — **Zyte Fuchsia** (base `primary.600` = `#c026d3`)
- **secondary**: `secondary` — **Indigo / Navy** (base `secondary.500` = `#181e5a`)
- **accent**: `accent` — **Pink / Crimson** (base `accent.500` = `#db005f`); semantic `accent` role maps here
- **headline gradient**: `headlineGradient` — linear **orange → fuchsia**; **headline highlights only**

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
- Use **secondary** (`secondary.500`) for section labels, eyebrows and section numbers.
- Reserve **headline gradient** for display headlines and the ribbon mnemonic, not buttons or form controls.
- Ensure **accessible contrast** on text, icons, and interactive states.

## Typography

### Font Families

- **Default / UI / body:** **Yellix** — the default Web typeface for running text, controls, captions and metadata. Tokenized as `typography.family.sans` → `var(--font-yellix), Yellix, …` (Geist Sans is the fallback if Yellix fails to load).
- **Display / headlines:** **Yellix** at weight 600 — the same face, used heavier for the main hero unit, headlines (H1/H2) and large display numbers. Tokenized as `typography.family.display` → `var(--font-yellix), Yellix, sans-serif`.
- **Code / technical:** **Geist Mono** — code, snippets, token names and technical metadata.

### Main Hero Unit

The hero is the single largest type moment on a page. Use the display face at its full weight:

```css
.hero-title {
  font-family: Yellix, sans-serif;
  font-feature-settings: normal;
  font-size: 68px;
  font-variation-settings: normal;
  font-weight: 600;
}
```

- Exactly **one hero unit per page** — it is the H1 (see below).
- Keep line-height tight; let the headline span at most two or three lines.
- Scale the `68px` size down responsively at small breakpoints; never wrap awkwardly on mobile.

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

- **H1** — the hero unit: **68px / 600**, `Yellix, sans-serif`. One per page.
- **H2** — major section titles: **~44px / 600**, `Yellix, sans-serif`.
- Lower levels (H3+) step down through the tokenized scale; switch to Geist Sans for sub-headings inside body content where the display face would feel too loud.
- Don't skip levels for visual sizing — pick the level by document structure, then style with tokens.

### Headline Usage

- A **headline** is the display-face title that opens a section or page. Use it to state the value, not to decorate.
- Pair each headline with **one sublead** (see below) and, where applicable, a **section number eyebrow** (see Sections).
- Reserve the `headlineGradient` (orange → fuchsia) for **headline highlights only** — never on buttons, body copy or UI chrome.
- One headline per section; don't stack competing display titles.

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

Web uses **Yellix** as the default UI/body and display face, with **Geist Sans** as the fallback and **Geist Mono** for code. Geist ships via the [`geist`](https://www.npmjs.com/package/geist) package (Vercel). Token stacks in `foundations.ts` reference:

- `var(--font-yellix)` leads both `typography.family.sans` (default body/UI) and `typography.family.display` (headlines)
- `var(--font-geist-sans)` is the `sans` fallback if Yellix fails to load
- `var(--font-geist-mono)` for `typography.family.mono`

**Yellix** is not on npm — load it as a local font (`next/font/local`) and expose it as the `--font-yellix` CSS variable so the `sans` and `display` tokens resolve; if it fails to load, the stack falls back to an installed `Yellix`, then Geist Sans.

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

- Headings: **Yellix**, weight 600, tighter line-height (H1 68px, H2 ~44px — see Headings)
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

## Elevation & Depth

- Prefer **borders + surface contrast** over shadows to express depth.
- **No shadows on cards.** Cards are flat and defined by a slate border only (see Components → Cards).
- Avoid heavy blur/glow effects; if a shadow is ever used it must be a single, subtle step from the `shadow` scale on a non-card surface.

## Shapes

### Shape Language

The shape language is **soft and consistent** — a single, calm radius across the whole UI:

- **`border-radius: 12px` everywhere.** One radius for cards, buttons, inputs, chips and pills — don't mix multiple radii in a composition.
- **Buttons always use the 12px radius** (rounded, never square-cornered) — see Components → CTA Buttons.
- Apply the same 12px corner to cards, inputs and any contained surface so elements feel like one family.
- Radius is tokenized in this product's `radius` scale — reference the token, don't hard-code `12px` in components.
- **No shadows on cards** — a slate border carries the edge instead.

## Components

### Component Sources

- Web component catalog: `src/app/design-system-data/web/` (render-kit-backed list)
- Rendering source of truth: `zyte-website-nextjs` (via render-kit metadata)

### Composition Rules

- Use existing primitives: spacing, radius, surface, semantic color.
- Keep states explicit: hover/focus/active/disabled.
- Prefer consistent button/link patterns across pages.

### CTA Buttons

- The **primary CTA** uses brand fuchsia (`primary.600`) with **weight 600** label text.
- **Buttons use the 12px `border-radius`** (rounded corners, never square) — same radius as cards and inputs.
- Keep one primary CTA per view; pair with a quieter secondary/ghost button for the alternate action.
- Button labels follow the label rules — short and, where they act as eyebrow-style overlines, uppercase.

### Cards

- Cards are **flat**: **slate border only, no shadow.** Depth comes from the border and surface contrast, not elevation.
- Use the **12px `border-radius`** consistently across all cards.
- Build card internals from the spacing scale; keep padding consistent across a card grid.
- Don't reach for shadows, gradients or heavy fills to make a card stand out — hierarchy comes from type and spacing.

### Icons

- Use **[Lucide](https://lucide.dev/)** as the single icon library across Web — don't mix in other icon sets.
- Use Lucide icons at their native stroke style; size them from the spacing/type scale and let them inherit `currentColor` so they pick up the surrounding text color.
- Keep icons consistent in weight and size within a group (e.g. all icons in a feature list or nav match).
- Icons support text — they don't replace labels for primary actions; pair an icon with a label unless the control is unambiguous.

## Sections

### Section Numbering & Eyebrows

Every major section opens with a **section number eyebrow** above the title:

- Format the eyebrow as an uppercase overline (e.g. `01`, `02`, `SECTION 01`) following the Labels & Eyebrows rules.
- It sits **above the headline**, on **no background — not a pill or chip**, in the **secondary** color (`secondary.500`).
- Numbering runs in document order down the page and helps readers track where they are.
- Pair the eyebrow + headline + sublead as one tight group, then add section-scale spacing around it.

### Brand Mnemonic (Ribbon)

The **ribbon** is our brand mnemonic — a recognisable, repeatable shape device, not a generic decoration.

- Use it **sparingly** as a signature accent: a section divider, hero motif, or a way to draw the eye to a single key moment per page.
- It may carry the `headlineGradient` (orange → fuchsia) as a brand flourish; keep it out of dense UI, body copy and controls.
- One mnemonic per view — don't repeat the ribbon until it becomes wallpaper.
- Treat it as a brand asset: pull the approved shape, don't redraw or restyle it ad hoc.

## Logo

The Zyte logo is our most recognisable, most protected asset.

### Variants

- **Primary (ink wordmark)** — default for product UI, documents, slides and light surfaces.
- **Reversed (white)** — use on dark or photographic backgrounds where the ink variant would fail contrast.
- **Hero (orange → fuchsia gradient)** — reserved for marketing hero sections, campaign key art and launch moments. Never use in product UI, body copy or anywhere it repeats.
- **Monochrome (single ink or single white)** — one-colour print, embroidery, engraving or any context restricted to a single colour.
- **Brand fuchsia** — limited accent variant; only on neutral light surfaces where a touch of brand colour helps.

### Rules

- One logo per surface — never combine the hero gradient variant with another variant in the same view.
- The standalone mark is reserved for avatars, favicons and tight UI slots where the full lockup would fall below minimum size.
- Minimum clear space equals the height of the ‘Z’ on all sides.
- Minimum size: 24 px tall for the mark, 96 px wide for the full lockup on screen.

**Do**

- Use the supplied SVGs at their native proportions.
- Place the logo on backgrounds that pass contrast requirements.

**Don’t**

- Stretch, rotate, recolour or add effects to the logo.
- Recreate the wordmark in a different typeface.

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

## Do’s and Don’ts

**Do**

- Build from tokens and product foundations.
- Keep hierarchy obvious: headings → subhead → body → meta.
- Use brand/accent sparingly and intentionally.

**Don’t**

- Hardcode colors, spacing, or the `12px` radius when token equivalents exist.
- Put shadows on cards, or mix multiple radii in one composition.
- Render section labels/eyebrows as pills or with a background — keep them plain uppercase in secondary.
- Use `headlineGradient` or `accentSecondaryOnDark` outside their documented roles (headlines / ribbon / dark surfaces).
- Introduce new “one-off” components when composition of existing ones works.

