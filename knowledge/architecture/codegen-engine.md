---
type: Architecture
title: The codegen engine (tokens-build)
description: How @zytedata/tokens-build walks arbitrary token trees and emits CSS/SCSS/JSON/Tailwind/design.md, plus its slug rules and determinism guarantee.
tags: [architecture, codegen, tokens-build, determinism, idempotency]
origin: code
timestamp: 2026-08-29
---

# The codegen engine (tokens-build)

## What it is

`@zytedata/tokens-build` is the build-time-only CLI that turns a compiled
`foundations.ts` into every shipped artefact. Its whole implementation is
`packages/tokens-build/src/index.ts` (~900 lines, no runtime dependencies beyond
`@zytedata/ds-types` types); the two bin wrappers are `src/bin/build.ts` and
`src/bin/check.ts`.

## The pieces

- **Slug + export-name rules.** `slugFromPackageName` requires the package be
  named `@zytedata/ds-<slug>` (`^@zytedata/ds-([a-z][a-z0-9-]*)$`) or it throws.
  `exportNameForSlug` derives the expected const: slug upcased, `-`→`_`,
  `+ "_FOUNDATIONS"` (so `ds-extract-summit` → `EXTRACT_SUMMIT_FOUNDATIONS`).
  Branding uses `<SLUG>_BRANDING`.
- **The walker.** `walkLeaves` recursively yields `{ parts, value }` for every
  string/number leaf of an arbitrary object tree, collapsing any `DEFAULT` key
  onto its parent. `iterateTokens` drives it over the top-level groups
  (`colors, spacing, radius, shadow, breakpoint, opacity, zIndex`) plus
  `typography.{family,size,weight,lineHeight,letterSpacing}`. This is why **flat
  palettes (Web/Core/Scrapy) and deeply-nested scales (Extract Summit) both
  emit** without special-casing — the "schema-tolerant" property.
- **Var naming.** `cssVarFragment` maps each group to a prefix
  (`colors`→none, `spacing`→`spacing-`, `radius`→`radius-`, `shadow`→`shadow-`,
  `breakpoint`→`breakpoint-`, `opacity`→`opacity-`, `zIndex`→`z-`,
  `typography.family`→`font-`, `.size`→`text-`, `.weight`→`font-weight-`,
  `.lineHeight`→`line-height-`, `.letterSpacing`→`letter-spacing-`).
  `slugifyPart` kebab-cases keys. `withUnit` appends `px` for the px-categories
  (`spacing, radius, breakpoint, size, letterSpacing`).
- **Emitters** (each a pure function of `(foundations, slug)`):
  `buildTokensCss` (`:root { --<slug>-… }`), `buildTokensScss` (`$<slug>-…`,
  quoting values with commas/spaces), `buildTokensJson` (DTCG-flavoured, with
  `$product/$label/$description/$version`, `$value`/`$type` per leaf, plus
  `semantic.color` and `components`), `buildTokensTailwind` (colors stay **nested**
  under `colors.<slug>.*` so Tailwind v3's `flattenColorPalette` expands them;
  every other scale is emitted **flat** as `<slug>-*`).
- **design.md composer.** `composeDesignMd` prepends a generated banner + a YAML
  frontmatter block (built by a hand-rolled `dumpYaml`) to the trimmed
  `design.body.md`. `emitTemplates` flattens each `src/templates/<id>.md` overlay
  into a self-contained `dist/templates/<id>.md` (base layer + overlay, with
  HTML-comment machine anchors and blockquote human banners).

## The contract

- **Determinism / idempotency (DoD dimension 6).** Every emitter is a pure
  function of the input foundations; `buildPackage` overwrites `dist/`
  wholesale. Running `tokens:build` twice yields byte-identical output, and
  `tokens:check` relies on this by re-running the build before validating. The
  build has no external state, no network, no randomness.
- **Inputs it requires:** a compiled `dist/foundations.js` exporting the expected
  const (throws otherwise), and `src/design.body.md` (falls back to stripping
  frontmatter off a `src/design.md`). Branding is opt-in: `dist/branding.js` with
  `<SLUG>_BRANDING`, else omitted.
- **What downstream may assume:** the five artefacts always exist and are
  non-empty after a successful build; `tokens.json.$product === slug`;
  `tokens.css` contains at least one `--<slug>-*` var; `design.md` has YAML
  frontmatter declaring `product: "<slug>"`. `check.ts` asserts exactly these.

## Gotchas

- **Colors are the only nested group in the Tailwind preset**; every other scale
  is flat (`rounded-<slug>-xl`, `text-<slug>-5xl`). The preset carries a comment
  explaining why — don't "fix" it by nesting the others.
- A `DEFAULT` key does not produce a `-default` var — it emits the bare parent
  var. Author intentionally (see [../conventions/token-authoring.md](../conventions/token-authoring.md)).
- Templates only emit when both `<id>.md` **and** `<id>.html` exist; a
  subdirectory like `_legacy/` is ignored.
- `tokens-build` is **build-time only** — it's published but consumers never run
  it; it exists so each product package can generate its own `dist/`.

## Related

- [token-pipeline.md](./token-pipeline.md) — where this sits in the build
- [output-surfaces.md](./output-surfaces.md) — the artefacts it emits, in detail
- [type-contract.md](./type-contract.md) — the types it walks
- [../packages/tokens-build.md](../packages/tokens-build.md) — the package as a unit
