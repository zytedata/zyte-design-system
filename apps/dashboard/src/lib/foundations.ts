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
  accentSecondary: "Accent Secondary (Orange)",
  accentSecondaryPurple: "Accent Secondary (Cold)",
  surface: "Surface",
  ink: "Ink",
  ghost: "Ghost Letterforms",
  status: "Status",
  neutral: "Neutral",
  surfaceDark: "Surface (dark)",
  surfaceLight: "Surface (light)",
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

const CORE_SECTIONS: FoundationSection[] = [
  { id: "tailwindColors", slug: "tailwind-colors", label: "Tailwind Colors", group: "core" },
  { id: "icons", slug: "icons-lucide", label: "Icons (Lucide)", group: "core" },
  { id: "spacing", slug: "spacing", label: "Spacing", group: "core" },
  { id: "sizing", slug: "sizing", label: "Sizing", group: "core" },
  { id: "typography", slug: "typography", label: "Typography", group: "core" },
  { id: "radiusShadows", slug: "radius-shadows", label: "Radius & Shadows", group: "core" },
  { id: "breakpoints", slug: "breakpoints", label: "Breakpoints", group: "core" },
  { id: "opacityZindex", slug: "opacity-z-index", label: "Opacity & Z-Index", group: "core" },
];

/** Sidebar: `surfaceDark` / `surfaceLight` immediately after `neutral` when present. */
export function orderedPaletteIds(bundle: ProductFoundations): string[] {
  const keys = Object.keys(bundle.colors);
  const surfacePaletteIds = (["surfaceDark", "surfaceLight"] as const).filter((id) =>
    keys.includes(id),
  );
  if (surfacePaletteIds.length === 0) {
    return keys;
  }
  const rest = keys.filter((id) => id !== "surfaceDark" && id !== "surfaceLight");
  const neutralIdx = rest.indexOf("neutral");
  if (neutralIdx === -1) {
    return [...rest, ...surfacePaletteIds];
  }
  return [
    ...rest.slice(0, neutralIdx + 1),
    ...surfacePaletteIds,
    ...rest.slice(neutralIdx + 1),
  ];
}

/** Token surface Colors: same as foundations key order but `surfaceDark` / `surfaceLight` always last. */
export function orderedPaletteIdsSurfacesLast(bundle: ProductFoundations): string[] {
  const keys = Object.keys(bundle.colors);
  const surfacePaletteIds = (["surfaceDark", "surfaceLight"] as const).filter((id) =>
    keys.includes(id),
  );
  if (surfacePaletteIds.length === 0) {
    return keys;
  }
  const rest = keys.filter((id) => id !== "surfaceDark" && id !== "surfaceLight");
  return [...rest, ...surfacePaletteIds];
}

export function buildFoundationSections(bundle: ProductFoundations): FoundationSection[] {
  const paletteSections: FoundationSection[] = orderedPaletteIds(bundle).map((id) => ({
    id,
    slug: paletteIdToSlug(id),
    label: paletteLabelFor(id),
    group: "palette",
  }));

  // Order must match the sidebar's GROUP_ORDER (palette → core) so that
  // `defaultSectionFor` (which returns index 0) lands on the same section the user
  // sees at the top of the sidebar. The agentic/design.md view is now a
  // top-level nav item (`/products/<slug>/agentic`), not a foundations section.
  return [...paletteSections, ...CORE_SECTIONS];
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
