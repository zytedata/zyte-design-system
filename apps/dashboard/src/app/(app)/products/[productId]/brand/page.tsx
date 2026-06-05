import { notFound, redirect } from "next/navigation";

import { getProductBySlug } from "@/data/products";
import { defaultBrandSection } from "@/lib/brand";

export default async function BrandIndexPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  redirect(`/products/${product.slug}/brand/${defaultBrandSection().slug}`);
}
