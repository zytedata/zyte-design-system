import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/data/products";
import { readTemplate } from "@/data/templates";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { Badge } from "@/components/ui/badge";
import { TemplateViewer } from "@/components/templates/template-viewer";

type RouteParams = { productId: string; docId: string };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { productId, docId } = await params;
  const product = getProductBySlug(productId);
  if (!product) return { title: `Template · ${docId}` };
  const template = await readTemplate(product.id, docId);
  return {
    title: template
      ? `${product.label} · ${template.title}`
      : `${product.label} · template ${docId}`,
  };
}

export default async function ProductTemplateDocPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { productId, docId } = await params;
  const product = getProductBySlug(productId);
  if (!product) notFound();

  const template = await readTemplate(product.id, docId);
  if (!template) notFound();

  return (
    <AppPageShell>
      <Link
        href={`/products/${product.slug}/templates`}
        className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
      >
        ← {product.label} templates
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight capitalize">
          {template.title}
        </h1>
        <Badge variant="outline" className="capitalize">
          {template.status}
        </Badge>
      </div>
      {template.summary ? (
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
          {template.summary}
        </p>
      ) : null}

      <TemplateViewer
        title={template.title}
        html={template.html}
        markdown={template.markdown}
        baseMarkdown={template.baseMarkdown}
        rawMarkdown={template.raw}
        filename={`${template.id}.md`}
      />
    </AppPageShell>
  );
}
