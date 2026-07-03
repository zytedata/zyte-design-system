---
"@zytedata/ds-web": minor
---

Web design system: fonts, brand mark, templates and design.md refinements.

- **Fonts:** ship the Yellix brand typeface (woff2/woff, weights 300/400/600/700) plus a ready-made `@font-face` stylesheet. New package exports `@zytedata/ds-web/fonts.css` and `@zytedata/ds-web/fonts/*`. `design.md` now documents both the package path and a hosted-webfont fallback (`https://zyte-design.vercel.app/fonts/yellix.css`) with direct download URLs.
- **Mark:** add the gradient mark as an alternative logo / favicon asset (`@zytedata/ds-web/assets/mark.svg`), documented in the Logo and Mark sections.
- **Templates:** per-use-case template overlays (marketing / report / deck).
- **Logo:** primary logo is brand fuchsia (`#B02CCE`); dropped the gradient variants and unified the brand fuchsia across the spec.
- **design.md editorial:** explicit "no full stop at the end of a headline" rule, and the standalone Do's/Don'ts section folded into the "What NOT To Do" table.
