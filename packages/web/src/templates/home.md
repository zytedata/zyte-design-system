---
slug: home
title: Home
scope: web
status: stable # stable | experiment | deprecated
version: 0.1
intent: >-
  The flagship landing page. State what Zyte does in one line, prove it with
  value pillars, social proof and scale, then route visitors to self-serve
  signup ("Try free") or sales ("Talk to us").
audience: [Designers, Developers, Agents/LLMs]
routes: ["/"]
preview: home.html
foundations: web
# The home page is a LIGHT-theme layout with a dark hero, one gradient band,
# and a dark footer. Sections list is the real, ordered page recipe; `module`
# keys reference the website's ModuleMap (lib/constants.ts) as plain strings.
sections:
  - id: hero
    module: home_page_experiment # generic_hero_v2 family
    surface: dark
    role: Headline value prop + Try free / Find out more, with brand key-art
    required: true
  - id: managed-data
    module: rich_module_2
    surface: light
    role: Two-column promo for Managed Data service (text + product media)
    required: false
  - id: value-props
    module: module_5
    surface: light
    role: Three pillars — AI, legal compliance, acceleration
    required: true
  - id: logo-wall
    module: social_proof
    surface: light
    role: "Trusted by data-fueled organizations" customer logos
    required: false
  - id: business-grid
    module: service_card_module
    surface: light
    role: 3×3 grid of data types Zyte supports, each linking to its page
    required: true
  - id: scale-band
    module: rich_module
    surface: gradient
    role: Full-width credibility band — years, requests, countries
    required: false
  - id: testimonials
    module: module_text_testimonials
    surface: light
    role: Heading + rotating customer quote card with rating
    required: false
  - id: community
    module: community_experiment
    surface: light
    role: Three cards — Discord, Extract Summit, Affiliate program
    required: false
  - id: blog
    module: module_27
    surface: light
    role: Latest blog posts grid
    required: false
  - id: footer
    module: global_module
    surface: dark
    role: Global footer (shown in preview for context; normally global chrome)
    required: true
---

# Home

The flagship landing page and highest-traffic surface on the site. Its job: make a busy
engineer understand **what Zyte does** in one line, back it with pillars, proof and scale,
then offer a frictionless next step — self-serve (**Try free**) or sales (**Talk to us**).

Unlike most product pages, Home is a **light-theme layout bookended by dark**: a dark
gradient hero at the top and a dark footer at the bottom, with a single magenta gradient
"scale" band breaking up the light body in the middle.

## Look & feel

- **Surfaces:** `surfaceLight` body (white / `#f7f7f8` alternating), a dark hero on a
  navy→black gradient with a fuchsia glow, and a dark navy footer (`secondary.950`).
- **Brand colour:** Zyte Fuchsia (`primary.600` `#c026d3`) drives the primary CTA, the
  "Explore … data" links, and the value-pillar top rules. Don't paint surfaces with it.
- **Gradients:** the orange→fuchsia `headlineGradient` appears only as decorative accent
  (hero key-art, pillar top borders); the navy→fuchsia `band` gradient is reserved for the
  single full-width scale band. No gradient on type in the body.
- **Type:** Geist Sans throughout; Geist Mono for small eyebrow labels (community cards).
  Headlines are large, tight, semibold in navy ink (`secondary.900`).
- **Depth:** borders and surface contrast first; only soft shadows on raised media/cards.

## Section-by-section

1. **Hero — `home_page_experiment`** · *dark.* Left-aligned H1 ("Access the web's data.
   Clean, ready, and at scale."), one-line lead, **Try free** (fuchsia) + **Find out more**
   (outline). Right: abstract brand key-art. Keep H1 to one line of meaning per row.
2. **Managed Data — `rich_module_2`** · *light.* Two columns: copy + dual CTA on the left
   ("Talk to us" / "More about managed data"), product media on the right.
3. **Value props — `module_5`** · *light.* Three pillars, each with a gradient top rule:
   AI built for scraping · Built-in legal compliance · Accelerate your data projects.
4. **Logo wall — `social_proof`** · *light.* "Trusted by data-fueled organizations" + a
   quiet row of muted customer logos.
5. **Zyte for your business — `service_card_module`** · *light.* 3×3 bordered grid of data
   types (Product, AI & LLM, Search, News & Article, Business Places, Real Estate, Flights,
   Social Media, Job Posting), each ending in an "Explore … data" link.
6. **Scale band — `rich_module`** · *gradient.* The one magenta band: "Historic scale,
   unprecedented reach" + the since-2010 / 116-countries proof + Try free.
7. **Testimonials — `module_text_testimonials`** · *light.* Big left heading ("Humble brag?
   Maybe…") beside a single quote card (mark, title, quote, rating, attribution). Rotates.
8. **Community — `community_experiment`** · *light.* Three cards: Discord, Extract Summit,
   Affiliate — each a mono eyebrow + title + blurb + link.
9. **Blog — `module_27`** · *light.* "Latest web scraping insights." + recent post grid.
10. **Footer — `global_module`** · *dark.* Global footer; preview includes it for context
    and intentionally omits the top navigation header.

## Behaviour

- **Above the fold:** on mobile the hero (H1 → lead → **Try free**) must be visible without
  scrolling; the secondary CTA may wrap below; hero key-art hides under `md` (768px).
- **Responsive:** every multi-column block (hero, managed-data split, value props, business
  grid, testimonials, community, blog) collapses to one column under `md`; section padding
  tightens from `88px` to `56px`.
- **CTAs:** one primary (fuchsia) action per viewport — the hero pairs it with an outline,
  the body with text links.
- **Motion:** smooth-scroll only; testimonials rotate. Keep effects subtle.

## Do / Don't

**Do**
- Lead with the value, then the detail (Voice & Tone).
- Reuse `social_proof`, `module_5`, and `service_card_module` rather than inventing blocks.
- Keep the scale band as the only full-bleed gradient on the page.

**Don't**
- Apply `headlineGradient` to body type, buttons, or links.
- Stack two fuchsia CTAs in the same viewport.
- Add a bespoke hero — extend the `generic_hero_v2` family.
- Hardcode colours/spacing when a token equivalent exists.
