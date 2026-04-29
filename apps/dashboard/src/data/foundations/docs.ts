import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ProductId } from "@/data/products";

// We deliberately avoid `createRequire(import.meta.url)` here: Turbopack's
// server runtime rewrites `import.meta.url` to a bundle-internal path
// that no longer sees the workspace's `node_modules`, which makes
// `@zyte/*` specifiers fail to resolve.
//
// Anchoring at `process.cwd()` (which is `apps/dashboard` for both
// `next dev` and `next build`) and walking to the sibling
// `packages/<slug>/dist/...` works in three environments:
//   - local pnpm workspace (packages/<slug> is a real directory)
//   - Vercel/Next.js lambda with outputFileTracingRoot pointing at the
//     workspace root + outputFileTracingIncludes for packages/*/dist/**
//     (NFT preserves the relative layout inside the lambda, so the
//     dist files land at /var/task/packages/<slug>/dist/...)
//   - registry installs (future): we'd swap this for a node_modules
//     lookup, but as long as the dashboard ships in the same workspace
//     as the packages, the workspace-relative path is the most reliable
//     one — no createRequire, no bin shenanigans, no symlink resolution.
const DASHBOARD_ROOT = process.cwd();
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, "..", "..");

const SLUG_BY_PRODUCT_ID: Record<ProductId, string> = {
  web: "web",
  core: "core",
  scrapy: "scrapy",
  extractSummit: "extract-summit",
};

function packageRoot(productId: ProductId): string | null {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return null;
  return path.join(WORKSPACE_ROOT, "packages", slug);
}

export type CanonicalDocPayload = {
  productId: ProductId;
  productSlug: string;
  filename: string;
  content: string;
  bytes: number;
};

export type GeneratedArtefactKind =
  | "tokens.json"
  | "tokens.css"
  | "tokens.scss"
  | "tokens.tailwind.cjs";

export type GeneratedArtefact = {
  kind: GeneratedArtefactKind;
  filename: string;
  content: string;
  bytes: number;
  language: "json" | "css" | "scss" | "javascript";
};

const ARTEFACT_DEFS: Array<{
  kind: GeneratedArtefactKind;
  language: GeneratedArtefact["language"];
}> = [
  { kind: "tokens.json", language: "json" },
  { kind: "tokens.css", language: "css" },
  { kind: "tokens.scss", language: "scss" },
  { kind: "tokens.tailwind.cjs", language: "javascript" },
];

function distPath(productId: ProductId, filename: string): string | null {
  const root = packageRoot(productId);
  if (!root) return null;
  return path.join(root, "dist", filename);
}

/**
 * Read the version field from `@zyte/ds-<slug>/package.json` so the
 * dashboard can surface "npm-installable today" version strings without
 * hard-coding them.
 */
export async function readPackageVersion(
  productId: ProductId,
): Promise<string | null> {
  const root = packageRoot(productId);
  if (!root) return null;
  try {
    const pkgPath = path.join(root, "package.json");
    const raw = await fs.readFile(pkgPath, "utf-8");
    return (JSON.parse(raw) as { version?: string }).version ?? null;
  } catch {
    return null;
  }
}

async function tryReadDistFile(
  productId: ProductId,
  filename: string,
): Promise<string | null> {
  const filePath = distPath(productId, filename);
  if (!filePath) return null;
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function readGeneratedArtefacts(
  productId: ProductId,
): Promise<GeneratedArtefact[]> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return [];

  const out: GeneratedArtefact[] = [];
  for (const def of ARTEFACT_DEFS) {
    const content = await tryReadDistFile(productId, def.kind);
    if (content === null) continue;
    out.push({
      kind: def.kind,
      filename: `${slug}.${def.kind}`,
      content,
      bytes: Buffer.byteLength(content, "utf-8"),
      language: def.language,
    });
  }
  return out;
}

export async function readCanonicalDoc(
  productId: ProductId,
): Promise<CanonicalDocPayload | null> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return null;

  // Prefer the codegen artefact (foundations.ts + design.body.md → dist/design.md).
  // We don't fall back to the source `design.body.md` here because dashboards
  // installing from the registry would not ship it; if the build hasn't run
  // we'd rather surface "missing" than silently render stale prose.
  const content = await tryReadDistFile(productId, "design.md");
  if (content === null) return null;

  return {
    productId,
    productSlug: slug,
    filename: `${slug}.design.md`,
    content,
    bytes: Buffer.byteLength(content, "utf-8"),
  };
}
