import type { ProductDocumentation } from "@zyte/ds-types";

/**
 * "How the Extract Summit design system works" — the operating manual
 * for `@zyte/ds-extract-summit`. Surfaced by the dashboard's
 * Documentation page and read verbatim by agents/LLMs through the
 * package's `./design.md` export.
 */
export const EXTRACT_SUMMIT_DOCUMENTATION: ProductDocumentation = {
  productSlug: "extract-summit",
  intro:
    "@zyte/ds-extract-summit is the design system used by the Extract Summit conference site and surrounding event marketing. It is the loudest of the four scopes: brutalist by design — high contrast, sharp corners, oversized typography, lime accent. It deliberately diverges from @zyte/ds-web because event sites need to feel like an event, not like the parent brand.",
  audience: ["Designers", "Event-site developers", "Agents / LLMs"],
  sections: [
    {
      id: "scope",
      title: "What this scope is for",
      body: "Extract Summit owns a separate, expressive aesthetic from the rest of Zyte. It is the place where typographic rule-breaking, asymmetric layouts and chromatic shock are allowed — and encouraged. Contain that energy here so it does not leak into Web or Core.",
      bullets: [
        "Used by: extract-summit.com, conference landing pages, schedule, sponsor sections.",
        "NOT used by: zyte-website-nextjs, internal apps, Scrapy product UIs.",
        "Owns: brutalist scale, lime/black accent system, oversized display type, geometric radius=0 defaults.",
      ],
    },
    {
      id: "workflow",
      title: "Updating a token",
      body: "The codegen pipeline is identical to the other scopes — but expect more frequent visual experimentation here, so changesets often land as `minor` rather than `patch`.",
      steps: [
        {
          heading: "1. Edit foundations.ts",
          text: "Open packages/extract-summit/src/foundations.ts. Brutalist scales (display sizes, oversized spacing) live here; resist the urge to also push them into Core.",
        },
        {
          heading: "2. Edit design.body.md",
          text: "Update packages/extract-summit/src/design.body.md when adding or retiring a pattern. Brutalist conventions are easier to break inadvertently than restrained ones, so document them well.",
        },
        {
          heading: "3. Build & check",
          text: "`pnpm --filter @zyte/ds-extract-summit build && pnpm --filter @zyte/ds-extract-summit check:tokens`. The check ensures the codegen frontmatter still names the product correctly and that tokens.css carries `--extract-summit-*` variables.",
        },
        {
          heading: "4. Changeset → PR → release",
          text: "`pnpm changeset` and the standard release flow.",
        },
      ],
      callout: {
        tone: "tip",
        title: "Bias toward minor bumps",
        body: "Visual changes here read as semver-minor most of the time — the public site reflects whatever ships. Use patch for typo/contrast fixes, minor for new patterns or retired ones, major only when the API of foundations.ts itself changes.",
      },
    },
    {
      id: "consume",
      title: "Consuming @zyte/ds-extract-summit on the event site",
      body: "Inject tokens.css once at the app shell. Because the brutalist defaults differ so much from the other scopes, do NOT mix Extract Summit tokens with Web tokens in the same view — pick one.",
      code: {
        language: "tsx",
        content: `import "@zyte/ds-extract-summit/tokens.css";

export default function HeroSection() {
  return (
    <section style={{
      background: "var(--extract-summit-surface-canvas)",
      color: "var(--extract-summit-fg-primary)",
      padding: "var(--extract-summit-spacing-12)",
      borderRadius: "var(--extract-summit-radius-none)",
    }}>
      <h1 style={{
        fontFamily: "var(--extract-summit-font-display)",
        fontSize: "var(--extract-summit-text-display-xl)",
      }}>
        EXTRACT SUMMIT
      </h1>
    </section>
  );
}`,
      },
    },
    {
      id: "conventions",
      title: "Conventions for Extract Summit UI",
      bullets: [
        "Sharp by default: `border-radius: 0` is the baseline. Round corners are an exception, not the rule.",
        "Type is loud: display sizes go where Web wouldn't dare. Lean into the brutalism rather than fighting it.",
        "High contrast: lime on black, black on lime — keep contrast above WCAG AA but resist softening it.",
        "Asymmetry is welcome: grids may break, columns may overlap. Document the pattern in design.body.md so it's intentional, not random.",
        "Don't borrow Core/Web visual language here — the whole point of the scope is to look unmistakably different.",
      ],
    },
    {
      id: "agents",
      title: "What agents / LLMs read",
      body: "Agents generating event-site UI should fetch `@zyte/ds-extract-summit/design.md` and read the body section closely — the conventions are deliberately unusual and easy to revert toward generic web-app patterns. The frontmatter (machine-readable) carries the full token tree as usual.",
    },
  ],
};
