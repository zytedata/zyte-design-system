import type { ProductDocumentation } from "@zytedata/ds-types";

/**
 * "How the Web design system works" — the operating manual for
 * `@zytedata/ds-web`. Surfaced by the dashboard's Documentation page and read
 * verbatim by agents/LLMs through the package's `./design.md` export plus
 * this constant.
 */
export const WEB_DOCUMENTATION: ProductDocumentation = {
  productSlug: "web",
  intro:
    "@zytedata/ds-web is the design system used by the public Zyte website (zyte-website-nextjs). It optimises for trust, scannability and SEO — sober palette, generous typography, content-first layouts. Tokens are tuned to drive marketing pages, product overviews and the blog; rich app UI lives under @zytedata/ds-core instead.",
  audience: ["Designers", "Frontend developers", "Agents / LLMs"],
  sections: [
    {
      id: "scope",
      title: "What this scope is for",
      body: "The Web package powers the marketing surface — the public website, the blog, landing pages and product overviews. It is intentionally narrow: heavy app UI patterns (data tables, forms, toolbars) belong in @zytedata/ds-core because the Web brand prioritises legibility and pace, not density.",
      bullets: [
        "Used by: zyte-website-nextjs (and any future marketing landing).",
        "NOT used by: internal dashboards, Scrapy Cloud, Extract Summit's event site.",
        "Owns: brand color, marketing typography scale, hero/spacing rhythm, accent treatment.",
      ],
    },
    {
      id: "workflow",
      title: "Updating a token",
      body: "All token changes flow through foundations.ts. Editing tokens.css/tokens.scss directly is forbidden — those files are codegen output and are overwritten on every build.",
      steps: [
        {
          heading: "1. Edit foundations.ts",
          text: "Open packages/web/src/foundations.ts and bump the relevant entry (e.g. colors.accent['600']). Keep changes scoped — colors that are about brand voice should land here; layout/density tokens probably want @zytedata/ds-core instead.",
        },
        {
          heading: "2. Edit design.body.md if needed",
          text: "If the change introduces a new pattern or replaces an existing one, update packages/web/src/design.body.md (prose only). The YAML frontmatter for design.md is regenerated automatically; never edit it by hand.",
        },
        {
          heading: "3. Run the codegen locally",
          text: "`pnpm --filter @zytedata/ds-web build` rebuilds dist/{tokens.json,tokens.css,tokens.scss,tokens.tailwind.cjs,design.md,index.js,...}. The dashboard's predev/prebuild hook does this for you on `pnpm dev`.",
        },
        {
          heading: "4. Queue a changeset",
          text: "Run `pnpm changeset`, pick @zytedata/ds-web and the bump level (patch for fixes, minor for additive changes, major for breaking renames or removals). Commit the resulting .changeset/*.md alongside your foundations.ts diff.",
        },
        {
          heading: "5. Open a PR",
          text: "validate.yml runs typecheck, lint, tokens:check and a dashboard build smoke. tokens:check fails the PR if the codegen drifts (a sign that someone hand-edited dist/) or if design.md no longer declares the right product slug.",
        },
        {
          heading: "6. Merge → release.yml publishes",
          text: "On merge, the release workflow opens a `chore(release): version packages` PR. Merging that PR publishes the bumped @zytedata/ds-web to GitHub Packages. zyte-website-nextjs picks it up via Renovate (or `pnpm up @zytedata/ds-web`).",
        },
      ],
      callout: {
        tone: "warning",
        title: "Never hand-edit dist/",
        body: "tokens.css, tokens.scss, tokens.tailwind.cjs, tokens.json and design.md are generated. Any change you make there is silently lost on the next codegen run. Edit foundations.ts (machine-readable) or design.body.md (prose).",
      },
    },
    {
      id: "consume",
      title: "Consuming @zytedata/ds-web in the website",
      body: "The package ships every artefact through its exports map. Pick the surface that matches your toolchain — they all carry the same tokens, just in different file formats.",
      code: {
        language: "scss",
        content: `// styles/_tokens.scss
@use "@zytedata/ds-web/tokens.scss" as web;

.hero-title {
  font-family: web.$web-font-display;
  font-size: web.$web-text-3xl;
  color: web.$web-accent-700;
  margin-bottom: web.$web-spacing-6;
}`,
      },
      bullets: [
        '`@zytedata/ds-web/tokens.scss` — SCSS variables namespaced as `$web-*`.',
        '`@zytedata/ds-web/tokens.css` — CSS custom properties on `:root` namespaced as `--web-*`.',
        '`@zytedata/ds-web/tailwind` — a Tailwind v3 preset for `tailwind.config.js#presets`.',
        '`@zytedata/ds-web/tokens.json` — DTCG token JSON for Style Dictionary / Figma Tokens.',
        '`@zytedata/ds-web/design.md` — the agent-readable spec (prose + YAML frontmatter).',
        '`@zytedata/ds-web` (default) — programmatic access: `import { WEB_FOUNDATIONS } from "@zytedata/ds-web"`.',
      ],
    },
    {
      id: "agents",
      title: "What agents / LLMs read",
      body: "The package's `./design.md` export is intended to be the canonical brief that an agent reads before generating Web UI. The frontmatter is regenerated from foundations.ts on every codegen run, so it never lies; the body is hand-prose.",
      bullets: [
        "Frontmatter (machine): product slug, label, version, full token tree, semantic colors, components contract.",
        "Body (human): purpose, principles, voice, conventions, dos/don'ts.",
        "Stable across versions: agents can pin the version they trained against and still read newer design.md without breakage.",
      ],
    },
    {
      id: "consumer-stack",
      title: "What zyte-website-nextjs actually runs (for context)",
      body: "These notes describe the consumer's reality so design decisions land on solid ground. They are not a contract — the consumer is allowed to evolve.",
      bullets: [
        "Next.js App Router + React 19.",
        "TypeScript across app, util and component layers.",
        "Tailwind CSS v4 loaded globally from styles/tailwind.css.",
        "Geist Sans / Geist Mono via the `geist` package: `GeistSans` / `GeistMono` from `geist/font/sans` and `geist/font/mono` on the root `<html>` so `--font-geist-sans` / `--font-geist-mono` match `WEB_FOUNDATIONS.typography.family`.",
        "SCSS modules + global SCSS (reset, theme, primereact overrides).",
        "Contento CMS as content source with local module/template rendering.",
        "PrimeReact in selected flows with custom SCSS overrides tied to design tokens.",
      ],
    },
    {
      id: "alignment",
      title: "Migration & alignment priorities",
      body: "Open work items the design system is actively driving toward in zyte-website-nextjs.",
      bullets: [
        "Replace the legacy `styles/_colors.scss` with `@use \"@zytedata/ds-web/tokens.scss\"` and remove the duplicate Tailwind hex map.",
        "Document when to use Tailwind utilities vs SCSS modules for new Web UI work.",
        "Track migration from legacy module rendering to template-based page sections.",
        "Keep PrimeReact / third-party overrides tied to design tokens, not ad-hoc values.",
      ],
    },
    {
      id: "dont",
      title: "Anti-patterns",
      bullets: [
        "Don't add a new color without auditing semanticColors first — most needs are covered.",
        "Don't introduce decorative animations here (Web is content-first); experiment in @zytedata/ds-extract-summit instead.",
        "Don't import `tokens.tailwind.cjs` directly into a non-Tailwind project — use tokens.css instead.",
        "Don't fork @zytedata/ds-web for a sub-page; make a new product scope (talk to the team) or add a semantic token here.",
      ],
    },
  ],
};
