import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { readCanonicalDoc } from "@/data/foundations/docs";
import { getConfiguredProviders } from "@/lib/studio-llm";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";
import { MarkdownStudio } from "@/components/studio/markdown-studio";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Markdown Studio" };
  return {
    title: `${product.label} · Markdown Studio`,
    description:
      "Chat-driven, design-system-aware markdown authoring for pages and hand-off specs.",
  };
}

export default async function ProductStudioPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const enabled = product.capabilities.studio.enabled;

  if (!enabled) {
    return (
      <AppPageShell>
        <Badge variant="secondary">{product.label} · Not yet wired</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {product.label} Markdown Studio
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Markdown Studio is not yet wired for the {product.label} workspace.
          This placeholder keeps navigation consistent across scopes — flip the{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            studio.enabled
          </code>{" "}
          capability for{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {product.id}
          </code>{" "}
          in{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            src/data/products.ts
          </code>{" "}
          to enable real content.
        </p>
      </AppPageShell>
    );
  }

  const doc = await readCanonicalDoc(product.id);
  const availableProviders = getConfiguredProviders();

  return (
    <AppPageShell className="flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden pt-6 pb-6">
      <div className="shrink-0">
        <Badge variant="secondary">{product.label} · Markdown Studio</Badge>
        <h1 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
          Markdown Studio
        </h1>
        <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
          Chat to draft an on-brand markdown document grounded in the{" "}
          {product.label} design system. Pick a skill, describe what you need,
          then copy or download the result for Claude, Cursor, or your
          developers.
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <MarkdownStudio
          productSlug={product.slug}
          productLabel={product.label}
          designDoc={doc?.content ?? null}
          availableProviders={availableProviders}
        />
      </div>
    </AppPageShell>
  );
}
