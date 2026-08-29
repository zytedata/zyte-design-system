---
type: Project
title: Non-negotiables & risks
description: The hub of rules that must never be violated — each linked to the doc that defines and (where possible) enforces it.
tags: [project, non-negotiable, risks, hub]
origin: code
timestamp: 2026-08-29
---

# Non-negotiables & risks

## What it is

The short list of rules whose violation breaks the system's guarantees, each
pointing at the doc that owns it and its real enforcement level. If you're about
to do something that touches one of these, read the linked doc first.

## The non-negotiables

1. **One source of truth per product.** Tokens live only in
   `foundations.ts`; `dist/` is generated and never hand-edited.
   → [../architecture/token-pipeline.md](../architecture/token-pipeline.md) ·
   enforced by: regeneration (edits vanish) + `tokens:check`.
2. **No arbitrary construction.** Follow a documented pattern or add a reviewed
   convention in the same change.
   → [../conventions/no-arbitrary-construction.md](../conventions/no-arbitrary-construction.md) ·
   enforced by: review (partial `Typecheck`).
3. **No secrets in code.** `.env*` is git-ignored; tokens come from CI secrets.
   → [../architecture/security-model.md](../architecture/security-model.md) ·
   enforced by: `.gitignore` + review (**no secret scanner**).
4. **The dashboard stays gated.** Only `@zyte.com` Google accounts; two
   independent checks (proxy + layout).
   → [../architecture/auth-model.md](../architecture/auth-model.md) ·
   enforced by: code (review-blocking).
5. **Published changes are dual-recorded.** A `changelog.ts` entry **and** a
   changeset, every time.
   → [../conventions/changelog-and-changeset.md](../conventions/changelog-and-changeset.md) ·
   enforced by: **review only** (not gated).
6. **The build is deterministic.** Codegen is a pure function of source; re-runs
   are byte-identical.
   → [../architecture/codegen-engine.md](../architecture/codegen-engine.md) ·
   enforced by: `tokens:check` (re-runs the build).
7. **Publishing is restricted.** `@zytedata/*` publishes to GitHub Packages with
   `access: restricted`; provenance stays off.
   → [../integrations/github-packages.md](../integrations/github-packages.md) ·
   enforced by: `publishConfig` + `release.yml`.

## Standing risks (watch these)

- **Gaps that CI won't catch** (tests, formatting, changeset presence, secrets) —
  the whole review-blocking half of [../environment/quality-gates.md](../environment/quality-gates.md).
- **Snapshot drift** between `foundations.ts` and the Figma plugin's embedded
  values — [../integrations/figma-plugin.md](../integrations/figma-plugin.md).
- **Doc drift** — the three doc drifts found during discovery were all fixed in
  the KB build (see [wishlist.md](./wishlist.md) `## Done`); a doc naming a path
  that no longer exists is a bug to fix or delete ([../log.md](../log.md)).

## Related

- [../conventions/definition-of-done.md](../conventions/definition-of-done.md) — the charter
- [wishlist.md](./wishlist.md) — where risks get filed as work
- [../log.md](../log.md) — maintenance rules
