import type { FileChangelog } from "@zyte/ds-types";

export const CORE_FILE_CHANGELOGS: FileChangelog[] = [
  {
    file: "components.ts",
    entries: [
      {
        date: "2026-04-24",
        author: "arkadiusz",
        kind: "changed",
        message: "Marked Toast and OverlayPanel as implemented after the PrimeNG 17 wave.",
      },
      {
        date: "2026-04-10",
        author: "maja",
        kind: "added",
        message: "Initial PrimeNG-oriented Core catalog with Form / Data / Overlay / Misc groups.",
      },
    ],
  },
  {
    file: "foundations.ts",
    entries: [
      {
        date: "2026-06-17",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Replaced the Web-aliased palette with the live Dash foundation 1:1 (actionPrimary, accentPrimary, accentSecondaryCold/Warm, colorGray, surface, text, status ramps + legacy colors); brand now maps to accentSecondaryCold.",
      },
      {
        date: "2026-04-19",
        author: "arkadiusz",
        kind: "added",
        message: "Stood up CORE_FOUNDATIONS bundle re-using Web colors + shared scales.",
      },
      {
        date: "2026-04-15",
        author: "arkadiusz",
        kind: "changed",
        message:
          "Re-aliased palettes to the Web foundation rows so internal apps follow brand updates automatically.",
      },
    ],
  },
];
