import type { FileChangelog } from "@zyte/ds-types";

export const WEB_FILE_CHANGELOGS: FileChangelog[] = [
  {
    file: "branding.ts",
    entries: [
      {
        date: "2026-06-03",
        author: "arkadiusz",
        kind: "added",
        message:
          "New WEB_BRANDING export: editorial brand guidance (Overview, Logo, Voice & Tone, Visual Language, Product Expression, AI / Agentic Expression, Asset Usage) with taglines, summaries, principles and do/don't pairs. Surfaced by the dashboard's Brand pages.",
      },
      {
        date: "2026-06-03",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Logo section: expanded principles with explicit rules for when to use each variant (primary, reversed, hero gradient, monochrome, brand fuchsia) and a one-logo-per-surface rule.",
      },
    ],
  },
  {
    file: "documentation.ts",
    entries: [
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Consumer stack: note Geist (`geist` package) wiring for Next.js root layout vs typography tokens.",
      },
    ],
  },
  {
    file: "components.ts",
    entries: [
      {
        date: "2026-04-26",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Filtered out non-migrated render-kit groups so the catalog only lists shipped components.",
      },
      {
        date: "2026-04-12",
        author: "maja",
        kind: "added",
        message:
          "Imported render-kit groups from zyte-website-nextjs as the source of truth for the web catalog.",
      },
    ],
  },
  {
    file: "foundations.ts",
    entries: [
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "added",
        message:
          "Surface layer palettes: `colors.surfaceDark` and `colors.surfaceLight` (background, pageSections, secondary, cards) per UI spec. Canonical doc v1.3.",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Typography: `typography.family.sans` / `mono` use Geist via `var(--font-geist-sans)` and `var(--font-geist-mono)`; Next apps add `geist` and `GeistSans` / `GeistMono` on `<html>`. Canonical doc v1.2.",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Brand colour reset: primary → Zyte Fuchsia (600 = #c026d3), accentSecondary → orange (500 = #e8520a), plus accentSecondaryOnDark (#ff6b2b) and headlineGradient (orange → fuchsia). See DESIGN_TOKEN_DELTA.md.",
      },
      {
        date: "2026-04-22",
        author: "arkadiusz",
        kind: "fixed",
        message: "Aligned `primary/500` hex with the marketing brand kit (#DB005F).",
      },
      {
        date: "2026-04-08",
        author: "design-team",
        kind: "added",
        message: "Introduced accent-secondary (warm) and accent-secondary (cold) palettes.",
      },
    ],
  },
  {
    file: "design.body.md",
    entries: [
      {
        date: "2026-06-04",
        author: "arkadiusz",
        kind: "added",
        message:
          "Added Logo, Voice & Tone, AI / Agentic Expression and Asset Usage sections to align design.body.md with all seven branding sections defined in WEB_BRANDING (branding.ts).",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Typography: document Geist (`geist` package), `--font-geist-sans` / `--font-geist-mono`, and Next.js root layout snippet.",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Synced colour narrative with fuchsia primary, orange secondary, headline gradient, and on-dark orange; fixed foundations path; clarified destructive vs orange secondary.",
      },
    ],
  },
  {
    file: "design.md",
    entries: [
      {
        date: "2026-06-03",
        author: "arkadiusz",
        kind: "added",
        message:
          "Frontmatter now carries the full branding block (intro + all sections) so agents/LLMs reading design.md get the editorial brand brief alongside the tokens. Emitted by tokens-build from the new WEB_BRANDING export; required a YAML-dumper fix for block sequences of maps (arrays of objects).",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Regenerated from design.body.md after Geist typography (canonical doc v1.2).",
      },
      {
        date: "2026-05-14",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Regenerated from design.body.md after brand colour reset (canonical doc v1.1).",
      },
      {
        date: "2026-04-26",
        author: "maja",
        kind: "changed",
        message:
          "Tightened the “Do's and Don'ts” section with examples sourced from the live site.",
      },
      {
        date: "2026-04-25",
        author: "arkadiusz",
        kind: "added",
        message:
          "Wired canonical design.md asset (`src/data/products/web/design.md`) at v1.0.",
      },
      {
        date: "2026-04-20",
        author: "arkadiusz",
        kind: "added",
        message: "First draft mirroring the extract-summit canonical spec structure.",
      },
      {
        date: "2026-04-18",
        author: "arkadiusz",
        kind: "changed",
        message: "Pointed `typography.family.sans` at the Yellix stack used by the marketing site.",
      },
    ],
  },
];
