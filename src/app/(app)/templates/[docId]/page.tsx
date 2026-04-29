import { redirect } from "next/navigation";

import { DEFAULT_PRODUCT_ID, getProductById } from "@/data/products";

type RouteParams = { docId: string };

export default async function LegacyTemplateDocRedirect({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { docId } = await params;
  const product = getProductById(DEFAULT_PRODUCT_ID);
  redirect(`/products/${product.slug}/templates/${docId}`);
}
