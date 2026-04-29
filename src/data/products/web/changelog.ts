import type { FileChangelog } from "@/data/foundations/types";

export const WEB_FILE_CHANGELOGS: FileChangelog[] = [
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
    file: "design.md",
    entries: [
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
