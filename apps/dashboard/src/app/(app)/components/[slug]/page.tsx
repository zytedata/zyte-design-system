import { CORE_COMPONENT_CATEGORIES } from "@zytedata/ds-core";
import { WEB_COMPONENT_CATEGORIES } from "@zytedata/ds-web";

import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";

type RouteParams = { slug: string };

const ALL_ITEMS = [
  ...CORE_COMPONENT_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({ ...item, category: c.title, productLabel: "Core" })),
  ),
  ...WEB_COMPONENT_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({ ...item, category: c.title, productLabel: "Web" })),
  ),
];

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const item of ALL_ITEMS) slugs.add(item.slug);
  ["wip", "wip-documentation", "wip-protozyte"].forEach((slug) => slugs.add(slug));
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const item = ALL_ITEMS.find((i) => i.slug === slug);
  return { title: item ? `${item.label} component` : "Component" };
}

export default async function ComponentPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const item = ALL_ITEMS.find((i) => i.slug === slug);
  const isWip = !item || slug.startsWith("wip");

  return (
    <AppPageShell>
      {isWip ? (
        <div className="max-w-2xl space-y-3">
          <Badge variant="secondary">Work in progress</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Component catalog placeholder</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This product&apos;s component catalog is still being migrated. The published catalogs
            ship with Web and Core; Scrapy and Extract Summit currently ship foundations only.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <Badge variant="secondary">
            {item.productLabel} · {item.category}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{item.label}</h1>
          <p className="text-muted-foreground text-sm">
            Slug:{" "}
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
              {item.slug}
            </code>
          </p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Reusable building block in the {item.productLabel} catalog. Detailed usage notes, props,
            theme controls and live previews live in the original Angular Docs Layout — recreate per
            component as content is migrated.
          </p>
          {!item.implemented ? (
            <Badge variant="outline" className="mt-4">
              Not yet implemented
            </Badge>
          ) : null}
        </div>
      )}
    </AppPageShell>
  );
}
