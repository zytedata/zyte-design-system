# Changelog

All notable changes to `@zyte/ds-web` are documented here.

The monorepo also keeps a **per-source** machine-readable log in `src/changelog.ts` (surfaced in the DesignOps dashboard under **Web → Changelog**). This file is the **package / release** changelog; bump it when you run Changesets for a published version.

## [Unreleased]

### Added

- **Surface layers:** `colors.surfaceDark` and `colors.surfaceLight` (keys `background`, `pageSections`, `secondary`, `cards`) for dark/light app chrome. Canonical doc **1.3**.

### Changed

- **Colours:** Primary palette is now **Zyte Fuchsia** (canonical `primary.600` = `#c026d3`). `accentSecondary` is the marketing **orange** ramp (canonical `accentSecondary.500` = `#e8520a`).
- **New tokens:** `accentSecondaryOnDark` (`#ff6b2b`) for dark surfaces; `headlineGradient` (orange → fuchsia) for headline highlights only.
- **Spec:** `design.body.md` and generated `design.md` aligned with the new roles; canonical doc version **1.1**.
- **Typography:** Primary UI stack is **Geist Sans** and **Geist Mono** via `var(--font-geist-sans)` / `var(--font-geist-mono)` (install [`geist`](https://www.npmjs.com/package/geist) in the Next app and wire `GeistSans` / `GeistMono` on `<html>`). Canonical doc **1.2**.
