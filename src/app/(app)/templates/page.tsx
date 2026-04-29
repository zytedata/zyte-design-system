import { redirect } from "next/navigation";

import { DEFAULT_PRODUCT_ID, getProductById } from "@/data/products";

export default function TemplatesIndexRedirect() {
  const product = getProductById(DEFAULT_PRODUCT_ID);
  redirect(`/products/${product.slug}/templates`);
}
