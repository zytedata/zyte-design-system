import { notFound } from "next/navigation";

import type { ProductDocumentation } from "@zyte/ds-types";
import { CORE_DOCUMENTATION } from "@zyte/ds-core";
import { EXTRACT_SUMMIT_DOCUMENTATION } from "@zyte/ds-extract-summit";
import { SCRAPY_DOCUMENTATION } from "@zyte/ds-scrapy";
import { WEB_DOCUMENTATION } from "@zyte/ds-web";

import { Badge } from "@/components/ui/badge";
import { DevOnboarding } from "@/components/products/dev-onboarding";
import {
  DocumentationSidenav,
  type DocNavGroup,
} from "@/components/products/documentation-sidenav";
import { readPackageVersion } from "@/data/foundations/docs";
import { type ProductId, PRODUCT_LIST, getProductBySlug } from "@/data/products";

const GET_STARTED_ANCHOR = "get-started";

type RouteParams = { productId: string };

const DOCS_BY_PRODUCT: Record<ProductId, ProductDocumentation> = {
  web: WEB_DOCUMENTATION,
  core: CORE_DOCUMENTATION,
  scrapy: SCRAPY_DOCUMENTATION,
  extractSummit: EXTRACT_SUMMIT_DOCUMENTATION,
};

// Placeholder URLs — wired to the live monorepo path. Update when we move
// to a public-facing repo or a registry web UI different from GitHub
// Packages. The dashboard surfaces these so newcomers can deep-link from
// the docs to the actual source/spec/registry.
const REPO_URL = "https://github.com/ajaneczko/zyte-design-system-nextjs";

function buildLinks(productSlug: string) {
  return {
    source: `${REPO_URL}/tree/main/packages/${productSlug}`,
    registry: `${REPO_URL}/pkgs/npm/ds-${productSlug}`,
    foundations: `/products/${productSlug}/foundations`,
    changelog: `/products/${productSlug}/changelog`,
    designMd: `/products/${productSlug}/foundations/design-md`,
    releasing: `${REPO_URL}/blob/main/.github/RELEASING.md`,
  };
}

export function generateStaticParams() {
  return PRODUCT_LIST.filter((p) => p.capabilities.documentation.enabled).map(
    (product) => ({ productId: product.slug }),
  );
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Documentation" };
  return {
    title: `${product.label} documentation`,
    description: `How the ${product.label} design system works: scope, workflow, consumer integration and conventions.`,
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

  const doc = DOCS_BY_PRODUCT[product.id];
  const version = await readPackageVersion(product.id);
  const packageName = `@zyte/ds-${product.slug}`;
  const links = buildLinks(product.slug);

  const navGroups: DocNavGroup[] = [
    {
      label: "Quick start",
      items: [{ id: GET_STARTED_ANCHOR, title: "Get started" }],
    },
    {
      label: "On this page",
      items: doc.sections.map((section) => ({
        id: section.id,
        title: section.title,
      })),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-10 pb-20 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DocumentationSidenav groups={navGroups} />
        </aside>

        <div className="min-w-0">
          <header className="max-w-3xl">
            <Badge variant="secondary">{product.label} documentation</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              How {product.label} works
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {doc.intro}
            </p>
            {doc.audience?.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  For
                </span>
                {doc.audience.map((a) => (
                  <Badge key={a} variant="outline" className="font-normal">
                    {a}
                  </Badge>
                ))}
              </div>
            ) : null}
          </header>

          <section
            id={GET_STARTED_ANCHOR}
            className="mt-8 scroll-mt-24"
            aria-label="Get started"
          >
            <DevOnboarding
              productLabel={product.label}
              productSlug={product.slug}
              packageName={packageName}
              version={version}
              links={links}
            />
          </section>

          <div className="mt-10 space-y-6">
            {doc.sections.map((section) => (
              <DocSectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocSectionCard({ section }: { section: ProductDocumentation["sections"][number] }) {
  return (
    <article id={section.id} className="bg-card scroll-mt-24 rounded-2xl border p-6">
      <h2 className="text-lg font-semibold">{section.title}</h2>

      {section.body ? (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {section.body}
        </p>
      ) : null}

      {section.bullets?.length ? (
        <ul className="text-muted-foreground mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.steps?.length ? (
        <ol className="mt-4 space-y-3">
          {section.steps.map((step, idx) => (
            <li key={`${section.id}-step-${idx}`} className="bg-muted/30 rounded-xl p-4">
              {step.heading ? (
                <p className="text-foreground text-sm font-medium">{step.heading}</p>
              ) : null}
              <p
                className={`text-muted-foreground text-sm leading-relaxed${
                  step.heading ? " mt-1.5" : ""
                }`}
              >
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      {section.code ? (
        <pre className="bg-muted/40 mt-4 overflow-auto rounded-xl border p-4 font-mono text-[12px] leading-relaxed">
          <code>{section.code.content}</code>
        </pre>
      ) : null}

      {section.callout ? (
        <CalloutBlock callout={section.callout} />
      ) : null}
    </article>
  );
}

function CalloutBlock({
  callout,
}: {
  callout: NonNullable<ProductDocumentation["sections"][number]["callout"]>;
}) {
  const toneClass =
    callout.tone === "warning"
      ? "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300"
      : callout.tone === "tip"
        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
        : "border-sky-500/40 bg-sky-500/5 text-sky-700 dark:text-sky-300";

  return (
    <div className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed ${toneClass}`}>
      {callout.title ? (
        <p className="font-semibold">{callout.title}</p>
      ) : null}
      <p className={callout.title ? "mt-1" : undefined}>{callout.body}</p>
    </div>
  );
}
