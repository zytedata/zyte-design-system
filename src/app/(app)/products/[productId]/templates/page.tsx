import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  return {
    title: product ? `${product.label} templates` : "Templates",
    description: "Page-level templates and layout patterns assembled from product components.",
  };
}

export default async function ProductTemplatesPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const enabled = product.capabilities.templates.enabled;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-20 md:px-10">
      <Badge variant="secondary">
        {product.label} · {enabled ? "Templates" : "Not yet wired"}
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {product.label} templates
      </h1>
      {enabled ? (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Page-level templates and layout patterns assembled from {product.label}
          {" "}components. The original Angular project hosts an interactive
          prototype viewer here; reproduce as content is migrated. Per-template
          URLs follow the pattern{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            /products/{product.slug}/templates/[docId]
          </code>
          .
        </p>
      ) : (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Templates are not yet wired for the {product.label} workspace. This
          placeholder keeps navigation consistent across scopes — add real
          template content by toggling the{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            templates.enabled
          </code>{" "}
          capability for{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {product.id}
          </code>{" "}
          in{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            src/data/products.ts
          </code>
          .
        </p>
      )}
    </div>
  );
}
