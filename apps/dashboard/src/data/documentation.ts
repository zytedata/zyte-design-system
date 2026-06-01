import type { ProductDocumentation } from "@zyte/ds-types";
import { CORE_DOCUMENTATION } from "@zyte/ds-core";
import { EXTRACT_SUMMIT_DOCUMENTATION } from "@zyte/ds-extract-summit";
import { SCRAPY_DOCUMENTATION } from "@zyte/ds-scrapy";
import { WEB_DOCUMENTATION } from "@zyte/ds-web";

import type { ProductId } from "@/data/products";

/**
 * Shared documentation data used by both:
 *   • `/products/[id]/documentation` — the full long-form docs page
 *   • `/products/[id]` (dashboard)   — the install / quick-start card
 *
 * Single source of truth for "where the spec, source, registry and
 * spec-adjacent surfaces live" so the install card on the dashboard and
 * the full docs page never drift apart.
 */

export const REPO_URL = "https://github.com/zytedata/zyte-design-system";

export const DOCS_BY_PRODUCT: Record<ProductId, ProductDocumentation> = {
  web: WEB_DOCUMENTATION,
  core: CORE_DOCUMENTATION,
  scrapy: SCRAPY_DOCUMENTATION,
  extractSummit: EXTRACT_SUMMIT_DOCUMENTATION,
};

export function getProductDocumentation(
  productId: ProductId,
): ProductDocumentation {
  return DOCS_BY_PRODUCT[productId];
}

export type ProductDocLinks = {
  /** GitHub source for the package directory. */
  source: string;
  /** GitHub Packages registry page (placeholder until first publish). */
  registry: string;
  /** Workspace-internal foundations route. */
  foundations: string;
  /** Workspace-internal changelog route. */
  changelog: string;
  /** Workspace-internal design.md viewer route (the "agent" surface). */
  designMd: string;
  /** RELEASING.md inside the monorepo on GitHub. */
  releasing: string;
};

export function buildProductDocLinks(productSlug: string): ProductDocLinks {
  return {
    source: `${REPO_URL}/tree/main/packages/${productSlug}`,
    registry: `${REPO_URL}/pkgs/npm/ds-${productSlug}`,
    foundations: `/products/${productSlug}/foundations`,
    changelog: `/products/${productSlug}/changelog`,
    designMd: `/products/${productSlug}/foundations/design-md`,
    releasing: `${REPO_URL}/blob/main/.github/RELEASING.md`,
  };
}

export function getPackageName(productSlug: string): string {
  return `@zyte/ds-${productSlug}`;
}
