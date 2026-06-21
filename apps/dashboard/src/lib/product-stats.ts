import type { FileChangeEntry, FileChangelog, ProductFoundations } from "@zytedata/ds-types";
import type { Product } from "@/data/products";

export type FlatChangeEntry = FileChangeEntry & {
  file: string;
};

export type ProductStat = {
  key: string;
  label: string;
  value: string;
  hint?: string;
};

export function flattenChangelog(changelogs: FileChangelog[]): FlatChangeEntry[] {
  return changelogs.flatMap((changelog) =>
    changelog.entries.map((entry) => ({ ...entry, file: changelog.file })),
  );
}

export function recentChanges(
  changelogs: FileChangelog[],
  limit = 6,
): FlatChangeEntry[] {
  return flattenChangelog(changelogs)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}

export function changesInLast30Days(changelogs: FileChangelog[]): number {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return flattenChangelog(changelogs).filter((entry) => {
    const time = new Date(entry.date).getTime();
    return Number.isFinite(time) && time >= cutoff;
  }).length;
}

export function lastUpdatedDate(changelogs: FileChangelog[]): string | null {
  const dates = flattenChangelog(changelogs)
    .map((entry) => entry.date)
    .filter(Boolean)
    .sort();
  return dates.length ? dates[dates.length - 1]! : null;
}

export function countTokens(bundle: ProductFoundations): number {
  return (
    Object.keys(bundle.spacing).length +
    Object.keys(bundle.radius).length +
    Object.keys(bundle.shadow).length +
    Object.keys(bundle.breakpoint).length +
    Object.keys(bundle.opacity).length +
    Object.keys(bundle.zIndex).length +
    Object.keys(bundle.typography.size).length +
    Object.keys(bundle.typography.weight).length
  );
}

export function countComponents(product: Product): number {
  if (!product.capabilities.components.enabled) return 0;
  return product.capabilities.components.categories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );
}

export function buildProductStats(
  product: Product,
  changelogs: FileChangelog[],
): ProductStat[] {
  const bundle = product.capabilities.foundations.bundle;
  const paletteCount = Object.keys(bundle.colors).length;
  const tokenCount = countTokens(bundle);
  const componentCount = countComponents(product);
  const recentCount = changesInLast30Days(changelogs);

  return [
    {
      key: "palettes",
      label: "Color palettes",
      value: paletteCount.toString(),
      hint: `${Object.keys(bundle.semanticColors).length} semantic tokens`,
    },
    {
      key: "tokens",
      label: "Foundation tokens",
      value: tokenCount.toString(),
      hint: "spacing · radius · shadow · type · z-index",
    },
    {
      key: "components",
      label: "Components",
      value: product.capabilities.components.enabled
        ? componentCount.toString()
        : "—",
      hint: product.capabilities.components.enabled
        ? `${product.capabilities.components.categories.length} categories`
        : "Foundations only",
    },
    {
      key: "activity",
      label: "Updates · 30d",
      value: recentCount.toString(),
      hint: `${changelogs.length} files tracked`,
    },
  ];
}

export function previewPalette(bundle: ProductFoundations): {
  paletteId: string;
  shades: Array<{ shade: string; hex: string }>;
} | null {
  const paletteId =
    Object.keys(bundle.colors).find((id) => id === "primary") ??
    Object.keys(bundle.colors)[0];
  if (!paletteId) return null;
  const palette = bundle.colors[paletteId];
  if (!palette) return null;
  const shades = Object.entries(palette).map(([shade, hex]) => ({ shade, hex }));
  return { paletteId, shades };
}

const KIND_LABEL: Record<FileChangeEntry["kind"], string> = {
  added: "Added",
  changed: "Changed",
  removed: "Removed",
  fixed: "Fixed",
};

export function kindLabel(kind: FileChangeEntry["kind"]): string {
  return KIND_LABEL[kind];
}
