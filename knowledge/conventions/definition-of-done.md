---
type: Convention
title: Definition of Done — the governing charter
description: The quality bar every change must clear before merge, with each dimension's home doc and its real enforcement gate.
tags: [charter, definition-of-done, quality, non-negotiable, read-first]
origin: code
timestamp: 2026-08-29
---

# Definition of Done — the governing charter

This is the read-first governing doc for the repo. **A change is _done_ only when
it clears every dimension below that applies to it.** If you cannot point at the
existing pattern you followed (or the reviewed convention you added in the same
change), it is not done.

## No arbitrary construction

Every change either **follows a documented pattern** or **adds a reviewed
convention in the same change**. No new folder, abstraction, config pattern,
token group, HTTP surface, or dependency appears "because it was faster than
finding the pattern." See [no-arbitrary-construction.md](./no-arbitrary-construction.md)
for what this rules out and how to add a new pattern honestly.

## What this repo actually is

A pnpm monorepo whose product is **design tokens**. One TypeScript source of
truth per product — `packages/<slug>/src/foundations.ts` — is compiled and run
through a codegen CLI (`@zytedata/tokens-build`) into shippable artefacts
(`dist/tokens.{json,css,scss,tailwind.cjs}` + `dist/design.md`), published to
GitHub Packages, and rendered live by `apps/dashboard`. Read
[../00-start-here.md](../00-start-here.md) first if that sentence isn't yet obvious.

Two consequences shape the whole DoD:

- **`dist/` is generated and git-ignored.** You never hand-edit it. The
  committable surface is `foundations.ts`, `design.body.md`, `changelog.ts`,
  `documentation.ts`, `branding.ts`/`components.ts`/`content.ts`, and a
  `.changeset/*.md`.
- **There is no test suite.** Correctness is guarded by `tsc` (typecheck),
  the codegen validator (`tokens:check`), and a dashboard build smoke — not by
  unit tests. This is stated honestly throughout; do not assume a test gate you
  don't see.

## The dimensions, their homes, and their real gates

For each dimension: **what it means here**, its **home doc**, and its
**enforcement gate**. A gate is either a named CI step (machine-enforced) or
**review-blocking** (a human must check it — no automation exists yet). The CI
steps live in the `validate` job of
[`.github/workflows/validate.yml`](../../.github/workflows/validate.yml), mapped
step-by-step in [quality-gates.md](../environment/quality-gates.md).

| # | Dimension | What it means in THIS repo | Home doc | Enforcement gate |
|---|-----------|----------------------------|----------|------------------|
| 1 | **Performance / efficiency** | Codegen stays O(number of tokens) and side-effect-free; the dashboard build stays within Next defaults; no per-request work that isn't a bounded `fs.readFile` of a built artefact. | [../architecture/performance-and-scale.md](../architecture/performance-and-scale.md) | **Review-blocking** (no perf budget is wired) |
| 2 | **Elegance & cleanliness** | Minimal diff, matches surrounding style, no dead code, no speculative abstraction, Prettier-clean. | this doc + [no-arbitrary-construction.md](./no-arbitrary-construction.md) | **Partial:** `Lint` (dashboard only) machine-enforced; Prettier is **review-blocking** (not in CI — see gotcha below) |
| 3 | **Organization** | Change lands in the established layout: tokens in `foundations.ts`, prose in `design.body.md`, dashboard code under `apps/dashboard/src/**` in its existing folders. No new top-level dir without a convention. | [../architecture/token-pipeline.md](../architecture/token-pipeline.md) | **Review-blocking** (`Typecheck` catches misplaced/renamed exports) |
| 4 | **Security** | No secrets committed (`.env*` is git-ignored); authz stays in `apps/dashboard/src/proxy.ts` + `src/lib/auth.ts`; dependency vulns stay at/under moderate; registry/deploy tokens come from CI secrets, never code. | [../architecture/security-model.md](../architecture/security-model.md) | **Partial:** `Audit dependencies` (`pnpm audit --audit-level moderate`) machine-enforced; secrets & authz are **review-blocking** (no secret scanner) |
| 5 | **Scalability** | Adding a product is copy-a-sibling, not a rewrite; the codegen walker handles arbitrary token trees (flat and nested) without special-casing. | [../architecture/performance-and-scale.md](../architecture/performance-and-scale.md) | **Review-blocking** |
| 6 | **Idempotency / correctness-under-retry** | The build is deterministic and re-runnable — `tokens:build` always overwrites `dist/` to a pure function of the source. The only side-effecting step is publishing; changesets make it safe. | [../architecture/codegen-engine.md](../architecture/codegen-engine.md) + [../integrations/github-packages.md](../integrations/github-packages.md) | **Partial:** `tokens:check` re-runs the build and validates output; release safety is **review-blocking** |
| 7 | **Logging & observability** | Honest state: the codegen CLIs print a one-line result to stdout/stderr; the dashboard has **no logging** and degrades `fs` failures to `null`. Don't add silent failures beyond the existing convention; don't claim telemetry that isn't there. | [../architecture/observability.md](../architecture/observability.md) | **Review-blocking** |
| 8 | **Consistency & house style** | One source of truth (`foundations.ts`), one codegen (`tokens-build`), one type contract (`@zytedata/ds-types`), one UI primitive set (shadcn in `apps/dashboard/src/components/ui`). No parallel token pipelines, no second charting/component system. | [token-authoring.md](./token-authoring.md) + [../architecture/output-surfaces.md](../architecture/output-surfaces.md) | **Partial:** `Typecheck` + `tokens:check` machine-enforce shape; the rest is **review-blocking** |
| 9 | **Best-practice / modern + tests ship** | Idiomatic TS, `strict` on, ES modules, typed against the contract. **Tests ship with behavior** — _aspirational here: there is no runner, so this is unenforceable today and any behavior change is reviewed by reading + a dashboard smoke._ | this doc + [../environment/quality-gates.md](../environment/quality-gates.md) | **Partial:** `Typecheck` machine-enforced; **tests: no gate exists** (review-blocking, and see [../project/wishlist.md](../project/wishlist.md)) |

## The contract: machine-enforced vs review-blocking

Be honest about which half of the line a rule sits on.

**Machine-enforced** — fails the PR automatically, in the `validate` job:

- `Install dependencies` — `pnpm install --frozen-lockfile` (lockfile must be in sync)
- `Audit dependencies` — `pnpm audit --audit-level moderate`
- `Build all packages (tsc + tokens-build)` — `pnpm -r --filter "./packages/*" run build`
- `Typecheck` — `pnpm typecheck` (`tsc --noEmit` across every workspace)
- `Lint` — `pnpm lint` — **but only `apps/dashboard` runs a real ESLint; every `@zytedata/ds-*` and `tokens-build` `lint` script is an `echo` stub.** See [../environment/quality-gates.md](../environment/quality-gates.md).
- `Validate token artefacts (tokens-check)` — `pnpm tokens:check`
- `Dashboard build smoke` — `pnpm --filter dashboard run build`

**Review-blocking** — no automation; a human must verify before approving:

- Prettier formatting. `format:check` exists as a script and is in the README pre-PR list, **but it is not a CI step** — CI will not catch unformatted code.
- A `.changeset/*.md` accompanies any change to a published `@zytedata/ds-*`. **Not gated** — the changeset flow only runs in `release.yml`.
- No secrets in the diff (no secret scanner runs).
- Package-level lint quality (packages have no real linter).
- Tests for changed behavior (no runner exists).
- Prose (`design.body.md`) and dashboard match the token change.
- The Figma plugin snapshot, when a color changed and sync was requested.

## "Ships together"

- **Behavior ships with its tests** — aspirationally. With no runner, a behavior
  change instead ships with a verifiable manual check (a dashboard route to look
  at, a `grep` of the emitted `dist/` artefact) named in the PR.
- **A new _pattern_ ships with its convention doc.** If you introduce a token
  group, a new dashboard data-resolver shape, or any reusable structure, add or
  update the relevant `knowledge/` doc in the same PR. See
  [no-arbitrary-construction.md](./no-arbitrary-construction.md).
- **A published change ships with a changeset** (`.changeset/*.md`) **and** a
  `changelog.ts` entry — the dual-record rule in
  [changelog-and-changeset.md](./changelog-and-changeset.md).
- **A milestone updates the KB log** — add an entry to [../log.md](../log.md)
  and convert that milestone's stubs.

## The paste-in checklist

The same list, PR-ready, lives at [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)
(explained in [quality-gates.md](../environment/quality-gates.md#pull-request-template)) — copy it or let GitHub prefill it.

## Related

- [no-arbitrary-construction.md](./no-arbitrary-construction.md) — the anti-drift rule in detail
- [../environment/quality-gates.md](../environment/quality-gates.md) — exactly what fails a PR and why
- [token-authoring.md](./token-authoring.md) — how to write `foundations.ts` correctly
- [../00-start-here.md](../00-start-here.md) — the whole system on one page
- [../project/non-negotiables.md](../project/non-negotiables.md) — risks hub, each linked to the doc that enforces it
