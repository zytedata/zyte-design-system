import { notFound, redirect } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { getFoundations } from "@/data/foundations";
import { readCanonicalDoc, readGeneratedArtefacts } from "@/data/foundations/docs";
import { buildFoundationSections, findSectionBySlug, paletteLabelFor } from "@/lib/foundations";
import { Badge } from "@/components/ui/badge";
import { FoundationsSidenav } from "@/components/foundations/foundations-sidenav";
import {
  AgenticSection,
  BreakpointsSection,
  LucideIconsSection,
  OpacityZIndexSection,
  PaletteSection,
  RadiusShadowSection,
  SizingSection,
  SpacingSection,
  TailwindColorsSection,
  TypographySection,
} from "@/components/foundations/sections";

type RouteParams = { productId: string; section: string };

export function generateStaticParams() {
  return PRODUCT_LIST.flatMap((product) => {
    const bundle = getFoundations(product.id);
    return buildFoundationSections(bundle).map((section) => ({
      productId: product.slug,
      section: section.slug,
    }));
  });
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId, section } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Foundations" };
  const bundle = getFoundations(product.id);
  const sectionMeta = findSectionBySlug(bundle, section);
  return {
    title: sectionMeta
      ? `${sectionMeta.label} — ${product.label} Foundations`
      : `${product.label} Foundations`,
    description: product.description,
  };
}

export default async function FoundationsSectionPage({ params }: { params: Promise<RouteParams> }) {
  const { productId, section: sectionSlug } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  if (sectionSlug === "changelog") {
    redirect(`/products/${product.slug}/changelog`);
  }

  const bundle = getFoundations(product.id);
  const sections = buildFoundationSections(bundle);
  const section = findSectionBySlug(bundle, sectionSlug);
  if (!section) notFound();

  const isAgentSection = section.id === "agent" && bundle.canonicalDoc;
  const [canonicalDoc, generatedArtefacts] = isAgentSection
    ? await Promise.all([
        readCanonicalDoc(product.id),
        readGeneratedArtefacts(product.id),
      ])
    : [null, []];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-10 pb-20 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <FoundationsSidenav
            productSlug={product.slug}
            sections={sections}
            activeSlug={section.slug}
          />
        </aside>

        <div className="min-w-0">
          <header className="border-border/60 mb-8 border-b pb-6">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {section.group === "palette" ? paletteLabelFor(section.id) : section.label}
            </h1>
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
              <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">
                /products/{product.slug}/foundations/{section.slug}
              </code>
              <Badge variant="secondary">{product.label} Foundations</Badge>
            </div>
          </header>

          <div className="space-y-8">
            {section.group === "palette" ? (
              <PaletteSection bundle={bundle} paletteId={section.id} productId={product.id} />
            ) : section.id === "agent" ? (
              <AgenticSection
                bundle={bundle}
                productLabel={product.label}
                productSlug={product.slug}
                doc={canonicalDoc}
                artefacts={generatedArtefacts}
              />
            ) : section.id === "tailwindColors" ? (
              <TailwindColorsSection />
            ) : section.id === "icons" ? (
              <LucideIconsSection />
            ) : section.id === "spacing" ? (
              <SpacingSection bundle={bundle} />
            ) : section.id === "sizing" ? (
              <SizingSection />
            ) : section.id === "typography" ? (
              <TypographySection bundle={bundle} />
            ) : section.id === "radiusShadows" ? (
              <RadiusShadowSection bundle={bundle} />
            ) : section.id === "breakpoints" ? (
              <BreakpointsSection bundle={bundle} />
            ) : section.id === "opacityZindex" ? (
              <OpacityZIndexSection bundle={bundle} />
            ) : (
              <p className="text-muted-foreground text-sm">
                Section <code>{section.slug}</code> is not implemented yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
