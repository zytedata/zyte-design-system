import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CircleDot,
  GitBranch,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import {
  buildProductDocLinks,
  getPackageName,
} from "@/data/documentation";
import { getChangelogs, getFoundations } from "@/data/foundations";
import { readCanonicalDoc, readPackageVersion } from "@/data/foundations/docs";
import {
  EXTRACT_SUMMIT_CORE_PRINCIPLES,
  EXTRACT_SUMMIT_DESIGN_LAYERS,
  EXTRACT_SUMMIT_DIRECTION,
  EXTRACT_SUMMIT_GUARDRAILS,
} from "@zytedata/ds-extract-summit";
import {
  buildProductStats,
  kindLabel,
  lastUpdatedDate,
  previewPalette,
  recentChanges,
} from "@/lib/product-stats";
import { cn } from "@/lib/utils";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";
import { DashboardTabs } from "@/components/products/dashboard-tabs";
import { GettingStarted } from "@/components/products/getting-started";
import {
  JourneyCard,
  accentForIndex,
  descriptionForLabel,
} from "@/components/products/journey-card";
import type { FileChangeKind } from "@zytedata/ds-types";

type RouteParams = { productId: string };

const KIND_ICON: Record<FileChangeKind, LucideIcon> = {
  added: Plus,
  changed: PenLine,
  removed: Trash2,
  fixed: CircleDot,
};

const KIND_TONE: Record<FileChangeKind, string> = {
  added:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  changed: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  removed: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  fixed: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

const ACCENT_BADGE: Record<string, string> = {
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
};

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Product" };
  return {
    title: `${product.label} dashboard`,
    description: product.description,
  };
}

export default async function ProductDashboardPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) {
    notFound();
  }

  const changelogs = getChangelogs(product.id);
  const stats = buildProductStats(product, changelogs);
  const palette = previewPalette(product.capabilities.foundations.bundle);
  const recent = recentChanges(changelogs, 5);
  const lastUpdated = lastUpdatedDate(changelogs);
  const Icon = product.icon;

  const packageName = getPackageName(product.slug);
  const docLinks = buildProductDocLinks(product.slug);

  const bundle = getFoundations(product.id);
  const [packageVersion, canonicalDoc] = await Promise.all([
    readPackageVersion(product.id),
    bundle.canonicalDoc ? readCanonicalDoc(product.id) : Promise.resolve(null),
  ]);

  const journeyItems = product.nav.filter(
    (item) => item.label.toLowerCase() !== "dashboard",
  );

  const gettingStarted = (
    <GettingStarted
      productLabel={product.label}
      productSlug={product.slug}
      packageName={packageName}
      version={packageVersion}
      links={docLinks}
      capabilities={{
        prototyping: product.capabilities.prototyping.enabled,
        templates: product.capabilities.templates.enabled,
        documentation: product.capabilities.documentation.enabled,
        assets: product.capabilities.assets.enabled,
      }}
      designDoc={
        canonicalDoc
          ? { content: canonicalDoc.content, filename: canonicalDoc.filename }
          : null
      }
    />
  );

  return (
    <AppPageShell>
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-2xl",
                ACCENT_BADGE[product.accent],
              )}
              aria-hidden="true"
            >
              <Icon className="size-6" />
            </span>
            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                {product.label} workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {product.label} dashboard
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="text-muted-foreground flex flex-col gap-1.5 text-xs md:items-end">
          <span className="inline-flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            <span>main</span>
            <span aria-hidden="true">·</span>
            <span>not synced (mock)</span>
          </span>
          {lastUpdated ? (
            <span>Last data update: {lastUpdated}</span>
          ) : (
            <span>No tracked file updates yet.</span>
          )}
        </div>
      </header>

      <DashboardTabs
        gettingStarted={gettingStarted}
        overview={
          <>
      <section
        aria-label="Product summary"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <article
            key={stat.key}
            className="bg-card rounded-2xl border p-5"
          >
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            {stat.hint ? (
              <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <article className="bg-card rounded-2xl border p-6">
            <header className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Recent activity</h2>
                <p className="text-muted-foreground text-xs">
                  Latest entries from {changelogs.length} tracked file
                  {changelogs.length === 1 ? "" : "s"}.
                </p>
              </div>
              <Link
                href={`/products/${product.slug}/changelog`}
                className="text-foreground inline-flex items-center gap-1 text-xs font-medium hover:underline"
              >
                View changelog
                <ArrowUpRight className="size-3.5" />
              </Link>
            </header>

            <ol className="mt-5 space-y-4">
              {recent.length === 0 ? (
                <li className="text-muted-foreground text-sm">
                  No changelog entries yet.
                </li>
              ) : (
                recent.map((entry, index) => {
                  const KIcon = KIND_ICON[entry.kind];
                  return (
                    <li
                      key={`${entry.file}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                          KIND_TONE[entry.kind],
                        )}
                        aria-hidden="true"
                      >
                        <KIcon className="size-3" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-sm font-medium">
                            {kindLabel(entry.kind)}
                          </span>
                          <code className="text-muted-foreground rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                            {entry.file}
                          </code>
                          <span className="text-muted-foreground text-xs">
                            {entry.date} · {entry.author}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                          {entry.message}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ol>
          </article>
        </div>

        <aside className="space-y-6">
          {palette ? (
            <article className="bg-card rounded-2xl border p-6">
              <header className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Primary palette</h2>
                  <p className="text-muted-foreground text-xs">
                    <code className="font-mono">{palette.paletteId}</code> ·{" "}
                    {palette.shades.length} shades
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}/foundations`}
                  className="text-foreground inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Foundations
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </header>
              <div className="mt-5 grid grid-cols-5 gap-1.5">
                {palette.shades.map(({ shade, hex }) => (
                  <div
                    key={shade}
                    className="flex flex-col items-center gap-1.5"
                    title={`${palette.paletteId}/${shade} · ${hex}`}
                  >
                    <span
                      className="ring-border/60 inline-block size-9 rounded-lg ring-1"
                      style={{ background: hex }}
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          <article className="bg-card rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Capabilities</h2>
            <p className="text-muted-foreground text-xs">
              Surfaces enabled for {product.label}.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {(
                [
                  ["Foundations", product.capabilities.foundations.enabled],
                  ["Components", product.capabilities.components.enabled],
                  ["Templates", product.capabilities.templates.enabled],
                  ["Prototyping", product.capabilities.prototyping.enabled],
                  ["Documentation", product.capabilities.documentation.enabled],
                  ["Assets", product.capabilities.assets.enabled],
                ] as const
              ).map(([name, enabled]) => (
                <li
                  key={name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-muted-foreground">{name}</span>
                  <Badge variant={enabled ? "default" : "outline"}>
                    {enabled ? "Enabled" : "Off"}
                  </Badge>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="mt-12">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Quick navigation</h2>
            <p className="text-muted-foreground text-xs">
              Jump into any {product.label} surface.
            </p>
          </div>
        </header>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journeyItems.map((item, index) => (
            <JourneyCard
              key={item.label}
              item={item}
              description={descriptionForLabel(item, product.label)}
              accent={accentForIndex(product.id, index)}
            />
          ))}
        </div>
      </section>

      {product.id === "extractSummit" ? (
        <section id="extract-summit-architecture" className="mt-16 space-y-6">
          <header className="max-w-3xl">
            <Badge variant="secondary" className="mb-3">
              Extract Summit canonical spec
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Brand DNA &amp; design intent
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Source of truth: <code>src/assets/agentic-docs/extract-summit.md</code> (DESIGN.md
              alpha v1.0). Use this section to brief humans; agents should read the canonical spec
              directly from the Foundations → Agentic surface.
            </p>
          </header>

          <article className="bg-card rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Brand DNA</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <strong className="font-medium">Direction:</strong>{" "}
                {EXTRACT_SUMMIT_DIRECTION.direction}
              </li>
              <li>
                <strong className="font-medium">Concept:</strong> {EXTRACT_SUMMIT_DIRECTION.concept}
              </li>
              <li>
                <strong className="font-medium">Audience:</strong>{" "}
                {EXTRACT_SUMMIT_DIRECTION.audience}
              </li>
              <li>
                <strong className="font-medium">Voice:</strong> {EXTRACT_SUMMIT_DIRECTION.voice}
              </li>
            </ul>
          </article>

          <article className="bg-card rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Core principles</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {EXTRACT_SUMMIT_CORE_PRINCIPLES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="bg-card rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Design implementation layers</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {EXTRACT_SUMMIT_DESIGN_LAYERS.map((layer) => (
                <div key={layer.title} className="bg-muted/30 rounded-xl p-4">
                  <h4 className="font-medium">{layer.title}</h4>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {layer.details}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-card rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Hard constraints (do not violate)</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {EXTRACT_SUMMIT_GUARDRAILS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      ) : null}
          </>
        }
      />
    </AppPageShell>
  );
}
