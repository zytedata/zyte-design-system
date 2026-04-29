import { promises as fs } from "node:fs";
import path from "node:path";

import { getProductBySlug } from "@/data/products";

// We deliberately avoid `createRequire(import.meta.url)` here: Turbopack's
// server runtime can rewrite `import.meta.url` to a bundle-internal path
// that no longer sees the workspace's `node_modules`, which makes
// `@zyte/*` specifiers fail to resolve. Instead we anchor at the dashboard
// root (`process.cwd()` is `apps/dashboard` in both `next dev` and
// `next build`) and walk to `node_modules/@zyte/ds-<slug>/dist/tokens.css`,
// which works for both pnpm workspace symlinks and registry installs.
const DASHBOARD_ROOT = process.cwd();

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
      path.join(
        DASHBOARD_ROOT,
        "node_modules",
        "@zyte",
        `ds-${slug}`,
        "dist",
        "tokens.css",
      ),
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
