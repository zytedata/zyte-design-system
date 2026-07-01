---
slug: deck
title: Deck
scope: web
extends: design.md # inherits every rule from the Web base design system
status: experiment # stable | experiment | deprecated
version: 0.1
medium: Presentation slides (16:9)
intent: >-
  The Web brand adapted for presentations — sales decks, pitch and conference
  slides. One idea per slide, huge type, high contrast. Inherits all base brand
  rules; overrides canvas, type scale and density for projection.
audience: [Designers, Sales, Agents/LLMs]
preview: deck.html
prompt: >-
  Build a 16:9 slide deck using the attached {product} deck spec (deck.md).
  Include a title slide, a section divider, a three-point content slide, a
  big-stat slide and a closing CTA slide. Follow the spec — oversized type, one
  idea per slide, generous safe areas, and alternating dark/light masters.
foundations: web
---

# Deck — use-case overlay

> **This is an overlay on top of the Web `design.md`.** The base spec (logo,
> colour tokens, Yellix, voice, token-first rules) applies verbatim. This file
> records only the **deltas** that make a surface read as a *slide deck* rather
> than a web page.
>
> Precedence: base first, this overlay last. A `> Overrides base:` block wins
> for the deck use case only; everything else is inherited.

## Use case & intent

Presentations shown on a screen or projector: sales decks, pitches, conference
and internal talks.

- **When to use:** anything presented live to an audience, 16:9.
- **Audience:** a room reading from a distance — one idea per slide.
- **Success:** legible from the back row, minimal words, strong single message.

## Medium & output

**16:9 slides** (1920×1080 design canvas). Fixed aspect ratio, one artboard per
slide. Not scrolled, not paginated like a document.

## Layout override

> **Overrides base:** Each slide is a **fixed 16:9 artboard** with a generous
> safe area (≈ 6% inset) so nothing is clipped by projectors. One dominant
> element per slide — headline, one chart, or one statement.

- Slide masters: title, section divider, content, big-stat, quote, closing.
- Persistent brand corner (small logo) + slide number.

## Type scale

> **Overrides base:** **Larger than web** — headlines run `size.8xl`/`9xl`
> equivalents, body never below ~24px on-canvas. If it's too small to read from
> the back of a room, it doesn't belong on the slide.

- Big-stat slides use display weight (600) numbers, tabular figures.

## Colour use

> **Overrides base:** Dark slides are **first-class here**, not the exception —
> alternate dark (`surfaceDark`) and light masters freely. The hero gradient may
> be used on title and section-divider slides.

## Component vocabulary

Deck-specific masters: title slide, section divider, content slide, big-stat,
pull-quote, closing/CTA. Charts sized for projection; minimal legends.

## Voice / tone flex

> **Overrides base:** Deck tone is **spoken** — headline-only phrasing, the
> presenter carries the detail. Fewer words, bigger point. Same brand voice.

## Do / Don't (deck)

**Do**
- One idea per slide; make type readable from the back row.
- Keep a consistent safe area and brand corner across slides.

**Don't**
- Paste paragraphs onto slides; the speaker fills in the detail.
- Shrink type to fit more content — split into two slides instead.

<!-- Placeholder overlay — iterate on the deltas above. -->
