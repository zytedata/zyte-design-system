---
slug: marketing
title: Marketing
scope: web
extends: design.md # inherits every rule from the Web base design system
status: experiment # stable | experiment | deprecated
version: 0.1
medium: Responsive web (Tailwind v3 + React)
intent: >-
  The Web brand tuned for acquisition surfaces — landing pages, campaigns,
  product overviews. Bold, high-contrast, conversion-first. Inherits all base
  brand rules; overrides layout rhythm, hero treatment and tone for pace.
audience: [Designers, Developers, Agents/LLMs]
preview: marketing.html
foundations: web
---

# Marketing — use-case overlay

> **This is an overlay on top of the Web `design.md`.** Everything in the base
> spec (logo, colour tokens, Yellix typeface, voice principles, "no shadows on
> cards", token-first rules) still applies verbatim. This file only records the
> **deltas** that make a surface read as *marketing* rather than generic Web.
>
> Precedence: base first, this overlay last — a `> Overrides base:` block wins
> for the marketing use case only. Anything not mentioned here is inherited.

## Use case & intent

Acquisition-first surfaces: the landing page, campaign pages, paid-traffic
destinations and product overviews. The job is to state the value in one line,
prove it fast, and route to a single next step (**Try free** / **Talk to us**).

- **When to use:** any public page whose primary metric is signup or lead.
- **Audience:** busy engineers and buyers arriving cold — scannable over deep.
- **Success:** one clear value prop, one primary CTA per view, fast to the point.

## Medium & output

Responsive web, built with **Tailwind v3 + React** (same stack as base). Renders
across `sm → 2xl`. No print or slide concerns here — see the `report` and `deck`
overlays for those.

## Layout override

> **Overrides base:** Marketing runs a **bolder vertical rhythm** than the base
> content default. Major sections use `spacing.32` (128) desktop / `spacing.20`
> (80) mobile, and alternate light surfaces to create pace down the page.

- Bookend structure: dark gradient hero → light body bands → dark footer.
- One full-width brand/gradient "scale" band per page max, to break up the body.
- Content width follows base (1080 / 898 narrow).

## Hero treatment

> **Overrides base:** The landing hero uses the brand navy → fuchsia
> `heroGradient` as a full-bleed background with reversed (white) logo + light
> text. This is the one place the gradient is a *background*, per base rules.

- Exactly one hero unit per page (base H1 = `size.7xl`).
- Pair headline + one sublead + primary/secondary CTA. Never two primaries.

## Type scale

Inherits the base scale. Marketing leans on the top of it — `7xl` heros, `5xl`
section titles — and uses the `headlineGradient` for headline highlights only.

## Component vocabulary

Marketing-relevant primitives from base: hero, value-prop pillars, social-proof
logo wall, feature cards, pricing cards, testimonial card, CTA band, blog grid.
No new components — compose from base.

## Voice / tone flex

> **Overrides base:** Marketing tone is the **bold** end of the brand voice —
> energetic, confident, benefit-led. Still no hype words (revolutionary,
> game-changing). Lead with the value, prove with numbers.

## Do / Don't (marketing)

**Do**
- One primary CTA per view; make the next step obvious.
- Front-load the value; use proof (logos, stats) early.

**Don't**
- Stack competing headlines or two primary buttons.
- Reuse the hero gradient on cards or non-hero sections.

<!-- Placeholder overlay — iterate on the deltas above. -->
