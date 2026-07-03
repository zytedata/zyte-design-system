# Changelog

## 0.6.0

### Minor Changes

- [#45](https://github.com/zytedata/zyte-design-system/pull/45) [`0da43c7`](https://github.com/zytedata/zyte-design-system/commit/0da43c721bf0b5b85b4096d7ce800bf206bec53e) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Web design system: fonts, brand mark, templates and design.md refinements.

  - **Fonts:** ship the Yellix brand typeface (woff2/woff, weights 300/400/600/700) plus a ready-made `@font-face` stylesheet. New package exports `@zytedata/ds-web/fonts.css` and `@zytedata/ds-web/fonts/*`. `design.md` now documents both the package path and a hosted-webfont fallback (`https://zyte-design.vercel.app/fonts/yellix.css`) with direct download URLs.
  - **Mark:** add the gradient mark as an alternative logo / favicon asset (`@zytedata/ds-web/assets/mark.svg`), documented in the Logo and Mark sections.
  - **Templates:** per-use-case template overlays (marketing / report / deck).
  - **Logo:** primary logo is brand fuchsia (`#B02CCE`); dropped the gradient variants and unified the brand fuchsia across the spec.
  - **design.md editorial:** explicit "no full stop at the end of a headline" rule, and the standalone Do's/Don'ts section folded into the "What NOT To Do" table.

## 0.5.0

### Minor Changes

- [#26](https://github.com/zytedata/zyte-design-system/pull/26) [`5d03db1`](https://github.com/zytedata/zyte-design-system/commit/5d03db1799d8d1b71ee633ea7a14e66924c5f7d3) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Add `typography.size.7xl` (68px) display tier for the hero/H1, and reconcile `design.md` so the prose, the primitive tables and `foundations.ts` all agree:

  - Consolidated component specs into a single **Primitive Style Rules** section (buttons, typography, pills/badges, surfaces, form controls, atoms, navigation).
  - Unified the primary CTA to `primary.500` (fuchsia) and removed legacy phantom tokens (`accentPrimary`/`accentSecondary`/`accentSecondaryOnDark`) that did not exist in foundations.
  - Fixed the radius guidance (removed "12px everywhere" in favour of the real `radius` scale), the card border (`0.5px solid neutral.200`), and heading sizes (H1 `7xl` 68 / H2 `5xl` 48).
  - Mapped Section Backgrounds and Page Metrics to tokens (`surfaceLight.*`, `secondary.800`, `primary.50`, `spacing.*`); section-number eyebrows now use `primary.500`.

## 0.4.1

### Patch Changes

- [#24](https://github.com/zytedata/zyte-design-system/pull/24) [`b054fcd`](https://github.com/zytedata/zyte-design-system/commit/b054fcd2a7a51b8d946f8f184cd454f7bb6cfffa) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Document zyte.com-aligned component specs in the Web design doc: Button Variants, Card Variants, Badges & Pills, Navigation, Section Backgrounds and Page Metrics, with a Pending Token Decisions appendix. Button colours map to nearest existing foundations tokens; no tokens changed.

## 0.4.0

### Minor Changes

- [#22](https://github.com/zytedata/zyte-design-system/pull/22) [`af52d7d`](https://github.com/zytedata/zyte-design-system/commit/af52d7dbf0dd9f539a89a6f35ebed4239f1ae583) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Expose brand assets via the package `exports` map: `@zytedata/ds-web/assets/*` now resolves to the shipped SVGs in `src/assets` (e.g. `@zytedata/ds-web/assets/logo.primary.svg`). The files were already published but sealed off by the `exports` encapsulation; consumers can now import them directly instead of reaching into internal paths.

## 0.3.0

### Minor Changes

- [#19](https://github.com/zytedata/zyte-design-system/pull/19) [`483f0db`](https://github.com/zytedata/zyte-design-system/commit/483f0db07a3b047574ef801f8b07c7ce74f4a687) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Add `typography.family.display` (Yellix) and `colors.heroGradient` (landing-page navy → fuchsia background); update Web design.body.md prose to match (hero/H1-H2 typography, 12px shape language, flat cards, Lucide icons, section numbering & ribbon mnemonic).

### Patch Changes

- [#19](https://github.com/zytedata/zyte-design-system/pull/19) [`483f0db`](https://github.com/zytedata/zyte-design-system/commit/483f0db07a3b047574ef801f8b07c7ce74f4a687) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Fix Tailwind preset codegen so non-color scales emit flat `<slug>-*` keys. Tailwind v3's `flattenColorPalette` only deep-flattens `colors`, so previously every other scale shipped nested under `<slug>` (e.g. `borderRadius.web.xl`) and never generated a utility — consumers had to re-flatten the preset by hand. The generator now emits `borderRadius["web-xl"]`, `fontSize["web-5xl"]`, `fontFamily["web-display"]`, etc. directly, so `rounded-web-xl`, `text-web-5xl`, `font-web-display` and the equivalent utilities across all products work out of the box. Colors are unchanged (still nested, flattened natively by Tailwind).

- [#19](https://github.com/zytedata/zyte-design-system/pull/19) [`483f0db`](https://github.com/zytedata/zyte-design-system/commit/483f0db07a3b047574ef801f8b07c7ce74f4a687) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Make Yellix the default Web typeface: `typography.family.sans` now leads with `var(--font-yellix)` (Geist Sans demoted to fallback). design.body.md updated to match.

All notable changes to `@zytedata/ds-web` are documented here.

The monorepo also keeps a **per-source** machine-readable log in `src/changelog.ts` (surfaced in the DesignOps dashboard under **Web → Changelog**). This file is the **package / release** changelog; bump it when you run Changesets for a published version.

## [Unreleased]

### Added

- **Surface layers:** `colors.surfaceDark` and `colors.surfaceLight` (keys `background`, `pageSections`, `secondary`, `cards`) for dark/light app chrome. Canonical doc **1.3**.

### Changed

- **Colours:** Primary palette is now **Zyte Fuchsia** (canonical `primary.600` = `#c026d3`). `accentSecondary` is the marketing **orange** ramp (canonical `accentSecondary.500` = `#e8520a`).
- **New tokens:** `accentSecondaryOnDark` (`#ff6b2b`) for dark surfaces; `headlineGradient` (orange → fuchsia) for headline highlights only.
- **Spec:** `design.body.md` and generated `design.md` aligned with the new roles; canonical doc version **1.1**.
- **Typography:** Primary UI stack is **Geist Sans** and **Geist Mono** via `var(--font-geist-sans)` / `var(--font-geist-mono)` (install [`geist`](https://www.npmjs.com/package/geist) in the Next app and wire `GeistSans` / `GeistMono` on `<html>`). Canonical doc **1.2**.
