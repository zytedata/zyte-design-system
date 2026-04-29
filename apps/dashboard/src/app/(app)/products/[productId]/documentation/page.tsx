import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import {
  WEB_ALIGNMENT_PRIORITIES,
  WEB_DESIGN_LAYERS,
  WEB_FRONTEND_STACK,
} from "@zyte/ds-web";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.filter((p) => p.capabilities.documentation.enabled).map((product) => ({
    productId: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Documentation" };
  return {
    title: `${product.label} documentation`,
    description: `${product.label} architecture notes and decision records.`,
  };
}

export default async function ProductDocumentationPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();
  if (!product.capabilities.documentation.enabled) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-20 md:px-10">
      <header className="max-w-3xl">
        <Badge variant="secondary">{product.label} documentation</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {product.id === "web"
            ? "How zyte-website-nextjs works (frontend)"
            : `${product.label} architecture notes`}
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {product.id === "web"
            ? "This section documents the current frontend implementation used by the Web product so we can align and improve the design system with real usage."
            : `Architecture notes, decision records and onboarding for the ${product.label} workspace.`}
        </p>
      </header>

      {product.id === "web" ? (
        <div className="mt-10 space-y-6">
          <article className="bg-card rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Frontend stack used in production</h2>
            <ul className="text-muted-foreground mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {WEB_FRONTEND_STACK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="bg-card rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Design implementation layers</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {WEB_DESIGN_LAYERS.map((layer) => (
                <div key={layer.title} className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-medium">{layer.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {layer.details}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-card rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Alignment priorities for the design system</h2>
            <ul className="text-muted-foreground mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {WEB_ALIGNMENT_PRIORITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : (
        <p className="text-muted-foreground mt-10 text-sm">
          Documentation content for {product.label} is in progress. Add it here as the workspace
          stabilises.
        </p>
      )}
    </div>
  );
}
