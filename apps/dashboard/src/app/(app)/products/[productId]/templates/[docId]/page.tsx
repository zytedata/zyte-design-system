import { notFound } from "next/navigation";

import { getProductBySlug } from "@/data/products";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string; docId: string };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId, docId } = await params;
  const product = getProductBySlug(productId);
  return {
    title: product ? `${product.label} · template ${docId}` : `Template · ${docId}`,
  };
}

export default async function ProductTemplateDocPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId, docId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-20 md:px-10">
      <Badge variant="secondary">{product.label} · Template</Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{docId}</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Placeholder for the{" "}
        <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
          {docId}
        </code>{" "}
        template inside the {product.label} scope. Recreate the prototype viewer
        here as the renderer is ported.
      </p>
    </div>
  );
}
