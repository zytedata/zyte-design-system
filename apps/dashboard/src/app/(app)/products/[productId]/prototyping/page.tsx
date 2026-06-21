import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

function prototypingLabelFor(productId: string): string {
  return productId === "core" ? "Protozyte" : "Prototyping";
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Prototyping" };
  return {
    title: `${product.label} · ${prototypingLabelFor(product.id)}`,
    description:
      "AI-assisted prototyping workspace tuned to product foundations and components.",
  };
}

export default async function ProductPrototypingPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const label = prototypingLabelFor(product.id);
  const enabled = product.capabilities.prototyping.enabled;

  return (
    <AppPageShell>
      <Badge variant="secondary">
        {product.label} · {enabled ? label : "Not yet wired"}
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {product.label} {label.toLowerCase()}
      </h1>
      {enabled ? (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          AI-assisted {label.toLowerCase()} workspace tuned to {product.label}{" "}
          foundations and components. The original Angular app exposes a
          generative scene builder here — recreate as a follow-up once the
          renderer is ported.
        </p>
      ) : (
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {label} is not yet wired for the {product.label} workspace. This
          placeholder keeps navigation consistent across scopes — flip the{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            prototyping.enabled
          </code>{" "}
          capability for{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {product.id}
          </code>{" "}
          in{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            src/data/products.ts
          </code>
          {" "}to enable real content.
        </p>
      )}
    </AppPageShell>
  );
}
