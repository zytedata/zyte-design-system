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

export async function readCanonicalDoc(
  productId: ProductId,
): Promise<CanonicalDocPayload | null> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return null;

  const filePath = path.join(PRODUCTS_DIR, slug, "design.md");
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return {
      productId,
      productSlug: slug,
      filename: `${slug}.design.md`,
      content,
      bytes: Buffer.byteLength(content, "utf-8"),
    };
  } catch {
    return null;
  }
}
