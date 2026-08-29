---
type: Index
title: Architecture
description: The cross-cutting systems every change touches — the token pipeline, the codegen, the type contract, the output surfaces, and the dashboard runtime.
tags: [index, architecture]
origin: code
timestamp: 2026-08-29
---

# Architecture

The cross-cutting systems. A token change touches the first four; a dashboard
change touches the last three.

- [token-pipeline.md](./token-pipeline.md) — the build flow `foundations.ts` →
  `tsc` → `tokens-build` → `dist/`, and its mandatory ordering.
- [codegen-engine.md](./codegen-engine.md) — how `@zytedata/tokens-build` walks
  arbitrary token trees and emits every artefact; its determinism guarantee.
- [type-contract.md](./type-contract.md) — `@zytedata/ds-types`, the shared shapes
  that keep four products interchangeable to the tooling.
- [output-surfaces.md](./output-surfaces.md) — the five `dist/` artefacts +
  `design.md` + templates, and how they're validated.
- [dashboard-runtime.md](./dashboard-runtime.md) — how `apps/dashboard` resolves
  and renders each product's `dist/` at request time.
- [auth-model.md](./auth-model.md) — the Google-OAuth + signed-JWT gate fronting
  the dashboard.
- [security-model.md](./security-model.md) — secrets, dependency auditing, tokens;
  what is and isn't enforced.
- [performance-and-scale.md](./performance-and-scale.md) — the bounded codegen and
  fs-per-request model; product growth by copy-a-sibling.
- [observability.md](./observability.md) — the honest state of logging and errors
  (CLI stdout; silent `fs` degradation; no telemetry).
