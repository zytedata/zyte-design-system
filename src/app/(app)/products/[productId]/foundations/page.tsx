import { notFound, redirect } from "next/navigation";

import { getProductBySlug } from "@/data/products";
import { defaultSectionFor } from "@/lib/foundations";
import { getFoundations } from "@/data/foundations";

export default async function FoundationsIndexPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const bundle = getFoundations(product.id);
  const section = defaultSectionFor(bundle);
  redirect(`/products/${product.slug}/foundations/${section.slug}`);
}
