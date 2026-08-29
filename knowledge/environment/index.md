---
type: Index
title: Environment
description: Zero-to-running dev setup, the CI quality gates that fail a PR, and the release/deploy pipelines.
tags: [index, environment]
origin: code
timestamp: 2026-08-29
---

# Environment

Getting the repo running, and what happens to your change in CI.

- [local-development.md](./local-development.md) — bootstrap, daily commands, env
  files, the fast token loop.
- [quality-gates.md](./quality-gates.md) — the exact `validate` CI steps that gate
  a merge, and the honest list of what is **not** gated.
- [release-and-publish.md](./release-and-publish.md) — the Changesets publish flow
  (`release.yml`) and the Vercel deploy (`validate.yml`).
