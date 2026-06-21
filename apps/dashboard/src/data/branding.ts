import type { BrandingSection, ProductBranding } from "@zytedata/ds-types";
import type { ProductId } from "@/data/products";

import { WEB_BRANDING } from "@zytedata/ds-web";

/**
 * Branding bundles per product. Only the Web scope ships brand guidance today;
 * add other products here as their `<SLUG>_BRANDING` constants land.
 */
export const PRODUCT_BRANDING: Partial<Record<ProductId, ProductBranding>> = {
  web: WEB_BRANDING,
};

export function getBranding(id: ProductId): ProductBranding | null {
  return PRODUCT_BRANDING[id] ?? null;
}

export function getBrandingSection(
  id: ProductId,
  slug: string,
): BrandingSection | null {
  return getBranding(id)?.sections.find((section) => section.slug === slug) ?? null;
}
