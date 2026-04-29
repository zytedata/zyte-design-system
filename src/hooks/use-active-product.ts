"use client";

import { usePathname } from "next/navigation";

import {
  PRODUCTS,
  type Product,
  type ProductId,
  isProductSlug,
  getProductBySlug,
} from "@/data/products";

/**
 * Resolves the active product from the URL. Returns `null` on the root page
 * (the landing page) so the topbar can hide product-specific UI there.
 */
export function useActiveProduct(): Product | null {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "products" && segments[1] && isProductSlug(segments[1])) {
    return getProductBySlug(segments[1]);
  }

  return null;
}

export function useActiveProductId(): ProductId | null {
  return useActiveProduct()?.id ?? null;
}

export { PRODUCTS };
