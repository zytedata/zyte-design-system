import type { ProductDocumentation } from "@zyte/ds-types";

/**
 * "How the Core design system works" — the operating manual for
 * `@zyte/ds-core`. Surfaced by the dashboard's Documentation page and read
 * verbatim by agents/LLMs through the package's `./design.md` export.
 */
export const CORE_DOCUMENTATION: ProductDocumentation = {
  productSlug: "core",
  intro:
    "@zyte/ds-core is the design system used by Zyte's internal apps and dashboards. It optimises for density, scannability and accessibility — neutral palette, tight rhythm, predictable component behaviour. Tokens are tuned for data-heavy UIs (tables, forms, toolbars, log views); marketing surfaces use @zyte/ds-web instead.",
  audience: ["Designers", "Frontend developers", "Agents / LLMs"],
  sections: [
    {
      id: "scope",
      title: "What this scope is for",
      body: "Core is the workhorse design system for tools that internal teams and customers actually operate the platform with. Where Web is about persuasion, Core is about throughput: every token decision is judged against \"does this make a 1000-row table easier to read?\".",
      bullets: [
        "Used by: this dashboard, future internal Next.js apps and admin surfaces.",
        "NOT used by: zyte-website-nextjs, Scrapy Cloud, Extract Summit landing.",
        "Owns: neutral grays, semantic statuses, focus rings, dense spacing scale, tabular-friendly typography.",
      ],
    },
    {
      id: "workflow",
      title: "Updating a token",
      body: "All token changes flow through foundations.ts. Editing dist/* directly is forbidden — those files are regenerated on every build.",
      steps: [
        {
          heading: "1. Edit foundations.ts",
          text: "Open packages/core/src/foundations.ts and bump the relevant entry. Core's neutrals currently mirror Web's accent palette as a placeholder; replace those with intentional Core values when the brand is ready, but don't introduce a Web→Core dependency.",
        },
        {
          heading: "2. Edit design.body.md if needed",
          text: "If the change introduces a new pattern, update packages/core/src/design.body.md (prose only). YAML frontmatter for design.md is regenerated; never edit it by hand.",
        },
        {
          heading: "3. Run the codegen locally",
          text: "`pnpm --filter @zyte/ds-core build` rebuilds dist/. The dashboard regenerates this for you on `pnpm dev` via the workspace predev hook.",
        },
        {
          heading: "4. Queue a changeset",
          text: "`pnpm changeset` → pick @zyte/ds-core, choose the bump level, commit the .changeset/*.md alongside your foundations.ts diff.",
        },
        {
          heading: "5. PR → merge → release",
          text: "validate.yml gates the PR; release.yml opens a release PR on merge that publishes the bumped package once you merge it.",
        },
      ],
    },
    {
      id: "consume",
      title: "Consuming @zyte/ds-core in an app",
      body: "Core is consumed exactly like Web, but namespaced under `--core-*` / `$core-*` so the two systems can sit side by side in the same bundle without clashing.",
      code: {
        language: "tsx",
        content: `// app/layout.tsx — pick the right bundle for the surface
import "@zyte/ds-core/tokens.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-design-system="core">{children}</body>
    </html>
  );
}

// any component
function Toolbar() {
  return (
    <div className="rounded-md border" style={{
      background: "var(--core-bg-default)",
      color: "var(--core-fg-default)",
    }}>...</div>
  );
}`,
      },
      bullets: [
        "Prefer CSS custom properties (`var(--core-*)`) over JS imports — they survive theme changes.",
        "If you need typed access (e.g. for component props), `import { CORE_FOUNDATIONS } from \"@zyte/ds-core\"`.",
        "The Tailwind preset `@zyte/ds-core/tailwind` lets you write `bg-core-bg-default` directly.",
      ],
    },
    {
      id: "conventions",
      title: "Conventions for Core UI",
      bullets: [
        "Density first: prefer 4/8/12px spacing over 16/24/32px. Decorative whitespace belongs in Web.",
        "No decorative animation: animations are reserved for state transitions (loading, success, error).",
        "All interactive elements ship a visible focus ring — `--core-focus-ring` is non-negotiable.",
        "Text colors map to semanticColors (`fg.default`, `fg.muted`, `fg.subtle`); avoid raw `gray.700` references.",
        "Status colors map 1:1 to log levels (info / warn / error / success); reuse them, don't invent new ones.",
      ],
    },
    {
      id: "agents",
      title: "What agents / LLMs read",
      body: "When generating Core UI, agents should fetch `@zyte/ds-core/design.md` first. The frontmatter declares the full token tree (machine-readable, regenerated on every build) and the body explains conventions like \"density first\" so the generated UI fits the rest of the dashboard.",
    },
  ],
};
