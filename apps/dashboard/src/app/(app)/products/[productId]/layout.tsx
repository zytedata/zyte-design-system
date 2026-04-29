import { promises as fs } from "node:fs";
import path from "node:path";

import { getProductBySlug } from "@/data/products";

// Anchor at the workspace root (two levels up from the dashboard) and
// walk to the sibling `packages/<slug>/dist/tokens.css`. See the longer
// comment in `src/data/foundations/docs.ts` for why this resolves in
// Vercel's lambda too: `outputFileTracingRoot` is set to the workspace
// root and `outputFileTracingIncludes` lists the packages/*/dist globs,
// so NFT preserves the same relative layout inside /var/task.
const DASHBOARD_ROOT = process.cwd();
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, "..", "..");

const SLUG_BY_PRODUCT_ID: Record<string, string> = {
  web: "web",
  core: "core",
  scrapy: "scrapy",
  extractSummit: "extract-summit",
};

async function readGeneratedCss(productId: string): Promise<string | null> {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return null;
  try {
    return await fs.readFile(
      path.join(WORKSPACE_ROOT, "packages", slug, "dist", "tokens.css"),
      "utf-8",
    );
  } catch {
    return null;
  }
}

export default async function ProductScopeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ productId: string }>;
}) {
  const { productId: slug } = await params;
  const product = getProductBySlug(slug);
  const css = product ? await readGeneratedCss(product.id) : null;

  return (
    <>
      {/* Inject the codegen-generated tokens.css for the active product so
          its CSS variables (`--<slug>-*`) are queryable in DevTools and
          usable by descendant components. tokens-build keeps this in sync
          with foundations.ts via each package's build:tokens hook. */}
      {css ? (
        <style
          data-product={product?.slug}
          dangerouslySetInnerHTML={{ __html: css }}
        />
      ) : null}
      {children}
    </>
  );
}
