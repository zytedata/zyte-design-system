import { redirect } from "next/navigation";

import { DEFAULT_PRODUCT_ID, getProductById } from "@/data/products";

export default function PrototypingIndexRedirect() {
  const product = getProductById(DEFAULT_PRODUCT_ID);
  redirect(`/products/${product.slug}/prototyping`);
}
