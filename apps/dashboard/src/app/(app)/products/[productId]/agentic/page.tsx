import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { getFoundations } from "@/data/foundations";
import { readCanonicalDoc, readGeneratedArtefacts } from "@/data/foundations/docs";
import { AppPageShell } from "@/components/layout/app-page-shell";
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
      <AgenticSection
        bundle={bundle}
        productLabel={product.label}
        productSlug={product.slug}
        icon={product.icon}
        accent={product.accent}
        doc={canonicalDoc}
        artefacts={generatedArtefacts}
      />
    </AppPageShell>
  );
}
