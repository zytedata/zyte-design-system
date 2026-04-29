import type { FileChangelog } from "@/data/foundations/types";

export const SCRAPY_FILE_CHANGELOGS: FileChangelog[] = [
  {
    file: "components.ts",
    entries: [
      {
        date: "2026-04-09",
        author: "arkadiusz",
        kind: "added",
        message:
          "Stub catalog placed; catalog will be filled in once the Scrapy components are migrated.",
      },
    ],
  },
  {
    file: "foundations.ts",
    entries: [
      {
        date: "2026-04-21",
        author: "maja",
        kind: "changed",
        message: "Refreshed scrapy semantic colors to match the open-source brand refresh.",
      },
      {
        date: "2026-04-09",
        author: "arkadiusz",
        kind: "added",
        message: "Created SCRAPY_FOUNDATIONS re-using shared scales until the brand kit lands.",
      },
    ],
  },
];
