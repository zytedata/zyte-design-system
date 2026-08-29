<!--
  This checklist is the Definition of Done for zyte-design-system.
  Charter: knowledge/conventions/definition-of-done.md
  Gate reference: knowledge/environment/quality-gates.md
  Delete rows that genuinely don't apply; don't delete a row to avoid it.
-->

## What & why

<!-- One or two sentences. Link the issue/context. -->

## Change type

- [ ] Token change (`foundations.ts`) — product(s): <!-- web / core / scrapy / extract-summit -->
- [ ] Prose / spec (`design.body.md`, `documentation.ts`, `branding.ts`)
- [ ] Codegen (`@zytedata/tokens-build`) or contract (`@zytedata/ds-types`)
- [ ] Dashboard (`apps/dashboard`)
- [ ] Tooling / CI / docs / other

## No arbitrary construction

- [ ] This change follows a documented pattern **or** adds/updates the convention
      doc for a new one in this same PR.
- [ ] Pattern I followed (name the doc/file): <!-- e.g. knowledge/conventions/adding-a-token.md -->

## Machine gates (mirror CI locally before pushing)

- [ ] `pnpm typecheck`
- [ ] `pnpm tokens:check` (if any `foundations.ts`/codegen changed)
- [ ] `pnpm lint` (real coverage: `apps/dashboard` only)
- [ ] `pnpm --filter dashboard run build` (if the dashboard changed)
- [ ] `pnpm audit --audit-level moderate` clean (or waiver noted below)

## Review-blocking — CI will NOT catch these; confirm by hand

- [ ] `pnpm format:check` passes (Prettier is **not** in CI)
- [ ] Published `@zytedata/ds-*` change carries a `.changeset/*.md` **and** a
      `changelog.ts` entry (the dual-record rule)
- [ ] No secrets in the diff (no secret scanner runs)
- [ ] Prose / dashboard match the token change
- [ ] Tests: <!-- none exist yet — name the manual check you did instead, e.g.
      a route you looked at or a `grep` of the emitted dist/ artefact -->
- [ ] Figma plugin synced (only if a color changed and sync was requested)

## Verification evidence

<!-- The manual check that stands in for tests: a route you viewed, a grep of
     the emitted --<slug>-* var, a screenshot, etc. -->

## Notes / waivers

<!-- Any `auditConfig` change, deferred work filed in
     knowledge/project/wishlist.md, or context a reviewer needs. -->
