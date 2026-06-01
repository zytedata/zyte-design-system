import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  return {
    title: product ? `${product.label} assets` : "Assets",
    description:
      "Logos, illustrations, icons and other downloadable brand assets for the workspace.",
  };
}

export default async function ProductAssetsPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const enabled = product.capabilities.assets.enabled;

  return (
    <AppPageShell>
      <Badge variant="secondary">
        {product.label} · {enabled ? "Assets" : "Not yet wired"}
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {product.label} assets
      </h1>
      {enabled ? (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Logos, illustrations, icons and downloadable brand assets for the{" "}
          {product.label} workspace. Recreate the asset gallery here as the
          original Angular catalog is migrated.
        </p>
      ) : (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Assets are not yet wired for the {product.label} workspace. This
          placeholder keeps navigation consistent across scopes — add real
          assets by toggling the{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            assets.enabled
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
    </AppPageShell>
  );
}
