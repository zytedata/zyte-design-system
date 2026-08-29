---
type: Index
title: Conventions
description: The mandatory rules — the Definition-of-Done charter, the anti-drift rule, token-authoring, and the recurring recipes.
tags: [index, conventions]
origin: code
timestamp: 2026-08-29
---

# Conventions

The rules every contributor (human or agent) follows. Start with the charter —
it governs everything else and names each quality dimension's real enforcement
gate.

- [definition-of-done.md](./definition-of-done.md) — **read first.** The governing
  charter: the quality bar, each dimension's home doc + real gate, and the
  machine-vs-review-blocking contract.
- [no-arbitrary-construction.md](./no-arbitrary-construction.md) — the core
  anti-drift rule: follow a documented pattern or add a reviewed convention in
  the same change.
- [token-authoring.md](./token-authoring.md) — how to write `foundations.ts` so
  the codegen emits correct, house-style artefacts (shape rules, `DEFAULT`,
  `semanticColors`, px-categories).
- [adding-a-token.md](./adding-a-token.md) — recipe: the end-to-end token-change
  loop (edit → build → verify → dual-record → PR).
- [adding-a-product.md](./adding-a-product.md) — recipe: adding a fifth
  `@zytedata/ds-*` product and wiring the dashboard.
- [changelog-and-changeset.md](./changelog-and-changeset.md) — the dual-record
  rule: every published change gets a `changelog.ts` entry **and** a changeset.
