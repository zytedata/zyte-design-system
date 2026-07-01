import Link from "next/link";
import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { listTemplates } from "@/data/templates";
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
  const templates = enabled ? await listTemplates(product.id) : [];

  return (
    <AppPageShell>
      <Badge variant="secondary">{enabled ? "Draft" : "Not yet wired"}</Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Templates
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        Page-level templates assembled from {product.label} components. Each
        template pairs a standalone, design-system-styled preview with a markdown
        spec describing its layout, look &amp; feel, and behaviour.{" "}
        <span className="text-foreground/80 font-medium">
          This area is a work in progress — templates and previews are early
          drafts and will keep changing.
        </span>
      </p>

      {!enabled ? (
        <p className="text-muted-foreground mt-8 max-w-2xl text-sm leading-relaxed">
          Templates are not yet wired for the {product.label} workspace. Toggle the{" "}
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
      ) : templates.length === 0 ? (
        <p className="text-muted-foreground mt-8 max-w-2xl text-sm leading-relaxed">
          No templates found. Add a{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            &lt;id&gt;.md
          </code>{" "}
          + matching{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            &lt;id&gt;.html
          </code>{" "}
          pair under{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            packages/{product.slug}/src/templates/
          </code>
          .
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/products/${product.slug}/templates/${template.id}`}
              className="group bg-card hover:border-foreground/30 flex flex-col rounded-xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-foreground font-semibold capitalize">
                  {template.title}
                </h2>
                <Badge variant="outline" className="shrink-0 text-xs capitalize">
                  {template.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                {template.summary}
              </p>
              <span className="text-muted-foreground group-hover:text-foreground mt-4 text-xs font-medium transition-colors">
                View template →
              </span>
            </Link>
          ))}
        </div>
      )}
    </AppPageShell>
  );
}
