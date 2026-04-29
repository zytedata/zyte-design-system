import type { ProductDocumentation } from "@zyte/ds-types";

/**
 * "How the Scrapy design system works" — the operating manual for
 * `@zyte/ds-scrapy`. Surfaced by the dashboard's Documentation page and
 * read verbatim by agents/LLMs through the package's `./design.md` export.
 */
export const SCRAPY_DOCUMENTATION: ProductDocumentation = {
  productSlug: "scrapy",
  intro:
    "@zyte/ds-scrapy is the design system used by Scrapy-adjacent product surfaces (Scrapy Cloud, Scrapyd UI, spider job consoles). It optimises for code-adjacency and observability — terminal-friendly typography, log-level semantic colors, dark-mode-first contrast. The audience is developers monitoring crawls, not end-users buying a product.",
  audience: ["Designers", "Backend / fullstack developers", "Agents / LLMs"],
  sections: [
    {
      id: "scope",
      title: "What this scope is for",
      body: "Scrapy product UIs sit between a CLI and a web app: they show realtime job state, log streams, spider configs and traces. Scrapy's design system therefore overlaps with Core for chrome (dialogs, tables) but owns the code-adjacent vocabulary: monospace fonts, log severity palette, scroll-anchored panels.",
      bullets: [
        "Used by: Scrapy Cloud, Scrapyd web UI, internal Scrapy tooling.",
        "NOT used by: zyte-website-nextjs, Extract Summit, the marketing blog.",
        "Owns: amber accent (active job), severity scale (debug → critical), monospace + tabular fonts, dark-first surface tokens.",
      ],
    },
    {
      id: "workflow",
      title: "Updating a token",
      steps: [
        {
          heading: "1. Edit foundations.ts",
          text: "Open packages/scrapy/src/foundations.ts. Status colors get the most attention here — they map to log severities and are read by automation, so changes need a discussion before merging.",
        },
        {
          heading: "2. Edit design.body.md",
          text: "If the change touches conventions (e.g. \"warn level should be amber-600 not amber-500\"), update packages/scrapy/src/design.body.md so the agent surface stays in sync.",
        },
        {
          heading: "3. Build and validate",
          text: "`pnpm --filter @zyte/ds-scrapy build && pnpm --filter @zyte/ds-scrapy check:tokens`. The latter ensures dist/design.md frontmatter still declares product: \"scrapy\" and that tokens.css carries `--scrapy-*` variables.",
        },
        {
          heading: "4. Changeset → PR → release",
          text: "`pnpm changeset` and the standard release flow described in the workspace's RELEASING.md.",
        },
      ],
    },
    {
      id: "consume",
      title: "Consuming @zyte/ds-scrapy in a Scrapy UI",
      body: "Scrapy UIs typically run dark-first. Inject tokens.css once at the app shell and treat each `--scrapy-status-*` variable as the canonical mapping for that severity.",
      code: {
        language: "tsx",
        content: `import "@zyte/ds-scrapy/tokens.css";

const STATUS_VAR = {
  debug:    "var(--scrapy-status-debug)",
  info:     "var(--scrapy-status-info)",
  warn:     "var(--scrapy-status-warn)",
  error:    "var(--scrapy-status-error)",
  critical: "var(--scrapy-status-critical)",
} as const;

function LogLine({ level, msg }) {
  return (
    <pre style={{
      color: STATUS_VAR[level],
      fontFamily: "var(--scrapy-font-mono)",
    }}>{msg}</pre>
  );
}`,
      },
    },
    {
      id: "conventions",
      title: "Conventions for Scrapy UI",
      bullets: [
        "Dark mode is the canonical theme. Light mode is a fallback, not the design target.",
        "Monospace font (`--scrapy-font-mono`) is the default for IDs, paths, log lines, and any value the user might paste back into a CLI.",
        "Status colors are reserved for state — don't reuse them for marketing accents or brand chrome.",
        "Tables get tabular figures (`font-variant-numeric: tabular-nums`) so columns don't jitter.",
        "Long-running operations show progress with a determinate bar; spinners are for sub-second waits only.",
      ],
    },
    {
      id: "agents",
      title: "What agents / LLMs read",
      body: "When generating Scrapy UI snippets, agents pull `@zyte/ds-scrapy/design.md`. The status-color contract there is especially important — getting log-severity colors wrong creates real operational risk for users tailing crawls.",
    },
  ],
};
