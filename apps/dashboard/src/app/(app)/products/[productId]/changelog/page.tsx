import { notFound } from "next/navigation";

import { PRODUCT_LIST, getProductBySlug } from "@/data/products";
import { getChangelogs } from "@/data/foundations";
import {
  flattenChangelog,
  changesInLast30Days,
  lastUpdatedDate,
} from "@/lib/product-stats";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";
import { ChangelogSection } from "@/components/foundations/sections";

type RouteParams = { productId: string };

export function generateStaticParams() {
  return PRODUCT_LIST.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: "Changelog" };
  return {
    title: `${product.label} changelog`,
    description: `Recent additions, fixes and changes across the ${product.label} workspace.`,
  };
}

export default async function ProductChangelogPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const changelogs = getChangelogs(product.id);
  const allEntries = flattenChangelog(changelogs);
  const recentCount = changesInLast30Days(changelogs);
  const lastUpdated = lastUpdatedDate(changelogs);

  return (
    <AppPageShell>
      <header className="border-border/60 mb-8 border-b pb-6">
        <Badge variant="secondary" className="mb-3">
          {product.label} workspace
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Changelog
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          Tracked additions, fixes and changes across the {product.label}{" "}
          workspace. Each tracked source file ships its own changelog beside its
          tokens / components / docs and surfaces here.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="bg-card rounded-2xl border p-4">
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Tracked files
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {changelogs.length}
            </dd>
          </div>
          <div className="bg-card rounded-2xl border p-4">
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Total entries
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {allEntries.length}
            </dd>
          </div>
          <div className="bg-card rounded-2xl border p-4">
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Last 30 days
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {recentCount}
            </dd>
          </div>
          <div className="bg-card rounded-2xl border p-4">
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Last update
            </dt>
            <dd className="mt-1 font-mono text-sm">
              {lastUpdated ?? "—"}
            </dd>
          </div>
        </dl>
      </header>

      <ChangelogSection changelogs={changelogs} productSlug={product.slug} />
    </AppPageShell>
  );
}
