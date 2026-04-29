import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ProductId } from "@/data/products";

const PRODUCTS_DIR = path.join(process.cwd(), "src", "data", "products");

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

async function readFirstAvailable(paths: string[]): Promise<string | null> {
  for (const candidate of paths) {
    try {
      return await fs.readFile(candidate, "utf-8");
    } catch {
      // try next candidate
    }
  }
  return null;
}

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

export async function readGeneratedArtefacts(
  productId: ProductId,
): Promise<GeneratedArtefact[]> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return [];

  const distDir = path.join(PRODUCTS_DIR, slug, "dist");
  const out: GeneratedArtefact[] = [];
  for (const def of ARTEFACT_DEFS) {
    try {
      const content = await fs.readFile(
        path.join(distDir, def.kind),
        "utf-8",
      );
      out.push({
        kind: def.kind,
        filename: `${slug}.${def.kind}`,
        content,
        bytes: Buffer.byteLength(content, "utf-8"),
        language: def.language,
      });
    } catch {
      // codegen has not run yet; skip silently. The dashboard's predev/prebuild
      // hooks ensure these exist in normal flows.
    }
  }
  return out;
}

export async function readCanonicalDoc(
  productId: ProductId,
): Promise<CanonicalDocPayload | null> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return null;

  const productDir = path.join(PRODUCTS_DIR, slug);
  // Prefer the codegen artefact (foundations.ts → tokens-build → dist/design.md).
  // Fall back to design.body.md so a fresh checkout still renders before the
  // user has run `npm run tokens:build` once. predev/prebuild guarantee the
  // dist/ artefact exists in normal workflows.
  const content = await readFirstAvailable([
    path.join(productDir, "dist", "design.md"),
    path.join(productDir, "design.body.md"),
  ]);
  if (content === null) return null;

  return {
    productId,
    productSlug: slug,
    filename: `${slug}.design.md`,
    content,
    bytes: Buffer.byteLength(content, "utf-8"),
  };
}
