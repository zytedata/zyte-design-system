import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { getBrandingSection } from "@/data/branding";
import { BRAND_SECTIONS, findBrandSectionBySlug } from "@/lib/brand";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { BrandLogoShowcase } from "@/components/brand/logo-showcase";
import { Badge } from "@/components/ui/badge";

type RouteParams = { productId: string; section: string };

export function generateStaticParams() {
  return PRODUCT_LIST.flatMap((product) =>
    BRAND_SECTIONS.map((section) => ({
      productId: product.slug,
      section: section.slug,
    })),
  );
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId, section } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Brand" };
  const sectionMeta = findBrandSectionBySlug(section);
  return {
    title: sectionMeta
      ? `${sectionMeta.label} — ${product.label} Brand`
      : `${product.label} Brand`,
    description: sectionMeta?.description ?? product.description,
  };
}

export default async function BrandSectionPage({ params }: { params: Promise<RouteParams> }) {
  const { productId, section: sectionSlug } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const section = findBrandSectionBySlug(sectionSlug);
  if (!section) notFound();

  const content = getBrandingSection(product.id, sectionSlug);

  return (
    <AppPageShell>
      <header className="border-border/60 mb-8 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {section.label}
        </h1>
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">
            /products/{product.slug}/brand/{section.slug}
          </code>
          <Badge variant="secondary">{product.label} Brand</Badge>
        </div>
        {content ? (
          <p className="text-foreground/90 mt-4 max-w-2xl text-base font-medium md:text-lg">
            {content.tagline}
          </p>
        ) : null}
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {content?.summary ?? section.description}
        </p>
      </header>

      {content ? (
        <div className="space-y-10">
          {sectionSlug === "logo" ? <BrandLogoShowcase /> : null}

          <section>
            <h2 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-[0.16em] uppercase">
              Principles
            </h2>
            <ul className="space-y-2">
              {content.principles.map((principle) => (
                <li
                  key={principle}
                  className="text-foreground/90 flex gap-3 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="bg-primary/70 mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </section>

          {content.guidelines ? (
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="border-border/60 rounded-lg border p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" /> Do
                </h3>
                <ul className="space-y-2">
                  {content.guidelines.do.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-border/60 rounded-lg border p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                  <X className="size-4" /> Don&apos;t
                </h3>
                <ul className="space-y-2">
                  {content.guidelines.dont.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No brand guidance is wired for the {product.label} workspace yet. Add a{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {product.id}
          </code>{" "}
          entry in{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            src/data/branding.ts
          </code>
          .
        </p>
      )}
    </AppPageShell>
  );
}
