---
type: Environment
title: Quality gates — what fails a PR and why
description: The exact CI steps that gate a merge, what each verifies, and the honest list of what is NOT gated.
tags: [environment, ci, gates, definition-of-done]
origin: code
timestamp: 2026-08-29
---

# Quality gates — what fails a PR and why

## What it is

The precise, honest map of the machine gates. CI is
[`.github/workflows/validate.yml`](../../.github/workflows/validate.yml), which runs on every
`pull_request` to `main` and every `push` to `main`. The `validate` job is what
must be green to merge.

## The pieces — the `validate` job, step by step

| Step (name in CI) | Command | What it actually verifies |
|---|---|---|
| Install dependencies | `pnpm install --frozen-lockfile` | Lockfile is in sync; no undeclared dep drift. `NODE_AUTH_TOKEN` from `GITHUB_TOKEN`. |
| Audit dependencies | `pnpm audit --audit-level moderate` | No new moderate+ advisory (minus the waivers in root `package.json` `auditConfig`). |
| Build all packages | `pnpm -r --filter "./packages/*" run build` | Every package's `tsc` + `tokens-build` succeeds → `dist/` artefacts exist. |
| Typecheck | `pnpm typecheck` | `tsc --noEmit` across **every** workspace (packages + dashboard). |
| Lint | `pnpm lint` | ESLint — **real only for `apps/dashboard`**; every `@zytedata/ds-*` + `tokens-build` `lint` is an `echo` stub. |
| Validate token artefacts | `pnpm tokens:check` | Re-builds + validates each product's artefacts (files exist, non-empty, `$product`/`--<slug>-`/frontmatter markers). |
| Dashboard build smoke | `pnpm --filter dashboard run build` | `next build` succeeds against the freshly-built `dist/`. |

On `push` to `main`, a separate `deploy` job (`needs: validate`) then deploys to
Vercel ([../integrations/vercel-deploy.md](../integrations/vercel-deploy.md)).

## The contract — what is NOT gated (review-blocking)

Be honest with yourself and reviewers: CI does **not** check these.

- **Prettier formatting.** `format:check` exists and is in the README pre-PR list
  but is **not** a CI step. Run it locally.
- **Package-level lint.** Only the dashboard has a real ESLint config
  (`apps/dashboard/eslint.config.mjs`, flat config: `next/core-web-vitals` +
  `next/typescript` + `eslint-config-prettier`). Packages have none.
- **Tests.** There is **no test runner and no test files** anywhere in the repo;
  no `test` script exists. Behavior correctness rides on `Typecheck` +
  `tokens:check` + the dashboard build smoke + manual verification.
- **Changeset presence.** Nothing checks that a published change carries a
  `.changeset/*.md`; the changeset flow only runs in `release.yml`.
- **Secrets.** No secret scanner (no gitleaks/trufflehog/CodeQL, no Dependabot).

## Pull-request template

The DoD checklist is shipped as [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)
so GitHub prefills it on every PR. It restates the machine gates (as a local
pre-check) and, crucially, the **review-blocking** items above that CI can't
catch. Fill it honestly — an unchecked review-blocking box is the signal a
reviewer needs.

## Gotchas

- A green CI run does **not** mean formatted, tested, changeset-carrying, or
  secret-free — only that the seven steps above passed. The template exists
  precisely to cover that gap.
- `pnpm lint` passing is mostly the dashboard passing; don't read it as "all
  packages lint clean."

## Related

- [../conventions/definition-of-done.md](../conventions/definition-of-done.md) — the charter these gates serve
- [release-and-publish.md](./release-and-publish.md) — the release/deploy workflows
- [../project/wishlist.md](../project/wishlist.md) — the missing gates, filed as follow-ups
