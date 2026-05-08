# Releasing Zyte design-system packages

Phase 2 ships every product as its own publishable package on **GitHub Packages**:

- `@zyte/ds-types` (shared TypeScript contract)
- `@zyte/tokens-build` (codegen used at build-time only)
- `@zyte/ds-web`, `@zyte/ds-core`, `@zyte/ds-scrapy`, `@zyte/ds-extract-summit`

`apps/dashboard` is a private workspace consumer; it is never published.

## How a token change reaches a consumer

1. **Author** edits `packages/<slug>/src/foundations.ts` (or
   `design.body.md`). Locally `pnpm dev` regenerates `dist/` via the
   `predev` hook.
2. **PR** → `validate` workflow runs typecheck, lint, `tokens:check` and a
   dashboard build smoke. PR will not merge if the codegen drifts or any
   downstream artefact is missing.
3. **Changeset**: author runs `pnpm changeset`, picks the bumped
   package(s) and the bump level (patch / minor / major), commits the
   resulting `.changeset/*.md` to the same PR.
4. **Merge to main** → the `release` workflow opens (or updates) a
   `chore(release): version packages` PR. That PR contains the version
   bumps + per-package `CHANGELOG.md` updates.
5. **Merge the release PR** → the same workflow runs again and this time
   publishes the bumped packages to `https://npm.pkg.github.com` under
   the `@zyte` scope.
6. **Consumers** (e.g. `zyte-website-nextjs`) bump their dep with
   Renovate / Dependabot or `pnpm up @zyte/ds-web`. They never need to
   know about `foundations.ts`; they consume `tokens.css`,
   `tokens.scss`, `tailwind` and `design.md` via the package's
   `exports` map.

## Required GitHub repo secrets

`release.yml` and `validate.yml` rely on:

| Secret                  | Used by   | Purpose                                                                                                     |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`          | both      | Auto-provided. Reads from / publishes to GitHub Packages within this repo.                                  |
| `PERSONAL_GITHUB_TOKEN` | `release` | _Optional._ Fine-grained PAT (contents/pull-requests/packages write). Required if you want the release PR's commit to trigger downstream workflows (the default `GITHUB_TOKEN` will not). |
| `VERCEL_DEPLOY_HOOK_URL` | `deploy-vercel` | Deploy Hook URL for the dashboard project. Called on every push to `main` and every PR targeting `main`. |

`release.yml` sets `GITHUB_TOKEN`, `NODE_AUTH_TOKEN`, and `NPM_TOKEN` from
`PERSONAL_GITHUB_TOKEN || GITHUB_TOKEN` so `changesets/action` publishes via
token auth (not OIDC) to GitHub Packages.

`apps/dashboard/vercel.json` sets `git.deploymentEnabled: false`, so Vercel
does not auto-deploy on Git pushes. Production deploys are triggered by the
`deploy-vercel.yml` workflow via `VERCEL_DEPLOY_HOOK_URL`.

`release.yml` also disables `NPM_CONFIG_PROVENANCE` for the publish step.
GitHub Packages publishes are restricted/private, and provenance generation
fails there with `EUSAGE`.

## Local publish (escape hatch)

Only do this when the GH Actions flow is unavailable.

```bash
# 1. Auth pnpm against GH Packages with a PAT (packages: write):
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc

# 2. Build everything fresh:
pnpm -r --filter "./packages/*" run build

# 3. Bump versions and write changelogs from queued changesets:
pnpm version

# 4. Publish all bumped packages:
pnpm release
```

`pnpm release` is wired in the root `package.json` to run
`pnpm -r --filter "./packages/*" build && changeset publish`.

## Adding a fifth product

1. `mkdir -p packages/<slug>/src && cd packages/<slug>`
2. Copy a sibling's `package.json` + `tsconfig*.json`, rename to
   `@zyte/ds-<slug>`.
3. Drop `foundations.ts`, `design.body.md`, `index.ts`, `changelog.ts`
   and (optionally) `components.ts` / `content.ts` into `src/`.
4. `pnpm install` (re-link bins) → `pnpm -r --filter ./packages/<slug>
   build` → `pnpm tokens:check`.
5. Wire it into `apps/dashboard/src/data/products.ts` and the resolver
   tables in `apps/dashboard/src/data/foundations/docs.ts` +
   `apps/dashboard/src/app/(app)/products/[productId]/layout.tsx`.
