import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { getProductBySlug } from "@/data/products";

// We resolve only `@zyte/ds-<slug>/package.json` (which Turbopack treats as a
// regular JSON module) and compute the path to `dist/tokens.css` from there.
// Resolving the CSS file directly would make Turbopack try to bundle it as
// a stylesheet, which we don't want — we just want to read the bytes and
// inline them into a `<style>` tag.
const requireFromHere = createRequire(import.meta.url);

const PACKAGE_ROOT_RESOLVERS: Record<string, () => string> = {
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

async function readGeneratedCss(productId: string): Promise<string | null> {
  const resolver = PACKAGE_ROOT_RESOLVERS[productId];
  if (!resolver) return null;
  try {
    return await fs.readFile(
      path.join(resolver(), "dist", "tokens.css"),
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
