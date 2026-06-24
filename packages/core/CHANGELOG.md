# @zytedata/ds-core

## 0.1.1

### Patch Changes

- [#19](https://github.com/zytedata/zyte-design-system/pull/19) [`483f0db`](https://github.com/zytedata/zyte-design-system/commit/483f0db07a3b047574ef801f8b07c7ce74f4a687) Thanks [@arkadiuszjaneczko1](https://github.com/arkadiuszjaneczko1)! - Fix Tailwind preset codegen so non-color scales emit flat `<slug>-*` keys. Tailwind v3's `flattenColorPalette` only deep-flattens `colors`, so previously every other scale shipped nested under `<slug>` (e.g. `borderRadius.web.xl`) and never generated a utility — consumers had to re-flatten the preset by hand. The generator now emits `borderRadius["web-xl"]`, `fontSize["web-5xl"]`, `fontFamily["web-display"]`, etc. directly, so `rounded-web-xl`, `text-web-5xl`, `font-web-display` and the equivalent utilities across all products work out of the box. Colors are unchanged (still nested, flattened natively by Tailwind).
