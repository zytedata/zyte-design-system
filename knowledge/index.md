---
type: Index
title: Zyte Design System — knowledge base
description: The OKF knowledge base entry point — how to read it, what to read first, and the map of domains.
tags: [index, entry-point, okf]
origin: code
timestamp: 2026-08-29
---

# Zyte Design System — knowledge base

## What this is

A durable engineering knowledge base for this repo, in **OKF (Open Knowledge
Format)**: a plain directory of markdown files, one concept per file, where the
path is the identity, every file has YAML frontmatter (a required `type`, plus
`title`/`description`/`tags`/`origin`/`timestamp`), and files cross-link with
ordinary relative markdown links to form a walkable graph. No database, no SDK —
markdown + frontmatter + links.

`origin: code` means the doc was verified against source; other values name the
artefact it was checked against.

## Read these first (in order)

1. [00-start-here.md](./00-start-here.md) — the whole system on one page.
2. [conventions/definition-of-done.md](./conventions/definition-of-done.md) — the
   governing charter; the quality bar and each dimension's real gate.
3. [conventions/no-arbitrary-construction.md](./conventions/no-arbitrary-construction.md) —
   the core anti-drift rule.
4. [architecture/token-pipeline.md](./architecture/token-pipeline.md) — how a token
   becomes shippable artefacts.
5. [conventions/adding-a-token.md](./conventions/adding-a-token.md) — the recurring
   unit of work, end to end.
6. [environment/quality-gates.md](./environment/quality-gates.md) — exactly what
   fails a PR (and what CI does **not** catch).
7. [architecture/dashboard-runtime.md](./architecture/dashboard-runtime.md) — how
   the dashboard consumes the packages.
8. [project/non-negotiables.md](./project/non-negotiables.md) — the rules and risks
   hub.

## The domains

| Domain | Leaves | What's in it |
|---|---|---|
| [conventions/](./conventions/index.md) | 6 | The mandatory rules: the DoD charter, anti-drift, token authoring, and the recurring recipes. |
| [architecture/](./architecture/index.md) | 9 | Cross-cutting systems: pipeline, codegen, contract, output surfaces, dashboard runtime, auth, security, performance, observability. |
| [packages/](./packages/index.md) | 6 | The publishable units: four products + `ds-types` + `tokens-build`. |
| [integrations/](./integrations/index.md) | 4 | External boundaries: GitHub Packages, Vercel, the Figma plugin, LLM providers. |
| [environment/](./environment/index.md) | 3 | Dev setup, the CI quality gates, release & deploy. |
| [project/](./project/index.md) | 3 | Scope & roadmap, non-negotiables, the wishlist/debt queue. |

## Also in this bundle (canonical repo docs — linked, not duplicated)

- [`README.md`](../README.md) — the producer/consumer narrative + full command
  reference.
- [`.github/RELEASING.md`](../.github/RELEASING.md) — release & deploy pipeline
  (deploy section corrected in the KB build to match `validate.yml`; deep dive in
  [integrations/vercel-deploy.md](./integrations/vercel-deploy.md)).
- [`AGENTS.md`](../AGENTS.md) — the Next.js-version warning for agents.
- [`DESIGN_TOKEN_DELTA.md`](../DESIGN_TOKEN_DELTA.md) — a token-delta reference.
- [`.claude/skills/change-foundation/SKILL.md`](../.claude/skills/change-foundation/SKILL.md)
  — the automated token-change loop.
- Per-product live docs: `/products/<slug>/{foundations,documentation,changelog}`
  in the running dashboard.

## Maintaining this KB

See [log.md](./log.md) for provenance and the maintenance rules (each milestone
adds a log entry, converts its stubs, and re-verifies `origin: code` docs).
