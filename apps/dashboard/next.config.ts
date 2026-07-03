import path from "node:path";
import type { NextConfig } from "next";

// `next build` is always invoked with `apps/dashboard` as cwd (via
// `pnpm --filter dashboard build`). The workspace root sits two
// directories up; that's the anchor we want for outputFileTracingRoot.
const WORKSPACE_ROOT = path.join(process.cwd(), "..", "..");

const DS_PACKAGE_DIST_GLOBS = [
  "packages/web/dist/**",
  "packages/web/package.json",
  "packages/core/dist/**",
  "packages/core/package.json",
  "packages/scrapy/dist/**",
  "packages/scrapy/package.json",
  "packages/extract-summit/dist/**",
  "packages/extract-summit/package.json",
];

const nextConfig: NextConfig = {
  // Treat each design-system package as an external dependency so Turbopack
  // does not try to bundle their non-JS artefacts (tokens.css, tokens.scss,
  // tokens.tailwind.cjs, design.md). The dashboard reads those at runtime
  // via `fs.readFile`; bundling them would either fail (no SCSS pipeline
  // configured) or quietly produce wrong output.
  serverExternalPackages: [
    "@zytedata/ds-web",
    "@zytedata/ds-core",
    "@zytedata/ds-scrapy",
    "@zytedata/ds-extract-summit",
    "@zytedata/ds-types",
  ],

  // We're inside a pnpm workspace (`apps/dashboard` plus `packages/*`).
  // Without this, Next.js's File Tracer scopes itself to the dashboard
  // directory and won't see the sibling packages, which means the Vercel
  // lambda ships without `packages/<slug>/dist/*` and every fs.readFile
  // for design.md / tokens.css fails at runtime.
  outputFileTracingRoot: WORKSPACE_ROOT,

  // The dashboard reads each @zytedata/ds-* package's `dist/{design.md,
  // tokens.{json,css,scss,tailwind.cjs}}` and `package.json` via
  // `fs.readFile` from app/(app)/products/[productId]/{layout,foundations/
  // [section],documentation}. NFT can't trace those reads because they
  // aren't static imports, so we list them explicitly per route. Globs
  // are resolved relative to `outputFileTracingRoot` (the workspace root).
  outputFileTracingIncludes: {
    "/products/[productId]": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/foundations": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/foundations/[section]": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/documentation": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/changelog": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/templates": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/templates/[docId]": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/assets": DS_PACKAGE_DIST_GLOBS,
    "/products/[productId]/prototyping": DS_PACKAGE_DIST_GLOBS,
  },

  // The Yellix brand webfont lives in `public/fonts/` and is the canonical
  // hosted copy the `design.md` spec links to. Serve it with permissive CORS
  // so other Zyte properties (and design.md consumers) can embed it
  // cross-origin, plus a long immutable cache since the files never change
  // under a given name.
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
