---
type: Convention
title: Token authoring rules (foundations.ts)
description: How to write a product's foundations.ts so the codegen emits correct, house-style token artefacts.
tags: [convention, tokens, foundations, house-style]
origin: code
timestamp: 2026-08-29
---

# Token authoring rules (foundations.ts)

## What it is

The rules for editing `packages/<slug>/src/foundations.ts` — the single source of
truth for one product's tokens. It is plain TypeScript typed as
`ProductFoundations` from `@zytedata/ds-types`; there is no DSL. Get the shape
right and the codegen ([../architecture/codegen-engine.md](../architecture/codegen-engine.md))
does the rest.

## The pieces

- **Source:** `packages/<slug>/src/foundations.ts`, exporting a named const
  `<SLUG>_FOUNDATIONS` (e.g. `WEB_FOUNDATIONS`, `EXTRACT_SUMMIT_FOUNDATIONS`).
  The export name is derived by the codegen from the package slug — it **must**
  match or the build throws `must export <NAME>_FOUNDATIONS`.
- **Contract:** `ProductFoundations` in `packages/types/src/index.ts` — required
  keys `label`, `description`, `colors`, `semanticColors`, `typography`,
  `spacing`, `radius`, `shadow`, `breakpoint`, `opacity`, `zIndex`; optional
  `components`, `canonicalDoc`.
- **Prose partner:** `packages/<slug>/src/design.body.md` — the human-readable
  spec. Its YAML front-matter is regenerated on build; never hand-edit
  `dist/design.md`.

## The contract

Rules the codegen imposes (see `iterateTokens` / `cssVarFragment` / `withUnit` in
`packages/tokens-build/src/index.ts`):

- **Colors** are `Record<paletteName, Record<shade, hex>>`. A palette can nest
  arbitrarily deep (Extract Summit uses `primary.hover`, `surface.card-border`).
  CSS var = `--<slug>-<palette>-<shade>` (colors are joined with **no** category
  prefix).
- **`DEFAULT` collapses.** A `DEFAULT` key emits the bare variable for its
  parent — `radius.DEFAULT` → `--<slug>-radius`, and
  `headlineGradient.DEFAULT` → `--<slug>-headline-gradient`. Use it for
  single-value palettes/scales.
- **`semanticColors` maps a role → a _palette name_**, not a hex. E.g.
  `{ brand: "primary", accent: "accent", surface: "neutral" }`. It is emitted
  into `tokens.json` under `semantic.color` and into `design.md` frontmatter, but
  **not** into `tokens.css`/`scss`/`tailwind`.
- **Numbers get units in px-categories only.** `spacing`, `radius`, `breakpoint`,
  `typography.size`, `typography.letterSpacing` → the number is emitted with a
  `px` suffix. `opacity`, `zIndex`, `typography.weight`, `typography.lineHeight`
  stay unitless. Strings pass through verbatim (so a shadow or gradient string
  emits as-is).
- **camelCase keys are kebab-cased** in the emitted var name
  (`pageSections` → `page-sections`); dots in keys also become dashes.
- **Typography lives under `typography.{family,size,weight,lineHeight,letterSpacing}`**
  and emits the CSS-var families `--<slug>-font-*`, `--<slug>-text-*`,
  `--<slug>-font-weight-*`, `--<slug>-line-height-*`, `--<slug>-letter-spacing-*`.

## Gotchas

- **`canonicalDoc.version` is NOT the npm version.** `foundations.ts`'
  `canonicalDoc.version` (e.g. Web `"1.3"`) is the _design-doc_ version stamped
  into `design.md`; the published package version lives in `package.json` (e.g.
  Web `0.6.0`) and is bumped by changesets. They move independently.
- **Editing `tokens.css`/`tokens.scss` directly is forbidden** — they are codegen
  output, overwritten every build. `documentation.ts` for Web states this
  explicitly.
- The build won't fail on ugly-but-typed structure. `tokens:check` only validates
  that artefacts exist, are non-empty, and carry the right `$product`/`--<slug>-`
  markers — house-style is a review call. See
  [no-arbitrary-construction.md](./no-arbitrary-construction.md).
- Keep the change **minimal**: touch only the requested token group. The
  `change-foundation` skill enforces this and it's the review expectation too.

## Related

- [adding-a-token.md](./adding-a-token.md) — the end-to-end recipe
- [../architecture/codegen-engine.md](../architecture/codegen-engine.md) — how the emitters interpret this shape
- [../architecture/type-contract.md](../architecture/type-contract.md) — the `ProductFoundations` type
- [../architecture/output-surfaces.md](../architecture/output-surfaces.md) — what each artefact looks like
