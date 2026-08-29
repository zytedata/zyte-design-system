---
type: Package
title: "@zytedata/tokens-build"
description: The build-time codegen CLI that turns each product's foundations.ts into shippable token artefacts and validates them.
tags: [package, codegen, cli, build]
origin: code
timestamp: 2026-08-29
---

# @zytedata/tokens-build

## What it is

The "schema-tolerant codegen that turns `@zytedata/ds-*` foundations.ts into
shippable token artefacts." Version `0.1.1`. Build-time only: it's published, but
consumers never execute it — each product package runs it to generate its own
`dist/`.

## The pieces

- `packages/tokens-build/src/index.ts` — the whole engine (walker, emitters,
  design.md/template composers, `buildPackage`, `checkPackage`). Deep dive:
  [../architecture/codegen-engine.md](../architecture/codegen-engine.md).
- `src/bin/build.ts` → compiled to `dist/bin/build.js` — the `build:tokens`
  entrypoint; calls `buildPackage(process.cwd())`, prints artefact count + ms.
- `src/bin/check.ts` → `dist/bin/check.js` — the `check:tokens` entrypoint; runs
  `buildPackage` then `checkPackage`, exits non-zero with a `✗` list on failure.
- `package.json` — `build` = `tsc -p tsconfig.build.json && chmod +x
  dist/bin/build.js dist/bin/check.js` (the bins must be executable). Depends on
  `@zytedata/ds-types` (types) + `@types/node`.

## The contract

- Each product invokes the compiled bins by **relative path**:
  `node ../tokens-build/dist/bin/build.js`. So `tokens-build` must be built before
  any product's `build:tokens` runs — `pnpm -r … build` orders it; a bare run
  before it's built fails with a Node `Cannot find module …/dist/bin/build.js`
  error.
- `buildPackage` is deterministic and overwrites `dist/` wholesale;
  `checkPackage` re-runs the build then asserts the five artefacts + their
  markers (`$product`, `--<slug>-`, design.md frontmatter). This pair is the
  repo's real correctness gate for tokens.
- `lint` is an `echo` stub; `typecheck` = `tsc --noEmit`.

## Gotchas

- The `chmod +x` in `build` matters — without the executable bit the bins fail to
  run; don't drop it when editing the build script.
- It imports the product's **compiled** `dist/foundations.js`, never the `.ts`
  source (Node can't import TS directly). This is why the two-step build order is
  non-negotiable — see [../architecture/token-pipeline.md](../architecture/token-pipeline.md).

## Related

- [../architecture/codegen-engine.md](../architecture/codegen-engine.md) — the internals
- [../architecture/token-pipeline.md](../architecture/token-pipeline.md) — where it runs in the build
- [../architecture/output-surfaces.md](../architecture/output-surfaces.md) — what it emits
