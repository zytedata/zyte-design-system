# Extract Summit — Design System

This document defines the complete visual and code language for the Extract Summit website. Every new page, component, or feature must conform to these specifications. Do not deviate without explicit instruction.

The YAML front matter is the machine-readable token layer for AI agents. The prose below preserves the full implementation guidance, rationale, ranges, snippets, and hard constraints.

Original reference: Claude Code Reference Document. Document version 1.0. Original last-updated marker: March 2026. Spec-adapted for `DESIGN.md` alpha format on April 25, 2026.

## Overview

### Brand DNA

**Design direction:** Wolff Olins — Brutalist Power Infrastructure  
**Concept:** Uncompromising. Blunt. Authoritative. The visual language of a Bloomberg terminal crossed with a Constructivist propaganda poster.  
**Audience:** Engineers, data scientists, researchers, founders — people who build on public web data.  
**Voice:** Direct. No fluff. Commands, not suggestions.

### Core Principles

- Typography IS the design. Bebas Neue at scale does the visual heavy lifting.
- One accent colour only. `#FF3D00` red. Use it sparingly so it always hits hard.
- Ghost letterforms live behind every hero and content block. They are structural, not decorative.
- The red slash (`2–3px`, `skewX(-1deg)`, `opacity 0.4–0.6`) appears in heroes and modals as a vertical divider.
- Cards and grids use `gap: 2px` — the black gap between tiles is part of the aesthetic.
- No rounded corners. No gradients. No drop shadows. No border-radius anywhere.
- Noise texture overlays everything at `opacity: 0.035–0.045`.

## Colors

### Colour Tokens

Use the YAML `colors` tokens as the normative source for agents. In CSS, keep the existing custom property names:

```css
:root {
  --red: #ff3d00; /* Primary accent. Buttons, tags, highlights, slash elements */
  --primary-hover: #ff6633; /* Red hover state */
  --on-primary: #000000; /* Text/icons on red surfaces */
  --black: #0a0a0a; /* Page background */
  --white: #f0ede8; /* Primary text — warm off-white, NOT pure white */
  --grey: #1a1a1a; /* Section backgrounds, card backgrounds */
  --mid: #333333; /* Mid-tone. Avatar backgrounds, inactive elements */
  --muted: #9a9a9a; /* Secondary text, nav links, body copy */
  --border: #1c1c1c; /* Borders / dividers */
  --card-border: #222222; /* Card borders and deep panel separators */
  --ghost-on-black: #0d0d0d; /* Ghost letterforms on black */
  --ghost-on-grey: #1e1e1e; /* Ghost letterforms on grey */
  --panel: #111111; /* Input fields and inset panels */
  --footer-text: #333333; /* Footer/legal text */
  --eyebrow: #444444; /* Secondary metadata / eyebrow fallbacks */
  --error: #ff8a8a; /* Form error text */
}
```

### Runtime Semantic Values

Use these semantic tokens instead of hardcoding local values.

| Usage                      | Value                                   |
| -------------------------- | --------------------------------------- |
| Borders / dividers         | `--border` / `#1C1C1C`                  |
| Card borders               | `--card-border` / `#222222`             |
| Ghost letterforms on black | `--ghost-on-black` / `#0D0D0D`          |
| Ghost letterforms on grey  | `--ghost-on-grey` / `#1E1E1E`           |
| Footer text / legal        | `--footer-text` / `#333333`             |
| Eyebrow / label fallback   | `--eyebrow` / `#444444`                 |
| Hover red                  | `--primary-hover` / `#FF6633`           |
| Input/panel fill           | `--panel` / `#111111`                   |
| Nav background             | `--overlay` / `rgba(10,10,10,0.92)`     |
| Overlay / modal backdrop   | `--modal-backdrop` / `rgba(0,0,0,0.82)` |

### Colour Usage Rules

- **`--red`** on black backgrounds: buttons, track tags, eyebrows, accent words in headlines, the slash element, stat accent numbers, red top bars on modals.
- **`--red` background** (inverted): countdown cards, full-bleed stat slabs, ticker strip. Text is `#000` on red backgrounds.
- **`--white` background** (inverted): used sparingly for variant contrast. Logo mark inverts to `background: --black; color: --white`.
- Never use pure `#ffffff`. Avoid pure `#000000` except where this system explicitly calls for `#000` text on red.

## Typography

### Font Loading

For static HTML references, always include this in `<head>`. In the Next.js app, load the same families through the existing font strategy or `next/font` while preserving the rendered families and metrics.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap"
  rel="stylesheet"
/>
```

### Font Variables

```css
--bebas: "Bebas Neue", sans-serif;
--mono: "DM Mono", monospace;
```

### Type Scale

| Role                | Font      | Size                         | Weight | Letter-spacing | Line-height  |
| ------------------- | --------- | ---------------------------- | ------ | -------------- | ------------ |
| Homepage hero       | `--bebas` | `clamp(80px, 13vw, 200px)`   | —      | `-2px`         | `0.88`       |
| Page hero           | `--bebas` | `clamp(64px, 11vw, 148px)`   | —      | `-2px`         | `0.86`       |
| Section title       | `--bebas` | `clamp(52px, 7vw, 96px)`     | —      | `-1px`         | `0.9`        |
| Statement (mid)     | `--bebas` | `clamp(36px, 4vw, 56px)`     | —      | `-0.5px`       | `1`          |
| Card title          | `--bebas` | `24px – 36px`                | —      | `0.5px – 1px`  | `1`          |
| Ghost letterform    | `--bebas` | `120px – 320px` (contextual) | —      | `-4px to -8px` | `0.82 – 1`   |
| Eyebrow / label     | `--mono`  | `9px – 11px`                 | —      | `3px – 4px`    | —            |
| Body copy           | `--mono`  | `12px – 14px`                | `400`  | `0`            | `1.7 – 1.85` |
| Nav links           | `--mono`  | `10px – 11px`                | —      | `2px`          | —            |
| Form labels         | `--mono`  | `8px – 9px`                  | —      | `3px`          | —            |
| Form inputs         | `--mono`  | `12px`                       | —      | `0`            | —            |
| Stat numbers (hero) | `--bebas` | `52px`                       | —      | `-1px`         | `1`          |
| Ticker              | `--bebas` | `20px`                       | —      | `2px`          | —            |
| Button (primary)    | `--bebas` | `20px – 22px`                | —      | `2px`          | `1`          |

### Typography Rules

- All labels and eyebrows: `text-transform: uppercase`.
- Never use `font-weight: 700` or `600` — `--bebas` has no weight variation, `--mono` uses `400` and `500` only.
- Red accent words in headlines: wrap in `<span style="color:var(--red)">` — no extra class needed.
- Eyebrows always have a preceding red line: `width: 20–32px; height: 1px; background: var(--red)` as a `::before` pseudo-element or a sibling `<div>`.

## Layout

### Global Page Setup

Every page must include these base styles verbatim:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--black);
  color: var(--white);
  font-family: var(--mono);
  overflow-x: hidden;
  cursor: none; /* Custom cursor replaces default */
}

/* Noise texture — always on body::before */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 9998;
}
```

All pages have `padding-top: 56px` on the first element to account for the fixed nav height.

### Layout Grid & Spacing

Horizontal page padding is always `padding: X 40px` — never less than 40px on left and right.

Section vertical rhythm:

- Major sections: `padding: 80px 40px` to `padding: 120px 40px`.
- Within a section before the title: `margin-bottom: 48px`.
- Between section title and content: `margin-top: 48px – 60px`.

Content grids:

```css
/* Two-column equal */
display: grid;
grid-template-columns: 1fr 1fr;
gap: 2px;

/* Two-column asymmetric */
display: grid;
grid-template-columns: 1fr 2fr;
gap: 40px – 80px;

/* Three-column */
display: grid;
grid-template-columns: 1fr 1fr 1fr;
gap: 2px;

/* Four-column */
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 2px;
```

Card grids always use `gap: 2px`. Layout grids (text + content) use `gap: 40px – 80px`.

### Page Templates

New inner page minimum structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title — Extract Summit 2026</title>
    <!-- Google Fonts -->
    <!-- Global CSS: tokens, reset, body, noise, cursor, nav, footer, reveal, buttons -->
  </head>
  <body>
    <div class="cursor" id="cursor"></div>

    <nav><!-- standard nav --></nav>

    <main style="padding-top: 56px;">
      <!-- Page hero -->
      <div class="page-hero">
        <div class="page-hero-ghost">KEYWORD</div>
        <div class="page-hero-slash" style="right: Xpx;"></div>
        <div style="position:relative; z-index:1;">
          <div class="section-num">NN — Label</div>
          <h1 class="page-hero-headline reveal">
            Headline<br /><span style="color:var(--red);">Red Word.</span>
          </h1>
          <p class="page-hero-sub reveal d1">Supporting copy.</p>
        </div>
      </div>

      <!-- Content sections -->
      <section style="background: var(--grey); padding: 80px 40px;">
        <!-- ... -->
      </section>

      <section style="background: var(--black); padding: 80px 40px;">
        <!-- ... -->
      </section>
    </main>

    <footer class="site-footer"><!-- standard footer --></footer>

    <script>
      // Cursor
      // Reveal observer
    </script>
  </body>
</html>
```

Section background alternation: alternate between `var(--black)` and `var(--grey)` for sections. Never use any other background colour on sections except for full-bleed red stat slabs.

## Elevation & Depth

### Depth Model

This is a flat, high-contrast design system. Do not use box shadows, drop shadows, glow effects, or gradients. Visual hierarchy comes from:

- solid surface changes between `var(--black)` and `var(--grey)`;
- strict borders and dividers using `#1C1C1C` or `#222`;
- scale contrast from Bebas Neue headings;
- ghost letterforms that sit behind content;
- red structural accents such as slashes, top bars, stat slabs, and ticker strips.

### Noise Texture

The body noise texture is always present at `opacity: 0.035–0.045`; it adds surface depth without shadows.

### Scroll Reveal Animations

All content sections use scroll-triggered fade-up reveals. Apply `.reveal` to any element that should animate in on scroll.

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.in {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays — add these alongside .reveal */
.d1 {
  transition-delay: 0.1s;
}
.d2 {
  transition-delay: 0.2s;
}
.d3 {
  transition-delay: 0.3s;
}
.d4 {
  transition-delay: 0.4s;
}
.d5 {
  transition-delay: 0.5s;
}
```

```js
function initReveals() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach(el => obs.observe(el));
}
initReveals();
```

Stagger usage pattern:

```html
<div class="reveal">First item — no delay</div>
<div class="reveal d1">Second item</div>
<div class="reveal d2">Third item</div>
<div class="reveal d3">Fourth item</div>
```

### Ghost Letterforms

Ghost letterforms appear behind hero sections and inside card grids. They are structural — they fill visual space and give depth.

```css
/* Behind hero content */
.ghost-hero {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--bebas);
  font-size: clamp(120px, 18vw, 260px);
  color: #0d0d0d; /* On --black background */
  /* color: #1A1A1A;      On --grey background */
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

/* Inside a card (smaller, corner-positioned) */
.ghost-card {
  position: absolute;
  right: -10px;
  top: 20px;
  font-family: var(--bebas);
  font-size: 120px – 200px;
  color: #1c1c1c; /* On --grey card background */
  letter-spacing: -4px;
  line-height: 0.85;
  pointer-events: none;
  user-select: none;
}
```

Ghost content rules:

- Hero ghosts: the page keyword in uppercase (`SPEAKERS`, `ARCHIVE`, etc.).
- Card ghosts: the card's initials (`AK`, `JR`), its number (`01`, `02`), or a large quotation mark (`"`).
- Countdown/stat cards: the number itself (`163`, `20K`).
- Never use ghost text that is not directly related to the card's content.

## Shapes

### Shape Language

All visual elements are square and blunt:

- `border-radius: 0` everywhere.
- No rounded cards, buttons, inputs, cursors, chips, or pills.
- The only permitted shape accent is the skewed red vertical slash.
- The `rounded.none` token is the only radius token.

### The Red Slash

A vertical red line that appears in heroes and modals as a structural element.

```css
.slash {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px; /* Homepage hero: 3px */
  background: var(--red);
  opacity: 0.4 – 0.6; /* Context-dependent */
  transform: skewX(-1deg); /* Slight lean */
}
```

Position the slash `right: 160px – 280px` in heroes, or symmetrically flanking a modal. Never centre it.

## Components

### Custom Cursor

Required on every page. Place `<div class="cursor" id="cursor"></div>` as the first child of `<body>`.

```css
.cursor {
  position: fixed;
  width: 12px;
  height: 12px;
  background: var(--red);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition:
    width 0.2s,
    height 0.2s,
    opacity 0.2s;
  border-radius: 0; /* Square cursor — never round */
}
.cursor.big {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}
```

```js
const cur = document.getElementById("cursor");
document.addEventListener("mousemove", e => {
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
});
// Expand on interactive elements:
document
  .querySelectorAll(
    'a, button, [role="button"], .card, .track-row, .speaker-card'
  )
  .forEach(el => {
    el.addEventListener("mouseenter", () => cur.classList.add("big"));
    el.addEventListener("mouseleave", () => cur.classList.remove("big"));
  });
```

### Navigation

Fixed, 56px tall, blurred backdrop. Identical across all pages.

```html
<nav>
  <a href="/" class="nav-logo">
    <div class="nav-logo-mark">E/S</div>
    <span class="nav-logo-text">Extract Summit</span>
  </a>
  <ul class="nav-links">
    <li><a href="/why-attend">Why Attend</a></li>
    <li><a href="/speakers">Speakers</a></li>
    <li><a href="/tracks">Tracks</a></li>
    <li><a href="/talks">Past Talks</a></li>
    <li><a href="/apply">Speak</a></li>
    <li><a href="/faq">FAQ</a></li>
    <li><a href="/contact">Contact</a></li>
    <li>
      <a href="https://discord.gg/zB2DBEp8mU" class="nav-cta" target="_blank"
        >Join Now</a
      >
    </li>
  </ul>
</nav>
```

```css
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 56px;
  border-bottom: 1px solid #1c1c1c;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(12px);
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.nav-logo-mark {
  background: var(--red);
  color: #000;
  font-family: var(--bebas);
  font-size: 17px;
  padding: 4px 10px;
  letter-spacing: 1px;
  line-height: 1;
}
.nav-logo-text {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
}
.nav-links a {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover,
.nav-links a.active {
  color: var(--white);
}
.nav-cta {
  background: var(--red) !important;
  color: #000 !important;
  padding: 7px 18px !important;
  font-weight: 500;
  transition: background 0.2s !important;
}
.nav-cta:hover {
  background: #ff6633 !important;
}
```

### Page Hero Pattern

Every inner page (non-homepage) uses this hero pattern:

```html
<div class="page-hero">
  <div class="page-hero-ghost">KEYWORD</div>
  <!-- 1–2 words from page title -->
  <div class="page-hero-slash" style="right: 220px;"></div>
  <!-- position varies -->

  <div style="position: relative; z-index: 1;">
    <div class="section-num">01 — Section Label</div>
    <h1 class="page-hero-headline">
      Headline<br /><span style="color: var(--red);">Red Word.</span>
    </h1>
    <p class="page-hero-sub">Supporting copy here.</p>
  </div>
</div>
```

```css
.page-hero {
  padding: 80px 40px 64px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #1c1c1c;
}
.page-hero-ghost {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--bebas);
  font-size: clamp(120px, 18vw, 260px);
  color: #0d0d0d;
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
}
.page-hero-slash {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--red);
  opacity: 0.5;
  transform: skewX(-1deg);
}
.page-hero-headline {
  font-family: var(--bebas);
  font-size: clamp(64px, 11vw, 148px);
  line-height: 0.86;
  letter-spacing: -2px;
  color: var(--white);
  margin-bottom: 16px;
}
.page-hero-sub {
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
  max-width: 480px;
}
```

Ghost keyword guide:

- Why Attend → `WHY`
- Speakers → `SPEAKERS`
- Tracks → `TRACKS`
- Past Talks → `ARCHIVE`
- Apply to Speak → `SPEAK`
- Code of Conduct → `CONDUCT`
- FAQ → `FAQ`
- Contact → `CONTACT`

### Section Numbering & Eyebrows

Every major section has a section number eyebrow above the title:

```html
<div class="section-num">01 — Section Label</div>
<h2 class="section-title">
  Section<br /><span style="color:var(--red);">Title.</span>
</h2>
```

```css
.section-num {
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-num::before {
  content: "";
  display: block;
  width: 22px;
  height: 1px;
  background: var(--red);
}
.section-title {
  font-family: var(--bebas);
  font-size: clamp(52px, 7vw, 96px);
  line-height: 0.9;
  letter-spacing: -1px;
  color: var(--white);
}
```

### Buttons

Primary button:

```html
<a href="#" class="btn-red">Join The Summit</a>
```

```css
.btn-red {
  background: var(--red);
  color: #000;
  font-family: var(--bebas);
  font-size: 20px;
  letter-spacing: 2px;
  padding: 12px 32px;
  text-decoration: none;
  display: inline-block;
  line-height: 1;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-red:hover {
  background: #ff6633;
  transform: translateY(-1px);
}
```

Ghost / text button:

```html
<a href="#" class="btn-ghost">View Speakers</a>
```

```css
.btn-ghost {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}
.btn-ghost::after {
  content: "→";
  transition: transform 0.2s;
}
.btn-ghost:hover {
  color: var(--white);
}
.btn-ghost:hover::after {
  transform: translateX(4px);
}
```

### Cards

Grid gap rule: all card grids use `gap: 2px` — the thin black line between tiles is intentional and part of the aesthetic. Never use larger gaps on card grids.

Feature / pillar card:

```css
.card {
  background: var(--grey);
  padding: 32px – 40px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}
.card:hover {
  background: #1f1f1f;
}
```

Card with ghost number:

```css
.card-num {
  font-family: var(--bebas);
  font-size: 72px;
  color: #1e1e1e;
  line-height: 1;
  margin-bottom: 12px;
  transition: color 0.3s;
}
.card:hover .card-num {
  color: var(--red);
}
```

Card with red left-border reveal:

```css
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 0;
  background: var(--red);
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover::before {
  height: 100%;
}
```

Track tag / label pill:

```html
<div class="track-tag">Evasion</div>
```

```css
.track-tag {
  display: inline-block;
  background: var(--red);
  color: #000;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 3px 8px;
  /* No border-radius */
}
```

### Forms

All form elements follow this pattern:

```css
.form-input,
.form-select,
.form-textarea {
  background: #111;
  border: 1px solid #1c1c1c;
  color: var(--white);
  font-family: var(--mono);
  font-size: 12px;
  padding: 11px 14px;
  outline: none;
  width: 100%;
  transition:
    border-color 0.2s,
    background 0.2s;
  appearance: none; /* for selects */
  border-radius: 0; /* Never round */
}
.form-input::placeholder {
  color: #333;
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--red);
  background: #0d0d0d;
}
.form-label {
  font-size: 8px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #444;
}
```

Checkboxes:

```css
input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #222;
  background: var(--black);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
  position: relative;
  border-radius: 0;
}
input[type="checkbox"]:checked {
  background: var(--red);
  border-color: var(--red);
}
input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(45deg);
}
```

### Ticker / Marquee

The red full-bleed ticker strip between the hero and first content section.

```html
<div class="ticker">
  <div class="ticker-track" id="ticker"></div>
</div>
```

```css
.ticker {
  background: var(--red);
  padding: 12px 0;
  overflow: hidden;
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: tickerScroll 30s linear infinite;
}
.ticker-track:hover {
  animation-play-state: paused;
}
.ticker-item {
  font-family: var(--bebas);
  font-size: 20px;
  color: #000;
  letter-spacing: 2px;
  white-space: nowrap;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 40px;
}
.ticker-item::after {
  content: "/";
  color: rgba(0, 0, 0, 0.3);
}
@keyframes tickerScroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

```js
const items = [
  "Web Scraping",
  "Anti-Bot Evasion",
  "Headless Browsers",
  "Data Pipelines",
  "AI Extraction",
  "Proxy Networks",
  "Scrapy",
  "Playwright",
  "Open Data",
  "HTTP/2 Fingerprinting",
  "LLM Parsing",
  "Spider Engineering",
];
const ticker = document.getElementById("ticker");
[...items, ...items].forEach(item => {
  const el = document.createElement("div");
  el.className = "ticker-item";
  el.textContent = item;
  ticker.appendChild(el);
});
```

### Stat Slab

A full-bleed red section used as visual punctuation between content areas.

```html
<div class="stat-slab">
  <div class="stat-slab-num">20K+</div>
  <div class="stat-slab-text">
    Scrapers, builders, and data people. One community.
  </div>
</div>
```

```css
.stat-slab {
  background: var(--red);
  padding: 80px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-slab-num {
  font-family: var(--bebas);
  font-size: clamp(80px, 12vw, 160px);
  color: #000;
  line-height: 0.85;
  letter-spacing: -4px;
}
.stat-slab-text {
  font-family: var(--bebas);
  font-size: clamp(32px, 4vw, 56px);
  color: rgba(0, 0, 0, 0.5);
  line-height: 1;
  max-width: 400px;
  text-align: right;
}
```

### Footer

Identical across all pages. Four-column grid, black background.

```html
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="nav-logo-mark">E/S</div>
        <span class="nav-logo-text">Extract Summit</span>
      </div>
      <p class="footer-tagline">
        The world's largest<br />web scraping conference.
      </p>
    </div>
    <div>
      <div class="footer-col-title">Event</div>
      <ul class="footer-links">
        <li><a href="/why-attend">Why Attend</a></li>
        <li><a href="/speakers">Speakers</a></li>
        <li><a href="/tracks">Tracks</a></li>
        <li><a href="/talks">Past Talks</a></li>
        <li><a href="/apply">Apply to Speak</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Community</div>
      <ul class="footer-links">
        <li>
          <a href="https://discord.gg/zB2DBEp8mU" target="_blank">Discord</a>
        </li>
        <li><a href="#">Local Chapters</a></li>
        <li><a href="#">Workshops</a></li>
        <li><a href="#">Build with Us</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Legal</div>
      <ul class="footer-links">
        <li><a href="/conduct">Code of Conduct</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">© 2026 Extract Summit. All rights reserved.</div>
    <div class="footer-zyte">
      Organised by <span class="zyte-badge">ZYTE</span>
    </div>
  </div>
</footer>
```

```css
.site-footer {
  background: var(--black);
  border-top: 1px solid #1c1c1c;
  padding: 56px 40px 40px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
  border-bottom: 1px solid #1c1c1c;
  margin-bottom: 32px;
}
.footer-tagline {
  font-size: 12px;
  line-height: 1.7;
  color: var(--muted);
  margin-top: 14px;
}
.footer-col-title {
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #3a3a3a;
  margin-bottom: 18px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 12px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: var(--white);
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-copy {
  font-size: 10px;
  color: #2a2a2a;
  letter-spacing: 1px;
}
.footer-zyte {
  font-size: 10px;
  color: #2a2a2a;
  display: flex;
  align-items: center;
  gap: 10px;
}
.zyte-badge {
  background: var(--muted);
  color: var(--black);
  font-size: 9px;
  font-weight: 500;
  padding: 2px 7px;
  letter-spacing: 1px;
}
```

## Do's and Don'ts

### What NOT To Do

These are hard constraints. Never violate them.

| Never                                 | Instead                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `border-radius` on any element        | Sharp corners everywhere                                                                                      |
| `box-shadow` or `drop-shadow`         | Use borders and colour contrast                                                                               |
| Gradients (background or text)        | Flat solid fills only                                                                                         |
| Pure `#ffffff` or `#000000`           | Use `--white` (`#F0EDE8`) and `--black` (`#0A0A0A`); `#000` is only for explicit red-surface text/check marks |
| `font-weight: 600` or `700`           | `400` or `500` only on DM Mono                                                                                |
| `gap` larger than `2px` on card grids | Always `2px`                                                                                                  |
| Any colour other than the palette     | The six tokens + the hardcoded values in Colors                                                               |
| Rounded or circular cursor            | Square cursor only                                                                                            |
| Default browser cursor                | Always `cursor: none` + custom cursor                                                                         |
| Inter, Roboto, Arial, system fonts    | Only Bebas Neue and DM Mono                                                                                   |
| Purple gradients                      | Never                                                                                                         |
| Text below 9px                        | Minimum `9px` font-size                                                                                       |
| Buttons with `border-radius`          | Square buttons always                                                                                         |
| Body text in Bebas Neue               | Bebas for display only; DM Mono for all body, labels, inputs                                                  |
| Section without `section-num` eyebrow | Always number and label sections                                                                              |

### Voice & Copy Rules

- Headlines use **sentence fragments** — not full sentences. End with a full stop for finality.
- Red accent words are typically the **verb or the most powerful noun**.
- Eyebrow labels are **01 — Description** format, always uppercase.
- Body copy: short paragraphs, no more than 3–4 lines. Breathing room matters.
- CTAs: imperative verbs. "Join The Community." "Register." "Apply to Speak." Never "Click here" or "Learn more".
- No exclamation marks anywhere.
- Numbers are written as numerals, not words. "20,000+" not "twenty thousand".

### File Naming Convention

```text
extract-summit-[page-name].html
```

Examples:

- `extract-summit-homepage.html`
- `extract-summit-speakers.html`
- `extract-summit-schedule.html`
- `extract-summit-signup.html`

### Agent Availability Rules

- Prefer the YAML tokens when generating UI because they are exact and machine-readable.
- Use the prose ranges when a single token cannot represent responsive behavior, e.g. `clamp(...)`, opacity ranges, or contextual ghost colors.
- Preserve canonical section order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- Do not add duplicate `##` section headings; use `###` for project-specific implementation details.
