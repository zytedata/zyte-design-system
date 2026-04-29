import type { FoundationColorRow, ProductFoundations } from "@zyte/ds-types";

/** kebab-case a camelCase palette key for use in URLs. */
export function paletteIdToSlug(paletteId: string): string {
  return paletteId.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Reverse of paletteIdToSlug. */
export function slugToPaletteId(slug: string, paletteIds: string[]): string | null {
  for (const id of paletteIds) {
    if (paletteIdToSlug(id) === slug) {
      return id;
    }
  }
  return null;
}

const PALETTE_LABELS: Record<string, string> = {
  primary: "Primary",
  accentPrimary: "Accent Primary",
  accentSecondary: "Accent Secondary (Warm)",
  accentSecondaryPurple: "Accent Secondary (Cold)",
  surface: "Surface",
  ink: "Ink",
  ghost: "Ghost Letterforms",
  status: "Status",
  neutral: "Neutral",
};

function titleCasePaletteId(id: string): string {
  return id
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function paletteLabelFor(paletteId: string): string {
  return PALETTE_LABELS[paletteId] ?? titleCasePaletteId(paletteId);
}

export type FoundationSectionGroup = "agentic" | "palette" | "core";

export type FoundationSection = {
  /** Internal id (palette id or static id). */
  id: string;
  /** URL slug. */
  slug: string;
  /** Sidebar label. */
  label: string;
  /** Sidebar group this section belongs to. */
  group: FoundationSectionGroup;
};

const STATIC_SECTIONS: FoundationSection[] = [
  { id: "agent", slug: "design-md", label: "LLM (Design.md)", group: "agentic" },
  { id: "tailwindColors", slug: "tailwind-colors", label: "Tailwind Colors", group: "core" },
  { id: "icons", slug: "icons-lucide", label: "Icons (Lucide)", group: "core" },
  { id: "spacing", slug: "spacing", label: "Spacing", group: "core" },
  { id: "sizing", slug: "sizing", label: "Sizing", group: "core" },
  { id: "typography", slug: "typography", label: "Typography", group: "core" },
  { id: "radiusShadows", slug: "radius-shadows", label: "Radius & Shadows", group: "core" },
  { id: "breakpoints", slug: "breakpoints", label: "Breakpoints", group: "core" },
  { id: "opacityZindex", slug: "opacity-z-index", label: "Opacity & Z-Index", group: "core" },
];

export function buildFoundationSections(bundle: ProductFoundations): FoundationSection[] {
  const paletteSections: FoundationSection[] = Object.keys(bundle.colors).map((id) => ({
    id,
    slug: paletteIdToSlug(id),
    label: paletteLabelFor(id),
    group: "palette",
  }));

  return [...paletteSections, ...STATIC_SECTIONS];
}

export function findSectionBySlug(
  bundle: ProductFoundations,
  slug: string,
): FoundationSection | null {
  return buildFoundationSections(bundle).find((s) => s.slug === slug) ?? null;
}

export function defaultSectionFor(bundle: ProductFoundations): FoundationSection {
  return buildFoundationSections(bundle)[0]!;
}

/** Convert a `{ shade: hex }` map into the row shape the foundation views expect. */
export function paletteRowsFor(
  bundle: ProductFoundations,
  paletteId: string,
): FoundationColorRow[] {
  const palette = bundle.colors[paletteId];
  if (!palette) return [];
  return Object.entries(palette).map(([shade, hex]) => ({
    name: `${paletteId}/${shade}`,
    hex,
    utility: /^\d+$/.test(shade)
      ? `text-${paletteId}-${shade} / bg-${paletteId}-${shade}`
      : `var(--${paletteId}-${shade})`,
  }));
}
