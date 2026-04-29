import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Treat each design-system package as an external dependency so Turbopack
  // does not try to bundle their non-JS artefacts (tokens.css, tokens.scss,
  // tokens.tailwind.cjs, design.md). The dashboard reads those at runtime
  // via `fs.readFile` + `require.resolve`; bundling them would either fail
  // (no SCSS pipeline configured) or quietly produce wrong output.
  serverExternalPackages: [
    "@zyte/ds-web",
    "@zyte/ds-core",
    "@zyte/ds-scrapy",
    "@zyte/ds-extract-summit",
    "@zyte/ds-types",
  ],
};

export default nextConfig;
