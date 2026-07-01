---
slug: data-services
title: Data Services
scope: web
status: stable # stable | experiment | deprecated
version: 0.1
intent: >-
  The Managed Data (Data Services) landing page. Sell the fully-managed,
  done-for-you data pipeline to teams who don't want to build scraping in-house,
  and route them to "Connect with our data team" / "Talk to us".
audience: [Designers, Developers, Agents/LLMs]
routes: ["/data-extraction/"]
preview: data-services.html
foundations: web
# Light-theme body with a purple-gradient hero, a dark "partner" band, a
# lavender process band, and a gradient pricing band. `module` keys reference
# the website's ModuleMap (lib/constants.ts) as plain strings.
sections:
  - id: hero
    module: generic_hero_v2
    surface: gradient
    role: Centered value prop + single "Connect with our data team" CTA
    required: true
  - id: skip-the-struggle
    module: rich_module_2
    surface: light
    role: Problem framing (left) + 4 benefit checks (right)
    required: true
  - id: partner-cards
    module: module_44
    surface: dark
    role: "The data partner of your dreams" — heading cell + 5 reason cards
    required: true
  - id: logo-wall
    module: social_proof
    surface: light
    role: "Trusted by data-fueled organizations" customer logos
    required: false
  - id: working-with-zyte
    module: module_31
    surface: lavender
    role: 4-card engagement model (onboarding → alignment → speed → delivery)
    required: true
  - id: pricing-band
    module: rich_module
    surface: gradient
    role: "Simple pricing that scales" + from-$500 + See plans
    required: false
  - id: examples
    module: module_dynamic_code_snippet
    surface: light
    role: Industry pills + Response/JSON demo of a delivered schema
    required: false
  - id: formats
    module: rich_module_2
    surface: light
    role: Format (CSV/JSON/XML) + delivery target (GCS/S3/Azure/AWS) cards
    required: false
  - id: testimonials
    module: module_text_testimonials
    surface: light
    role: Heading + rotating customer quote with rating
    required: false
  - id: insights
    module: module_27
    surface: light
    role: Related blog posts for teams outsourcing web data
    required: false
  - id: faq
    module: module_faq
    surface: light
    role: Accordion of common managed-data questions + Talk to us
    required: false
  - id: footer
    module: global_module
    surface: dark
    role: Global footer (preview only; normally global chrome)
    required: true
---

# Data Services

The Managed Data landing page (route `/data-extraction/`). Where Home sells the
self-serve API, this page sells the **done-for-you** offer: Zyte's team builds, runs,
and maintains the whole pipeline. Every section drives toward one conversation —
**Connect with our data team** / **Talk to us** — so the page is heavier on trust,
process, and proof than on feature breadth.

The layout is a light body **punctuated by three full-bleed bands**: a purple-gradient
hero, a dark "partner" reasons band, and a gradient pricing band, with a soft lavender
process band in between.

## Look & feel

- **Surfaces:** purple-gradient hero (`secondary`→`primary` blend), light body, one dark
  band (partner cards on near-black with white cards), one lavender band (`#f3eefb`,
  process), one gradient band (pricing), dark navy footer.
- **Brand colour:** fuchsia `primary.600` for CTAs, eyebrows, card icon washes, and the
  active industry pill. White CTAs are used on the dark/gradient bands for contrast.
- **No headline gradient on type** here — the gradients live in the section *backgrounds*,
  keeping headings as solid navy ink (`secondary.900`).
- **Type:** Geist Sans; Geist Mono for eyebrows, the code/JSON demo, and format chips.
- **Depth:** white cards on the dark band read as the elevated layer; elsewhere borders
  and surface tints carry the structure. Shadows stay subtle.

## Section-by-section

1. **Hero — `generic_hero_v2`** · *gradient.* Centered: mono eyebrow ("Zyte Data") → H1
   "Fully Managed Data Scraping Service" → lead → one white CTA.
2. **Skip the struggle — `rich_module_2`** · *light.* Left: eyebrow + H2 + problem
   paragraph. Right: four benefit checks (managed / clean / scalable / uptime).
3. **Partner cards — `module_44`** · *dark.* A 3-col grid where the first cell is the
   "The data partner of your dreams" heading + "Let's talk", followed by 5 white reason
   cards (heritage, compliance, custom scale, reliability, Zyte API).
4. **Logo wall — `social_proof`** · *light.* "Trusted by data-fueled organizations".
5. **Working with Zyte — `module_31`** · *lavender.* Centered heading + 2×2 cards
   describing the engagement model; the last card carries the CTA.
6. **Pricing band — `rich_module`** · *gradient.* "Simple pricing that scales with your
   needs", from $500/mo, "See plans".
7. **Examples / demo — `module_dynamic_code_snippet`** · *light.* Industry pills (first
   active) over a two-pane Response + JSON demo of a delivered schema.
8. **Formats — `rich_module_2`** · *light.* Left heading + CTA; right two cards: output
   formats (CSV/JSON/XML) and delivery targets (GCS/S3/Azure/AWS).
9. **Testimonials — `module_text_testimonials`** · *light.* Heading + one quote card.
10. **Insights — `module_27`** · *light.* Three related blog posts.
11. **FAQ — `module_faq`** · *light.* Accordion (native `<details>`), first item open,
    closing on a "Talk to us" CTA.
12. **Footer — `global_module`** · *dark.* Preview-only; header omitted.

## Behaviour

- **Single conversion path:** every CTA funnels to the data team ("Connect with our data
  team" / "Talk to us" / "Talk to an expert"); the only divergence is "See plans" on the
  pricing band.
- **Responsive:** all splits and grids collapse to one column under `md` (768px); section
  padding tightens from `84px` to `56px`; the demo stacks Response above JSON.
- **FAQ:** native `<details>` accordion — first item open by default, one `+/−` affordance.
- **Industry pills:** presentational here (first active); wire to filter the demo when built.

## Do / Don't

**Do**
- Keep the three background bands as the only full-bleed colour; everything else stays light.
- Reuse `social_proof`, `module_text_testimonials`, and `module_27` from Home.
- Lead every section toward the data-team conversation.

**Don't**
- Apply `headlineGradient` to type — gradients are backgrounds on this page.
- Add more than one CTA style per band (white on dark/gradient, fuchsia on light).
- Invent new card components when `module_44` / `module_31` compositions work.
