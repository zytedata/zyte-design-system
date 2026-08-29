---
type: Convention
title: "Recipe: adding or changing a token"
description: The end-to-end sequence for a token change — edit, build, verify, dual-record, review — with the exact commands.
tags: [recipe, tokens, workflow, definition-of-done]
origin: code
timestamp: 2026-08-29
---

# Recipe: adding or changing a token

## What it is

The recurring unit of work in this repo is a **token change**. This recipe
sequences the existing docs and the real commands end-to-end. It mirrors the
[`change-foundation` skill](../../.claude/skills/change-foundation/SKILL.md),
which automates exactly these steps.

## The pieces (do them in order, from repo root)

1. **Edit the source.** `packages/<slug>/src/foundations.ts` — only the requested
   tokens, keeping the `ProductFoundations` shape. Rules:
   [token-authoring.md](./token-authoring.md).

2. **Update prose if semantics changed.** Edit
   `packages/<slug>/src/design.body.md` (never `dist/design.md`). Skip for a pure
   value tweak.

3. **Build to `dist/`.**
   ```bash
   pnpm --filter "@zytedata/ds-<slug>" run build   # build:js (tsc) then build:tokens
   ```
   Order matters — `build:tokens` imports the compiled `dist/foundations.js`; see
   [../architecture/token-pipeline.md](../architecture/token-pipeline.md).

4. **Verify.**
   ```bash
   pnpm --filter "@zytedata/ds-<slug>" run check:tokens
   pnpm --filter "@zytedata/ds-<slug>" run typecheck
   grep -n "<changed-var-or-value>" packages/<slug>/dist/tokens.css   # confirm it emitted
   ```
   Optionally look at it live: `pnpm dev` →
   `http://localhost:3000/products/<slug>/foundations`.

5. **Dual-record the change** (both mechanisms — see
   [changelog-and-changeset.md](./changelog-and-changeset.md)):
   - Append a newest-first entry to `packages/<slug>/src/changelog.ts`.
   - Write `.changeset/<short-kebab-summary>.md` naming the package + bump level.

6. **Optional: sync the Figma plugin** (ask first). See
   [../integrations/figma-plugin.md](../integrations/figma-plugin.md).

7. **Open the PR.** Fill the [DoD checklist](./definition-of-done.md). The
   committable files are `foundations.ts`, `design.body.md`, `changelog.ts`, and
   the `.changeset/*.md` — `dist/` is git-ignored.

## The contract

- Done = `check:tokens` + `typecheck` green **and** the change is dual-recorded
  **and** the PR cites the pattern it followed.
- CI re-runs steps 3–4 for every package (`Build all packages`, `tokens:check`,
  `Typecheck`) so drift is caught, but the changeset and prose are
  **review-blocking** — CI does not verify them.

## Gotchas

- Forgetting the changeset means the package never version-bumps on release —
  and nothing in CI will tell you. Treat step 5 as mandatory.
- If `build:tokens` errors with `run "pnpm run build:js" before ...`, you skipped
  the `tsc` step; run the full `build`, not just `build:tokens`.
- A change spanning multiple products = repeat per package, and list each package
  in the changeset.

## Related

- [token-authoring.md](./token-authoring.md) — the shape rules
- [changelog-and-changeset.md](./changelog-and-changeset.md) — the dual-record rule
- [../environment/local-development.md](../environment/local-development.md) — dev loop + commands
- [definition-of-done.md](./definition-of-done.md) — the merge bar
