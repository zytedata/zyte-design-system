---
type: Convention
title: The dual-record rule — changelog.ts AND a changeset
description: Every published token change records twice — a dashboard changelog.ts entry and a Changesets .md — and why both exist.
tags: [convention, changelog, changesets, versioning, release]
origin: code
timestamp: 2026-08-29
---

# The dual-record rule — changelog.ts AND a changeset

## What it is

A change to a published `@zytedata/ds-*` package must be recorded in **two**
places, because they serve two different readers:

- **`packages/<slug>/src/changelog.ts`** — the _dashboard_ release log. Surfaced
  at `/products/<slug>/changelog`. Grouped by source file, newest entry first.
- **`.changeset/<name>.md`** — the _npm version bump_. Consumed by Changesets to
  bump `package.json` versions and write per-package `CHANGELOG.md` on release.

Neither is optional, and **neither is enforced by CI** — this is a
review-blocking rule.

## The pieces

**`changelog.ts`** is typed `FileChangelog[]` from `@zytedata/ds-types`:
```ts
export const <SLUG>_FILE_CHANGELOGS: FileChangelog[] = [
  { file: "foundations.ts", entries: [
    { date: "2026-08-29", author: "angel", kind: "changed",
      message: "One concise sentence describing the change." },
    // …newest first
  ]},
];
```
- `kind` is one of `added | changed | removed | fixed`.
- `date` — use `date +%F`, don't hardcode. `author` — your short git handle
  (`git config user.name`), matching the style of existing entries.
- Append to the block whose `file` matches what you edited (`"foundations.ts"`
  for tokens; add a `"design.body.md"` block entry if you changed prose too).

**Changeset** — write the file directly (don't run interactive `pnpm changeset`
if you're scripting it):
```md
---
"@zytedata/ds-<slug>": minor
---

One-line summary of the change.
```
- Bump level: `minor` for added / renamed / restructured tokens; `patch` for a
  value-only fix. List multiple packages on their own lines for a cross-product
  change.
- Config: [`.changeset/config.json`](../../.changeset/config.json) —
  `access: "restricted"`, `baseBranch: "main"`, `ignore: ["dashboard"]`
  (the private app never versions), GitHub changelog generator.

## The contract

- **`changelog.ts`** feeds the dashboard immediately (it's a normal TS import) —
  no build needed beyond the package's own `build:js`.
- **The changeset** does nothing until the `release` workflow runs; it's the
  _only_ thing that turns your edit into a version bump + published artefact. A
  merged change without a changeset ships nothing.
- The `canonicalDoc.version` in `foundations.ts` is a **separate** design-doc
  version and is not what Changesets bumps — see
  [token-authoring.md](./token-authoring.md).

## Gotchas

- Because CI doesn't gate the changeset, the failure is silent and downstream:
  the release PR simply won't include your package. Reviewers must check for it.
- `dashboard` is in the changeset `ignore` list — never write a changeset for it;
  it's private and unpublished.

## Related

- [adding-a-token.md](./adding-a-token.md) — where this rule sits in the flow
- [../environment/release-and-publish.md](../environment/release-and-publish.md) — the release pipeline
- [../integrations/github-packages.md](../integrations/github-packages.md) — where the bump publishes to
- [definition-of-done.md](./definition-of-done.md) — "ships together"
