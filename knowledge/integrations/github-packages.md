---
type: Integration
title: GitHub Packages (publish + consume)
description: How @zytedata/* packages publish to GitHub Packages and how downstream apps authenticate and install them.
tags: [integration, github-packages, registry, publish, consume]
origin: code
timestamp: 2026-08-29
---

# GitHub Packages (publish + consume)

## What it is

The `@zytedata` scope is published to **GitHub Packages** (`https://npm.pkg.github.com`),
not the public npm registry, with `access: restricted` and Internal visibility —
every `zytedata` org member and internal CI gets read access automatically.

## The pieces

- **Scope routing (this repo):** root `.npmrc` sets
  `@zytedata:registry=https://npm.pkg.github.com` + `auto-install-peers=true`.
  It deliberately does **not** hard-code an auth token (keeps clean local dev for
  engineers who only build workspace deps).
- **Publish auth (CI):** `NODE_AUTH_TOKEN` / `NPM_TOKEN` come from `GITHUB_TOKEN`
  in `.github/workflows/release.yml`; `NPM_CONFIG_PROVENANCE: "false"` (provenance
  generation fails on restricted GH Packages with `EUSAGE`).
- **Publish mechanism:** `changesets/action@v1` runs `pnpm run release`
  (`pnpm -r --filter "./packages/*" build && changeset publish`). Only packages
  with a queued changeset bump publish; `dashboard` is ignored.
- **Per-package publish config:** each product's `package.json` has
  `publishConfig.registry = https://npm.pkg.github.com` + `access: restricted`,
  and a `files` allowlist (`dist`, `src`, and for Web `CHANGELOG.md`).
- **Consuming (downstream):** commit a `.npmrc` with the scope line +
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`; locally
  `export NODE_AUTH_TOKEN="$(gh auth token)"` (needs only `read:packages`), in
  Actions use `secrets.GITHUB_TOKEN`. Full guide in the repo README's "Consuming
  the design system."

## The contract

- A package version only exists after the `release` workflow publishes it; that
  requires a merged changeset (see
  [../conventions/changelog-and-changeset.md](../conventions/changelog-and-changeset.md)).
- Cross-package deps inside this repo are `workspace:*`, resolved locally — the
  registry is only involved for **downstream** consumers, so an unpublished
  workspace still builds in CI (`install --frozen-lockfile` needs no registry
  read for `workspace:*`).

## Gotchas

- Downstream **Dependabot** needs a `registries:` block with a
  `DEPENDABOT_PACKAGES_TOKEN` (a PAT with `read:packages`) — the default
  `GITHUB_TOKEN` can't read a restricted registry. This is consumer-side config;
  **this repo has no Dependabot** (see
  [../architecture/security-model.md](../architecture/security-model.md)).
- Provenance must stay disabled for the publish step, or it fails with `EUSAGE`.

## Related

- [../environment/release-and-publish.md](../environment/release-and-publish.md) — the release pipeline end-to-end
- [../conventions/changelog-and-changeset.md](../conventions/changelog-and-changeset.md) — what triggers a publish
- [vercel-deploy.md](./vercel-deploy.md) — the other CI-token boundary
