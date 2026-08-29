---
type: Architecture
title: The security model
description: The repo's real security posture — secrets handling, dependency auditing, registry/deploy tokens — stated with what is and is NOT enforced.
tags: [architecture, security, secrets, audit, non-negotiable]
origin: code
timestamp: 2026-08-29
---

# The security model

## What it is

An honest map of how this repo handles secrets, dependency risk, and privileged
tokens — and, just as important, **what it does not do**. Under-claiming is the
rule here: assume no protection exists unless this doc names the mechanism.

## The pieces

- **Secrets never in code.** `.gitignore` ignores `.env*` (with
  `!.env.example`). Runtime secrets live in `apps/dashboard/.env.local` locally
  (`AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, and the Studio LLM keys) and in
  Vercel/CI for production.
- **Authorization is centralized** in `apps/dashboard/src/proxy.ts` +
  `src/lib/auth.ts` — see [auth-model.md](./auth-model.md). Third-party token
  verification is pinned to explicit algorithms (`HS256` for the session,
  `RS256` for Google), with issuer/audience/nonce checks.
- **Dependency auditing (the one automated security gate):**
  `pnpm audit --audit-level moderate` runs in the `validate` CI job. Known,
  triaged advisories are pinned/ignored in the root `package.json`:
  `pnpm.overrides` force-upgrade transitive deps (`postcss`, `hono`, `js-yaml`,
  `qs`, `brace-expansion`, …) and `pnpm.auditConfig.ignoreCves` /
  `ignoreGhsas` waive specific IDs. Changing those is a security decision — note
  it in the PR.
- **Registry / deploy tokens** come from CI secrets, never the repo:
  `NODE_AUTH_TOKEN` / `NPM_TOKEN` (from `GITHUB_TOKEN`) for GitHub Packages,
  `VERCEL_TOKEN` for deploys. See
  [../integrations/github-packages.md](../integrations/github-packages.md) and
  [../integrations/vercel-deploy.md](../integrations/vercel-deploy.md).
- **Auth-gated production.** The deployed dashboard is behind the `@zyte.com`
  Google gate, so the DesignOps surface isn't public.

## The contract

Machine-enforced:

- `pnpm audit --audit-level moderate` fails the PR on a new moderate+ advisory.
- `pnpm install --frozen-lockfile` prevents silent dependency drift.

Review-blocking (no automation exists — a human is the gate):

- **No secret scanning.** There is no gitleaks/trufflehog/CodeQL and no
  `.github/dependabot.yml` in this repo. A committed secret will not be caught by
  a tool — reviewers must watch for it.
- Authz correctness, the `auditConfig` waivers, and any new external call.

## Gotchas

- The README documents a Dependabot config **for consumer repos** (how a
  downstream app auto-bumps `@zytedata/*`). That is not this repo's Dependabot —
  **this repo has none.** Don't read the README section as describing local
  automation.
- `pnpm audit` waivers live in root `package.json`, not a separate file; they're
  easy to miss in review.
- `.env.local` is app-scoped (`apps/dashboard/`), not repo-root — a secret put at
  the repo root won't be read by Next and may not be git-ignored the same way
  (root `.env*` is still ignored, but the app won't load it).

## Related

- [auth-model.md](./auth-model.md) — the dashboard gate in detail
- [../environment/quality-gates.md](../environment/quality-gates.md) — the full CI gate list
- [../project/non-negotiables.md](../project/non-negotiables.md) — security as a non-negotiable
- [../project/wishlist.md](../project/wishlist.md) — secret-scanning / Dependabot as filed follow-ups
