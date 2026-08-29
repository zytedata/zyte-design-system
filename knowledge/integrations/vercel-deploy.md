---
type: Integration
title: Vercel deploy (dashboard)
description: How the dashboard deploys to Vercel via the CLI + VERCEL_TOKEN in the validate workflow — and the stale doc that describes an older mechanism.
tags: [integration, vercel, deploy, ci]
origin: code
timestamp: 2026-08-29
---

# Vercel deploy (dashboard)

## What it is

The `apps/dashboard` app deploys to Vercel on merge to `main`. Deployment is
**not** Git-triggered by Vercel; it runs as a `deploy` job inside
`.github/workflows/validate.yml`, gated behind the `validate` job, authenticating
via a token-based Vercel CLI flow (the same pattern as `zyte-customer-portal`).

## The pieces

- **`vercel.json`** (repo root) — `git.deploymentEnabled: false`, so Vercel never
  auto-deploys on push.
- **`validate.yml` → `deploy` job** — `needs: validate`, runs only on
  `push` to `refs/heads/main` in `zytedata/zyte-design-system`. It sets
  `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (both inline in the workflow) and
  `VERCEL_TOKEN` (a repo secret), then runs:
  ```bash
  pnpm dlx vercel@latest pull --yes --environment=production --token="$VERCEL_TOKEN"
  pnpm dlx vercel@latest build --prod --token="$VERCEL_TOKEN"
  pnpm dlx vercel@latest deploy --prebuilt --prod --token="$VERCEL_TOKEN"
  ```
- Because it authenticates with a team-owned `VERCEL_TOKEN`, the deploy runs
  regardless of who merged — no Vercel account is needed to merge a PR.

## The contract

- Production deploy = merge to `main` **and** `validate` green. The deploy job
  reuses the monorepo build (the Vercel project root is `apps/dashboard`, whose
  build steps build the `@zytedata/ds-*` packages first, then the dashboard).
- `VERCEL_TOKEN` is the only secret to keep valid; org/project IDs are in the
  workflow file.

## Gotchas

- **Deploy mechanism history:** an older `deploy-vercel.yml` +
  `VERCEL_DEPLOY_HOOK_URL` approach was replaced by the embedded `deploy` job
  above (commits `1f57680`, `c8fa0fc`). [`.github/RELEASING.md`](../../.github/RELEASING.md)
  described the old mechanism; it was corrected in this build to match
  `validate.yml`, which remains the source of truth for how deploys run.
- A new product must be reachable by the Vercel lambda — add it to
  `next.config.ts` tracing (see [../conventions/adding-a-product.md](../conventions/adding-a-product.md)),
  or its `dist/` won't be bundled in the deploy.

## Related

- [../architecture/dashboard-runtime.md](../architecture/dashboard-runtime.md) — what gets deployed
- [../environment/release-and-publish.md](../environment/release-and-publish.md) — release vs deploy
- [github-packages.md](./github-packages.md) — the other CI-token boundary
