import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { getFoundations } from "@/data/foundations";
import { readCanonicalDoc, readGeneratedArtefacts } from "@/data/foundations/docs";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";
import { AgenticSection } from "@/components/foundations/sections";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  return {
    title: product ? `${product.label} — Agentic (Design.md)` : "Agentic",
    description: product?.description,
  };
}

export default async function AgenticPage({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const bundle = getFoundations(product.id);
  const [canonicalDoc, generatedArtefacts] = bundle.canonicalDoc
    ? await Promise.all([
        readCanonicalDoc(product.id),
        readGeneratedArtefacts(product.id),
      ])
    : [null, []];

  return (
    <AppPageShell>
      <header className="border-border/60 mb-8 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Agentic</h1>
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">
            /products/{product.slug}/agentic
          </code>
          <Badge variant="secondary">{product.label} · LLM / Design.md</Badge>
        </div>
      </header>

      <div className="space-y-8">
        <AgenticSection
          bundle={bundle}
          productLabel={product.label}
          productSlug={product.slug}
          doc={canonicalDoc}
          artefacts={generatedArtefacts}
        />
      </div>
    </AppPageShell>
  );
}
