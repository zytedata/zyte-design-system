import "server-only";

import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import type { ProductId } from "@/data/products";

// To read the codegen artefacts (tokens.{json,css,scss,tailwind.cjs} and
// design.md) we resolve only each package's `package.json` — which Turbopack
// can parse as a regular JSON module — then compute paths into the package's
// `dist/` from there. Resolving the artefact files directly trips Turbopack
// into trying to compile them (`tokens.scss` triggers a Sass loader, etc.),
// which we don't want; we just want the file contents at runtime.
const requireFromHere = createRequire(import.meta.url);

const PACKAGE_ROOT_RESOLVERS: Record<ProductId, () => string> = {
  web: () => path.dirname(requireFromHere.resolve("@zyte/ds-web/package.json")),
  core: () =>
    path.dirname(requireFromHere.resolve("@zyte/ds-core/package.json")),
  scrapy: () =>
    path.dirname(requireFromHere.resolve("@zyte/ds-scrapy/package.json")),
  extractSummit: () =>
    path.dirname(
      requireFromHere.resolve("@zyte/ds-extract-summit/package.json"),
    ),
};

const SLUG_BY_PRODUCT_ID: Record<ProductId, string> = {
  web: "web",
  core: "core",
  scrapy: "scrapy",
  extractSummit: "extract-summit",
};

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
  const resolver = PACKAGE_ROOT_RESOLVERS[productId];
  if (!resolver) return null;
  try {
    return path.join(resolver(), "dist", filename);
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
