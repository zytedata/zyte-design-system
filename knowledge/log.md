---
type: Index
title: Log — provenance & maintenance
description: When and how this knowledge base was built, what it was verified against, and the rules that keep it honest.
tags: [index, log, provenance, maintenance]
origin: code
timestamp: 2026-08-29
---

# Log — provenance & maintenance

## Provenance

**2026-08-29 — initial build.** Created by an AI coding agent (Claude Code) as a
ground-truth OKF knowledge base + contribution guardrails. Built from a real
discovery pass over the repo, not from assumptions.

Verified against (read directly or via read-only sub-investigations):

- Root config: `package.json`, `pnpm-workspace.yaml`, `.npmrc`,
  `.prettierrc.json`, `.gitignore`, `.changeset/config.json`, `vercel.json`,
  `.editorconfig`, `.worktreeinclude`, `scripts/*.sh`.
- CI: `.github/workflows/validate.yml`, `.github/workflows/release.yml`,
  `.github/RELEASING.md`.
- Codegen: `packages/tokens-build/src/index.ts` + `src/bin/{build,check}.ts`.
- Contract: `packages/types/src/index.ts`.
- Products: each `packages/<slug>/package.json` + `src/foundations.ts` +
  `src/index.ts` (+ Web's `branding/content/components/changelog/documentation/
  templates/assets`; Extract Summit's nested foundations).
- Dashboard: `apps/dashboard/package.json`, `next.config.ts`, `proxy.ts`,
  `src/lib/auth.ts`, `src/data/foundations/{index,docs}.ts`, `eslint.config.mjs`,
  route tree, component folders.
- Figma: `figma-plugin/{manifest.json,code.js,scripts/gen-foundations.js}`.
- Signals: `git log` (themes, authors, churn hotspots), repo-wide searches for
  tests, lint scripts, and secret-scanning config.

**Verification (2026-08-29):** every relative cross-link was checked (288 links,
0 broken, 0 missing anchors); the full CI-equivalent pipeline was run green —
`pnpm -r --filter "./packages/*" run build`, `pnpm typecheck`, `pnpm tokens:check`
(all four products `ok`), and `pnpm lint` (0 errors); and an independent
fresh-eyes agent cross-checked every claim against source — its findings (a
`.env.example` staleness cluster after the fix, a `git-status.ts` vs product-layout
misattribution, a `content.ts` over-claim, an imprecise error string, and several
misleading link display-texts) were all reconciled.

**Origin honesty:** docs tagged `origin: code` were checked against the source
files named in their body. `adding-a-product.md` is tagged
`origin: .github/RELEASING.md` because it adapts that doc.

## Stub status

**No stubs in this build.** Everything documented is built and verified. The one
forward-looking item encountered — the "Phase 2 (MCP)" fetch mentioned in
`figma-plugin/code.js` — is described only as a source comment in
[project/scope-and-roadmap.md](./project/scope-and-roadmap.md), never as an
existing capability, and names no fictional path. If a future milestone adds
forward-looking design docs, they must carry `stub` in `tags` and a
`> **Forward-looking.**` banner, and must not name a non-existent path as if it
exists.

## Doc-vs-reality drifts found and fixed (in other repo docs)

These were found during discovery and **all corrected in this build** (see the
`## Done` note in [project/wishlist.md](./project/wishlist.md)); this KB documents
the real behavior:

1. `.github/RELEASING.md` described a `deploy-vercel.yml` + `VERCEL_DEPLOY_HOOK_URL`
   deploy that no longer exists — **fixed**: replaced with the real `deploy` job
   in `validate.yml` (`VERCEL_TOKEN` + `vercel` CLI).
2. `.claude/skills/change-foundation/SKILL.md` called `figma-plugin/`
   "gitignored / local-only" — **fixed**: corrected to "git-tracked and
   hand-maintained."
3. `apps/dashboard/.env.example` omitted the required auth env vars — **fixed**
   (the three names added); see the `## Done` note in
   [project/wishlist.md](./project/wishlist.md).

## Maintenance rules

- **Each milestone adds an entry here** (date, what changed, what was verified).
- **Convert that milestone's stubs** to built docs when the code lands; drop the
  `stub` tag and banner.
- **Re-verify `origin: code` docs** whose subject you touched. A doc that names a
  file, export, script, or CI step that no longer exists is a **bug** — fix it or
  delete the doc in the same change.
- **Keep index counts honest.** If you add/remove a leaf, update the owning
  `index.md` and the domain table in [index.md](./index.md).
- **When a wishlist item is done**, move it to a `## Done` note there and update
  the doc that owned the gap.

## Related

- [index.md](./index.md) — the entry point + domain map
- [project/wishlist.md](./project/wishlist.md) — the debt queue
- [conventions/definition-of-done.md](./conventions/definition-of-done.md) — the charter
