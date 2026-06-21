import type { FileChangelog } from "@zytedata/ds-types";

export const EXTRACT_SUMMIT_FILE_CHANGELOGS: FileChangelog[] = [
  {
    file: "components.ts",
    entries: [
      {
        date: "2026-04-09",
        author: "arkadiusz",
        kind: "added",
        message:
          "Stub catalog — Extract Summit primitives still live in design.md until they harden.",
      },
    ],
  },
  {
    file: "foundations.ts",
    entries: [
      {
        date: "2026-04-26",
        author: "maja",
        kind: "fixed",
        message: "Tightened ghost letterforms to a 6 % alpha to keep contrast on lime backgrounds.",
      },
      {
        date: "2026-04-23",
        author: "maja",
        kind: "changed",
        message:
          "Re-derived flattened color rows from foundations.ts (primary / surface / ink / ghost / status).",
      },
      {
        date: "2026-04-17",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Switched canonicalDoc.assetPath to the package-local `src/data/products/extract-summit/design.md`.",
      },
      {
        date: "2026-04-11",
        author: "arkadiusz",
        kind: "added",
        message: "First flat foundation rows mirroring the brutalist palette buckets.",
      },
      {
        date: "2026-04-05",
        author: "arkadiusz",
        kind: "added",
        message: "Initial EXTRACT_SUMMIT_FOUNDATIONS bundle with the full brutalist scale.",
      },
    ],
  },
  {
    file: "design.md",
    entries: [
      {
        date: "2026-04-27",
        author: "maja",
        kind: "changed",
        message: "Expanded Do's and Don'ts with editorial guidance for sponsor sections.",
      },
      {
        date: "2026-04-20",
        author: "arkadiusz",
        kind: "added",
        message: "Hand-authored canonical spec used by the agentic markdown surface.",
      },
    ],
  },
];
