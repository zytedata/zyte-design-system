/**
 * Brand navigation sections.
 *
 * Unlike Foundations (whose sections are derived from each product's token
 * bundle), Brand sections are a fixed editorial set shared across products.
 * Keep this list as the single source of truth — the sidebar sub-navigation,
 * the `/products/[productId]/brand/[section]` route and breadcrumbs all read
 * from here.
 */
export type BrandSection = {
  /** URL slug used in `/products/[productId]/brand/[slug]`. */
  slug: string;
  /** Sidebar + page heading label. */
  label: string;
  /** Short intro shown at the top of the section page. */
  description: string;
};

export const BRAND_SECTIONS: BrandSection[] = [
  {
    slug: "overview",
    label: "Overview",
    description:
      "What the Zyte brand stands for and how the pieces in this section fit together — the starting point before diving into logo, voice or visual language.",
  },
  {
    slug: "logo",
    label: "Logo",
    description:
      "The Zyte logo: primary and secondary lockups, clear space, minimum sizes, approved color treatments and the misuses to avoid.",
  },
  {
    slug: "mark",
    label: "Mark",
    description:
      "The standalone gradient mark — the alternative to the wordmark for favicons, app icons, avatars and tight or square spaces.",
  },
  {
    slug: "voice-and-tone",
    label: "Voice & Tone",
    description:
      "How Zyte sounds in writing — personality, tone shifts across contexts, and editorial dos and don'ts for product and marketing copy.",
  },
  {
    slug: "visual-language",
    label: "Visual Language",
    description:
      "The visual building blocks of the brand: color usage, typography in context, imagery, iconography, motion and layout rhythm.",
  },
  {
    slug: "product-expression",
    label: "Product Expression",
    description:
      "How the brand shows up inside the product surfaces — applying tokens and visual language to real UI without diluting the brand.",
  },
  {
    slug: "ai-agentic-expression",
    label: "AI / Agentic Expression",
    description:
      "How the brand is expressed in AI and agentic experiences — assistant personality, agent UI patterns and guidance for generated output.",
  },
  {
    slug: "asset-usage",
    label: "Asset Usage",
    description:
      "Where to find brand assets and how to use them — downloads, licensing, partner and co-branding rules, and request channels.",
  },
];

export function findBrandSectionBySlug(slug: string): BrandSection | null {
  return BRAND_SECTIONS.find((section) => section.slug === slug) ?? null;
}

export function defaultBrandSection(): BrandSection {
  return BRAND_SECTIONS[0]!;
}
