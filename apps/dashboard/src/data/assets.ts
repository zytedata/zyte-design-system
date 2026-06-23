import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ProductId } from "@/data/products";

// Brand assets ship inside each `@zytedata/ds-<slug>` package under
// `assets/` (logos, ribbons, illustrations, icons). Same workspace-relative
// read strategy as templates/docs: prefer `dist/assets` (what a registry
// dashboard ships), fall back to `src/assets` (source of truth in-workspace).
//
// Filename convention encodes variants: `<group>.<variant>.<ext>` groups into
// a single asset with a switcher (e.g. `logo.primary.svg`, `logo.reversed.svg`).
// A plain `<name>.<ext>` is a single-variant asset (e.g. `hero-ribbon.svg`).
const DASHBOARD_ROOT = process.cwd();
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, "..", "..");

const SLUG_BY_PRODUCT_ID: Record<ProductId, string> = {
  web: "web",
  core: "core",
  scrapy: "scrapy",
  extractSummit: "extract-summit",
};

function assetDirs(productId: ProductId): string[] {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return [];
  const root = path.join(WORKSPACE_ROOT, "packages", slug);
  return [path.join(root, "dist", "assets"), path.join(root, "src", "assets")];
}

const EXT_KIND: Record<string, "svg" | "raster"> = {
  ".svg": "svg",
  ".png": "raster",
  ".jpg": "raster",
  ".jpeg": "raster",
  ".webp": "raster",
  ".gif": "raster",
};

const RASTER_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export type AssetVariant = {
  /** Variant key from the filename (`primary`, `reversed`, …) or `default`. */
  id: string;
  /** Human label shown on the switcher. */
  label: string;
  filename: string;
  ext: string;
  kind: "svg" | "raster";
  /** Inline source for SVGs (rendered directly); null for raster. */
  svg: string | null;
  /** A `src`/`href`-ready data URI for preview + download. */
  dataUri: string;
  /** Suggested preview backdrop so light-on-dark variants stay legible. */
  background: "light" | "dark";
};

export type Asset = {
  /** Group id derived from the filename. */
  id: string;
  /** Human title (kebab → Title Case). */
  title: string;
  variants: AssetVariant[];
};

function titleFromId(id: string): string {
  return id
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const VARIANT_LABELS: Record<string, string> = {
  primary: "Primary (ink)",
  reversed: "Reversed (white)",
  hero: "Hero (gradient)",
  mono: "Monochrome",
  fuchsia: "Brand fuchsia",
  default: "Default",
};

// Variants that read as light marks → preview on a dark backdrop.
const DARK_BACKDROP_VARIANTS = new Set(["reversed", "hero", "white"]);

// Stable display order for known logo variants; unknowns sort after, by label.
const VARIANT_ORDER = ["primary", "reversed", "hero", "mono", "fuchsia", "default"];

async function firstExistingDir(productId: ProductId): Promise<string | null> {
  for (const dir of assetDirs(productId)) {
    try {
      if ((await fs.stat(dir)).isDirectory()) return dir;
    } catch {
      // try next
    }
  }
  return null;
}

async function readVariant(
  dir: string,
  filename: string,
  variantId: string,
): Promise<AssetVariant | null> {
  const ext = path.extname(filename).toLowerCase();
  const kind = EXT_KIND[ext];
  if (!kind) return null;
  const base: Omit<AssetVariant, "svg" | "dataUri"> = {
    id: variantId,
    label: VARIANT_LABELS[variantId] ?? titleFromId(variantId),
    filename,
    ext,
    kind,
    background: DARK_BACKDROP_VARIANTS.has(variantId) ? "dark" : "light",
  };
  try {
    if (kind === "svg") {
      const svg = await fs.readFile(path.join(dir, filename), "utf-8");
      return { ...base, svg, dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` };
    }
    const buf = await fs.readFile(path.join(dir, filename));
    const mime = RASTER_MIME[ext] ?? "application/octet-stream";
    return { ...base, svg: null, dataUri: `data:${mime};base64,${buf.toString("base64")}` };
  } catch {
    return null;
  }
}

/** List every brand asset for a product, grouping `<group>.<variant>` files. */
export async function listAssets(productId: ProductId): Promise<Asset[]> {
  const dir = await firstExistingDir(productId);
  if (!dir) return [];

  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const groups = new Map<string, AssetVariant[]>();
  for (const filename of entries) {
    const ext = path.extname(filename).toLowerCase();
    if (!EXT_KIND[ext]) continue;
    const base = filename.slice(0, filename.length - ext.length);
    const dot = base.indexOf(".");
    const groupId = dot === -1 ? base : base.slice(0, dot);
    const variantId = dot === -1 ? "default" : base.slice(dot + 1);

    const variant = await readVariant(dir, filename, variantId);
    if (!variant) continue;
    const list = groups.get(groupId) ?? [];
    list.push(variant);
    groups.set(groupId, list);
  }

  const rank = (id: string) => {
    const i = VARIANT_ORDER.indexOf(id);
    return i === -1 ? VARIANT_ORDER.length : i;
  };

  const assets: Asset[] = [...groups.entries()].map(([id, variants]) => ({
    id,
    title: titleFromId(id),
    variants: variants.sort(
      (a, b) => rank(a.id) - rank(b.id) || a.label.localeCompare(b.label),
    ),
  }));

  return assets.sort((a, b) => a.title.localeCompare(b.title));
}
