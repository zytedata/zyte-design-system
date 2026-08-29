---
type: Environment
title: Release & publish
description: How a token change becomes a published package version and a deployed dashboard — the two workflows and the changesets flow.
tags: [environment, release, publish, changesets, ci]
origin: code
timestamp: 2026-08-29
---

# Release & publish

## What it is

Two separate pipelines: **publish** (npm versions to GitHub Packages, via
Changesets in `release.yml`) and **deploy** (the dashboard to Vercel, via the
`deploy` job in `validate.yml`). The canonical prose is
[`.github/RELEASING.md`](../../.github/RELEASING.md) — read the gotcha below before
trusting its deploy section.

## The pieces

- **`.github/workflows/release.yml`** — `workflow_dispatch` (manual). Permissions:
  `contents/pull-requests/packages: write`. Runs `changesets/action@v1` with
  `version: pnpm run version` and `publish: pnpm run release`. Two uses:
  1. **Open/update the release PR** — accumulates queued `.changeset/*.md` into a
     `chore(release): version packages` PR with version bumps + per-package
     `CHANGELOG.md`.
  2. **Publish** (run again after the release PR merges) — bumps and
     `changeset publish` to GitHub Packages.
- **`.changeset/config.json`** — `access: restricted`, `baseBranch: main`,
  `ignore: ["dashboard"]`, `updateInternalDependencies: patch`, GitHub changelog
  generator (`@changesets/changelog-github`, repo `zytedata/zyte-design-system`),
  `privatePackages.version: false`.
- **`pnpm run release`** = `pnpm -r --filter "./packages/*" build && changeset
  publish`. **`pnpm run version`** = `changeset version`.
- **Deploy** — the `deploy` job in `validate.yml` (push to `main`, after
  `validate`); details in
  [../integrations/vercel-deploy.md](../integrations/vercel-deploy.md).
- **Required secrets** (from RELEASING.md): `GITHUB_TOKEN` (auto),
  `PERSONAL_GITHUB_TOKEN` (optional, to trigger downstream workflows), and
  `VERCEL_TOKEN` for the deploy.

## The contract

- A package publishes only if a merged changeset bumped it; `dashboard` is
  ignored and never publishes.
- The whole author→consumer flow: edit `foundations.ts` → PR (`validate` green) →
  merge with a changeset → run `release` to open the version PR → merge it → run
  `release` again to publish. Consumers then bump the `@zytedata/*` dep.
- Local publish is an escape hatch only (RELEASING.md documents it) — prefer the
  Actions flow.

## Gotchas

- **RELEASING.md's deploy section** previously described a `deploy-vercel.yml`
  workflow + `VERCEL_DEPLOY_HOOK_URL`; it was corrected in this build to match the
  real mechanism (the embedded `deploy` job in `validate.yml` with `VERCEL_TOKEN`).
  The publish/release sections were already accurate. See
  [../integrations/vercel-deploy.md](../integrations/vercel-deploy.md).
- `release.yml` is **manual** (`workflow_dispatch`) — merging changesets does not
  auto-open the release PR; someone runs the workflow.
- `NPM_CONFIG_PROVENANCE` must stay `"false"` for the publish (restricted GH
  Packages fail provenance with `EUSAGE`).

## Related

- [../conventions/changelog-and-changeset.md](../conventions/changelog-and-changeset.md) — the dual-record rule
- [../integrations/github-packages.md](../integrations/github-packages.md) — the publish target
- [../integrations/vercel-deploy.md](../integrations/vercel-deploy.md) — the deploy pipeline
- [quality-gates.md](./quality-gates.md) — the validate gates that precede release
