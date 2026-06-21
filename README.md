# Zyte Design System

Monorepo that produces and ships the design tokens, foundations and machine-readable specs for every Zyte product surface.

A single source of truth — `foundations.ts` per product — feeds two outputs:

- **Per-product npm packages** (`@zytedata/ds-web`, `@zytedata/ds-core`, `@zytedata/ds-scrapy`, `@zytedata/ds-extract-summit`) that downstream apps install and consume as **CSS / SCSS / Tailwind preset / TypeScript / Markdown spec**.
- **A live DesignOps dashboard** (`apps/dashboard`) where designers and engineers explore the tokens, palettes, typography, and the agent-readable `design.md` spec / file for each product.

You're looking at the **producer** repo. If you want to **consume** the design system in another app, jump to [Consuming the design system](#consuming-the-design-system) below.

---

## Quick start

```bash
git clone git@github.com:zytedata/zyte-design-system.git
cd zyte-design-system

corepack enable                              # one-off, ensures pnpm is available
pnpm install
pnpm -r --filter "./packages/*" run build    # generate every package's dist/ (one-off)
pnpm dev                                     # → http://localhost:3000
```

That's it. Open the dashboard, navigate to `/products/web/foundations`, and you should see live tokens. The full local-dev guide (commands, routes, recipes, troubleshooting) lives in [Local development](#local-development).

---

## At a glance

```
zyte-design-system/
├── apps/
│   └── dashboard/                # The DesignOps Next.js app (private, not published)
└── packages/
    ├── types/                    # @zytedata/ds-types  — shared TS contract
    ├── tokens-build/             # @zytedata/tokens-build — codegen CLI (build-time only)
    ├── web/                      # @zytedata/ds-web
    ├── core/                     # @zytedata/ds-core
    ├── scrapy/                   # @zytedata/ds-scrapy
    └── extract-summit/           # @zytedata/ds-extract-summit
```

Each `@zytedata/ds-<product>` package owns:

- `src/foundations.ts` — TypeScript source of truth for every token (colors, typography, spacing, radii, shadows, breakpoints, opacities, z-index, components).
- `src/design.body.md` — prose contract describing how the product is meant to look and feel; lives in plain English so designers, PMs and LLMs can read it.
- `src/{changelog,components,content}.ts` — supporting metadata (release log, component contracts, optional narrative content blocks).

The codegen step (`@zytedata/tokens-build`) reads those two files and writes:

- `dist/tokens.json` — DTCG-flavoured JSON
- `dist/tokens.css` — CSS custom properties, namespaced per product (e.g. `--web-primary-500`)
- `dist/tokens.scss` — SCSS variables (e.g. `$web-primary-500`)
- `dist/tokens.tailwind.cjs` — Tailwind preset (extends `theme.colors.<slug>.*`, etc.)
- `dist/design.md` — `design.body.md` with auto-generated YAML front-matter (title, version, token surface stats)

Consumers never see the source `.ts` files. They install the package and import from `dist/` via the package's `exports` map.

---

## Repository workflows

There are two kinds of work that happen in this repo, and the rest of the README is organised around them.

| Audience | Goal | Section |
|---|---|---|
| **Design system author / token maintainer** | Add or change a token, ship it as a new version | [Updating a token](#updating-a-token) |
| **Downstream developer** | Install the design system in your app and use the tokens | [Consuming the design system](#consuming-the-design-system) |

---

## Updating a token

This is the workflow when you (designer, design engineer, or developer maintaining the DS) want to change a colour, add a new typography step, tweak a radius, etc.

### 1. Edit the source

```bash
# Pick the product whose tokens you're changing
$EDITOR packages/web/src/foundations.ts
# Optional: update the prose narrative
$EDITOR packages/web/src/design.body.md
```

`foundations.ts` is plain TypeScript — there's no DSL to learn, just an object literal typed against `ProductFoundations` from `@zytedata/ds-types`.

```ts
// packages/web/src/foundations.ts (excerpt)
export const WEB_FOUNDATIONS: ProductFoundations = {
  colors: {
    primary: { 500: "#1f6feb", /* … */ },
    // …
  },
  typography: {
    family: { sans: "Inter, sans-serif" },
    size: { sm: 14, md: 16, lg: 20 },
    // …
  },
  // spacing, radius, shadow, breakpoint, opacity, zIndex, components, …
};
```

### 2. Regenerate the artefacts

```bash
pnpm tokens:build           # rebuild dist/ for every product
# or just one product:
pnpm --filter @zytedata/ds-web run build
```

This compiles `foundations.ts` and runs `tokens-build` against it, producing every output listed earlier in `packages/<product>/dist/`.

### 3. Verify in the dashboard

```bash
pnpm dev
# → http://localhost:3000/products/web/foundations
```

The dashboard reads each product's `dist/` at request time, so anything you regenerated shows up after a refresh — palette, tokens, typography ramps, the `design.md` viewer, the lot.

### 4. Validate before opening the PR

```bash
pnpm tokens:check           # runs the codegen as a dry-run + token-shape validation
pnpm typecheck              # tsc --noEmit across every workspace
pnpm --filter dashboard run lint
```

The same checks run in CI on every PR; failing locally first saves a round-trip.

### 5. Add a Changeset

This is the bit that ties your edit to a version bump on the published package.

```bash
pnpm changeset
# → pick which @zytedata/ds-* packages changed
# → pick patch / minor / major
# → write a one-line summary (used in the published CHANGELOG.md)
```

A `.changeset/<random-name>.md` file is written. Commit it alongside your code change.

### 6. Open the PR, get it merged

Once `main` accumulates one or more changesets, GitHub Actions opens (or updates) a `chore(release): version packages` PR. Merging that PR triggers the publish step, which pushes the bumped packages to GitHub Packages.

The full release pipeline lives in [`.github/RELEASING.md`](.github/RELEASING.md).

### TL;DR for token maintainers

```
edit foundations.ts → pnpm tokens:build → pnpm dev (verify)
→ pnpm tokens:check → pnpm changeset → commit + push → PR
```

---

## Consuming the design system

This is the workflow for a developer in another repo (e.g. `zyte-website-nextjs`) who just wants to *use* the tokens in their app.

### 1. Authenticate against GitHub Packages

The `@zytedata` scope is published to GitHub Packages, not to the public npm registry. The packages are published with **Internal** visibility, so every `zytedata` org member and every internal repo's CI gets read access automatically — there is no per-package access request and no hand-minted PAT for the common cases below.

**Step 1 — commit this `.npmrc` to your consumer repo** (works for pnpm, npm, and Yarn Classic v1):

```ini
@zytedata:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
auto-install-peers=true
```

Yarn Berry (v2+) instead reads `.yarnrc.yml`:

```yaml
npmScopes:
  zytedata:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${NODE_AUTH_TOKEN}"
```

**Step 2 — provide `NODE_AUTH_TOKEN`:**

- **Locally** — reuse your existing GitHub CLI login, no PAT to create:
  ```bash
  export NODE_AUTH_TOKEN="$(gh auth token)"
  pnpm install
  ```
  (Add the `export` to your shell profile so it's always set. The token only needs `read:packages`, which `gh` already has.)

- **In GitHub Actions** — use the built-in token, nothing to configure as a secret:
  ```yaml
  - run: pnpm install --frozen-lockfile
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

Only fall back to a hand-created PAT (with `read:packages`) for environments that have neither `gh` nor an Actions token — e.g. a third-party CI or a Docker build arg.

### 2. Install the package(s)

```bash
pnpm add @zytedata/ds-web
# or, if consuming multiple products:
pnpm add @zytedata/ds-web @zytedata/ds-core
```

### 3. Pick the surface that matches your stack

The package exports five different shapes of the same tokens. Pick whichever fits your tooling — you can mix and match.

#### CSS variables (works anywhere)

```css
/* anywhere in your app's stylesheet, or in a top-level layout */
@import "@zytedata/ds-web/tokens.css";

/* now use them */
.button {
  background: var(--web-primary-500);
  padding: var(--web-spacing-3) var(--web-spacing-4);
  border-radius: var(--web-radius-md);
}
```

Variables are namespaced per product (`--web-*`, `--core-*`, …) so multiple `@zytedata/ds-*` packages can coexist in one app without clashing.

#### SCSS

```scss
@use "@zytedata/ds-web/tokens.scss" as *;

.button {
  background: $web-primary-500;
  padding: $web-spacing-3 $web-spacing-4;
}
```

#### Tailwind preset

```js
// tailwind.config.js
const webPreset = require("@zytedata/ds-web/tailwind");

module.exports = {
  presets: [webPreset],
  content: ["./src/**/*.{ts,tsx}"],
  // your overrides…
};

// → bg-web-primary-500, text-web-primary-700, p-web-4, rounded-web-md, …
```

#### Typed foundations (for tooling, Storybook, agents, scripts)

```ts
import { WEB_FOUNDATIONS, WEB_DOCUMENTATION } from "@zytedata/ds-web";

// Fully typed against ProductFoundations from @zytedata/ds-types
console.log(WEB_FOUNDATIONS.colors.primary[500]);
```

#### Machine-readable spec

```ts
// e.g. an agent / LLM endpoint
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const designMd = await fs.readFile(
  path.join(path.dirname(require.resolve("@zytedata/ds-web/package.json")), "dist/design.md"),
  "utf-8",
);
```

### 4. Stay up to date

Each merged release in this repo bumps the published version. Let Dependabot open a bump PR for the `@zytedata/*` scope; you review and merge it yourself.

**`.github/dependabot.yml`** in your consumer repo. The `registries` block is required: without it Dependabot can't read versions from GitHub Packages and silently never bumps `@zytedata/*`.

```yaml
version: 2
registries:
  github-packages:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.DEPENDABOT_PACKAGES_TOKEN }}
updates:
  - package-ecosystem: npm
    directory: "/"
    registries:
      - github-packages
    schedule:
      interval: daily
    groups:
      zyte-design-system:
        patterns: ["@zytedata/*"]
    labels: ["zyte-ds"]
```

Add `DEPENDABOT_PACKAGES_TOKEN` under **Settings → Secrets and variables → Dependabot** — a PAT with `read:packages` (Dependabot can't use the default `GITHUB_TOKEN` for private/internal registries).

That's it — when this repo publishes a new release, your consumer gets a grouped `@zytedata/*` PR within a day. Review it, let CI run against the new tokens, and merge when you're happy.

> Renovate works too — use `"matchPackagePatterns": ["^@zytedata/"]` with a `hostRules` entry carrying the same `read:packages` token.

You will **never** need to clone this repo, edit `foundations.ts`, or run the codegen yourself — that's the whole point of the package boundary.

---

## Local development

This section is for anyone working _in_ this repo (not just consuming the published packages).

### Prerequisites

- **Node.js ≥ 20** (`node -v`)
- **pnpm ≥ 8** — easiest via Corepack: `corepack enable` (Node 20 ships with Corepack). The `packageManager` field in `package.json` pins the exact pnpm version Corepack will use.
- A **GitHub Personal Access Token** with `read:packages` scope (only required if you ever need to read the published `@zytedata/*` artefacts; not required for daily work in this repo since everything is built locally from source).

### First-time bootstrap

```bash
git clone git@github.com:zytedata/zyte-design-system.git
cd zyte-design-system

corepack enable
pnpm install
pnpm -r --filter "./packages/*" run build
pnpm dev
```

The packages need to be built once because each package's `dist/` is gitignored, and the dashboard reads the generated `tokens.css` / `design.md` from there.

After the first build, `pnpm dev` is enough — the dashboard's `predev` hook regenerates tokens automatically before the dev server starts.

### Running the dashboard

```bash
pnpm dev                       # dashboard on http://localhost:3000
```

Routes to know once it's up:

| URL | What it shows |
|---|---|
| `/` | Landing page with the product switcher |
| `/products/web` | Web product dashboard |
| `/products/web/foundations` | Live tokens + palette + typography for Web |
| `/products/web/foundations/design-md` | Rendered `design.md` (the LLM-readable spec) |
| `/products/web/documentation` | Onboarding / consumption guide |
| `/products/web/changelog` | Release log for `@zytedata/ds-web` |

Replace `web` with `core`, `scrapy`, or `extract-summit` for the other products.

### Root commands (most-used)

Run these from the repo root.

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dashboard dev server (Turbopack) on `:3000` |
| `pnpm build` | Build every package, then build the dashboard for production |
| `pnpm start` | Serve the production dashboard build (`next start`) |
| `pnpm tokens:build` | Regenerate `dist/{tokens.*,design.md}` for every product |
| `pnpm tokens:check` | Validate codegen + token shapes (CI-equivalent dry run) |
| `pnpm typecheck` | `tsc --noEmit` across every workspace project |
| `pnpm lint` | ESLint across the dashboard and every package |
| `pnpm lint:fix` | Same, with `--fix` |
| `pnpm format` | Prettier-format the entire repo |
| `pnpm format:check` | Verify formatting (CI) |
| `pnpm changeset` | Queue a version bump for the changed package(s) |
| `pnpm version` | Apply queued changesets locally (bump + write CHANGELOGs) |
| `pnpm release` | Build packages + `changeset publish` to GitHub Packages |

### Working in a single package

`pnpm` filters scope any command to one workspace:

```bash
pnpm --filter @zytedata/ds-web run build           # build only the web package
pnpm --filter @zytedata/ds-web run typecheck       # typecheck only the web package
pnpm --filter dashboard run lint               # lint only the dashboard

pnpm --filter @zytedata/ds-web run build:tokens    # regenerate just web's dist/tokens.*
```

`pnpm -r ...` is the same with the `-r` (recursive) flag, applied to every workspace.

### Common recipes

**Iterate on a token change**

```bash
$EDITOR packages/web/src/foundations.ts
pnpm --filter @zytedata/ds-web run build:tokens    # fast: skips TS rebuild
# refresh http://localhost:3000/products/web/foundations
```

**Iterate on dashboard UI only** (no token change)

```bash
pnpm dev
# edits under apps/dashboard/src/** hot-reload via Turbopack
```

**Pre-PR checklist**

```bash
pnpm tokens:check && pnpm typecheck && pnpm lint && pnpm format:check
```

**Clean rebuild** (when something feels stale or after a long break)

```bash
pnpm -r exec rm -rf dist .next .turbo node_modules
rm -rf node_modules
pnpm install
pnpm -r --filter "./packages/*" run build
pnpm dev
```

### Project layout (where things live)

```
apps/dashboard/src/
├── app/                    # App Router routes (incl. /products/[productId]/…)
├── components/             # UI: ui/ (shadcn primitives), layout/, products/, foundations/, common/
├── data/                   # In-app data layer (products.ts, foundations resolvers, …)
├── config/                 # Site metadata, navigation
├── hooks/                  # Reusable client hooks
└── lib/                    # cn(), utility helpers

packages/<product>/src/
├── foundations.ts          # Token source of truth
├── design.body.md          # Prose spec (front-matter is generated)
├── changelog.ts            # Release log fed to the dashboard
├── components.ts           # Component contracts
├── content.ts              # Optional narrative content blocks
├── documentation.ts        # Per-product onboarding guide
└── index.ts                # Barrel re-export

packages/tokens-build/      # Codegen CLI (build-time only)
packages/types/             # @zytedata/ds-types — shared TS contract
```

### Adding a new product

See the *Adding a fifth product* section in [`.github/RELEASING.md`](.github/RELEASING.md). Short version: copy a sibling under `packages/`, rename to `@zytedata/ds-<slug>`, drop in `foundations.ts` + `design.body.md`, wire it into `apps/dashboard/src/data/products.ts` and the resolver tables in `apps/dashboard/src/data/foundations/docs.ts` + `apps/dashboard/src/app/(app)/products/[productId]/layout.tsx`.

### Troubleshooting

- **"Failed to load `packages/<slug>/src/design.body.md`" in the dashboard.** Run `pnpm -r --filter "./packages/*" run build` to populate `dist/`.
- **Tailwind classes from a `@zytedata/ds-*` preset don't apply.** Make sure the consumer's `tailwind.config.js` lists the preset under `presets: [require("@zytedata/ds-web/tailwind")]` _and_ that the consumer also imports `@zytedata/ds-web/tokens.css` so the underlying CSS variables are actually defined.
- **`tokens-build: command not found` during `pnpm --filter @zytedata/ds-* run build`.** Build the codegen first: `pnpm --filter @zytedata/tokens-build run build`, then retry.
- **`pnpm install` warns about missing bin links.** Same root cause — build `@zytedata/ds-types` and `@zytedata/tokens-build` once, then re-run `pnpm install`.

---

## How it all fits together

```
                    ┌──────────────────────────────┐
                    │  packages/<product>/src/     │
                    │   ├── foundations.ts  (TS)   │   ← YOU EDIT HERE
                    │   └── design.body.md  (MD)   │
                    └──────────────┬───────────────┘
                                   │
                            pnpm tokens:build
                          (@zytedata/tokens-build CLI)
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  packages/<product>/dist/    │
                    │   ├── tokens.json            │
                    │   ├── tokens.css             │
                    │   ├── tokens.scss            │
                    │   ├── tokens.tailwind.cjs    │
                    │   ├── design.md              │
                    │   └── index.js (typed API)   │
                    └──────┬───────────────┬───────┘
                           │               │
              published    │               │   read at runtime by
            (Changesets)   │               │   apps/dashboard
                           ▼               ▼
                  ┌───────────────┐  ┌──────────────────────┐
                  │ GitHub        │  │  DesignOps dashboard │
                  │ Packages      │  │  (this repo)         │
                  │ @zytedata/ds-*    │  └──────────────────────┘
                  └───────┬───────┘
                          │
                  pnpm add @zytedata/ds-web
                          │
                          ▼
                  ┌────────────────────────┐
                  │ Downstream apps        │
                  │  zyte-website-nextjs,  │
                  │  any future consumer   │
                  └────────────────────────┘
```

---

## Reference

- [`.github/RELEASING.md`](.github/RELEASING.md) — release pipeline, required secrets, escape hatches, adding a new product.
- `packages/<product>/src/documentation.ts` — per-product narrative for the **Documentation** page in the dashboard. Read it like a per-product README.
- `packages/<product>/src/design.body.md` — the prose spec for that product.
- The dashboard's per-product pages (`/products/<slug>/{foundations,documentation,changelog}`) are themselves living docs — once running, treat them as the canonical view.

## License

UNLICENSED — internal Zyte tooling.
