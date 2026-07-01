---
slug: report
title: Report
scope: web
extends: design.md # inherits every rule from the Web base design system
status: experiment # stable | experiment | deprecated
version: 0.1
medium: Print / PDF (A4 · Letter)
intent: >-
  The Web brand adapted for long-form documents — whitepapers, case studies,
  data reports. Print-legible, calm and structured. Inherits all base brand
  rules; overrides page format, type scale and colour use for paper.
audience: [Designers, Writers, Agents/LLMs]
preview: report.html
foundations: web
---

# Report — use-case overlay

> **This is an overlay on top of the Web `design.md`.** The base spec (logo,
> colour tokens, Yellix, voice, token-first rules) applies verbatim. This file
> records only the **deltas** that make a document read as a *report* rather
> than a web page.
>
> Precedence: base first, this overlay last. A `> Overrides base:` block wins
> for the report use case only; everything else is inherited.

## Use case & intent

Long-form, authoritative documents meant to be read start-to-finish or printed:
whitepapers, case studies, benchmark and data reports.

- **When to use:** anything paginated, exported to PDF, or printed.
- **Audience:** readers giving sustained attention — legibility beats drama.
- **Success:** clear structure, easy skim (TOC, headings), print-safe.

## Medium & output

**Print / PDF**, A4 (210×297mm) or US Letter. Fixed page size with margins and
running headers/footers — not a responsive canvas. Colour must survive CMYK and
grayscale printing.

## Layout override

> **Overrides base:** Documents are **paginated**, not scrolled. Use a fixed
> page with margins (≈ 20mm), a running header (title) and footer (page number).
> Single readable column; a narrow sidebar only for callouts/footnotes.

- Cover page → table of contents → numbered sections → appendix.
- Figures and tables get numbered captions.

## Type scale

> **Overrides base:** Print-legible scale, smaller than web. Body ≈ 11pt with
> generous leading; H1 ≈ 28–32pt (not `7xl`). Hierarchy comes from weight and
> space, not oversized display type.

- Use tabular figures for all data tables (base rule).
- Footnote / caption size one step below body.

## Colour use

> **Overrides base:** **No dark hero drama and no gradient backgrounds** in the
> body — reserve strong brand colour for the cover, section dividers and chart
> accents. Body stays black-on-white for print contrast. Fuchsia is an accent,
> not a fill.

## Component vocabulary

Report-specific patterns: cover, TOC, section divider, data table, figure +
caption, pull-quote, callout box, footnote, appendix. Charts use brand palette
accents on white.

## Voice / tone flex

> **Overrides base:** Report tone is the **precise** end of the brand voice —
> measured, evidence-led, neutral. Claims are backed by data and cited.

## Do / Don't (report)

**Do**
- Keep a single, readable column; number sections and figures.
- Design for grayscale — check contrast without colour.

**Don't**
- Use hero gradients or dark full-bleed backgrounds in the body.
- Oversize display type; this is a reading document, not a landing page.

<!-- Placeholder overlay — iterate on the deltas above. -->
