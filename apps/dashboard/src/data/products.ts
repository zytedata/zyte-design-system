import type { LucideIcon } from "lucide-react";
import { Code, Cog, Globe, Zap } from "lucide-react";

import type { DsCategory, ProductFoundations } from "@zyte/ds-types";
import { WEB_FOUNDATIONS, WEB_COMPONENT_CATEGORIES } from "@zyte/ds-web";
import { CORE_FOUNDATIONS, CORE_COMPONENT_CATEGORIES } from "@zyte/ds-core";
import { SCRAPY_FOUNDATIONS } from "@zyte/ds-scrapy";
import { EXTRACT_SUMMIT_FOUNDATIONS } from "@zyte/ds-extract-summit";

export type ProductId = "web" | "core" | "scrapy" | "extractSummit";

export const DEFAULT_PRODUCT_ID: ProductId = "web";

export type NavGroupId = "overview" | "library" | "workflow" | "reference";

export type ProductNavItem = {
  label: string;
  href: string;
  matchExact?: boolean;
  externalUrl?: string;
  group: NavGroupId;
};

export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "library", label: "Library" },
  { id: "workflow", label: "Workflow" },
  { id: "reference", label: "Reference" },
];

export type ComponentsCapability =
  | { enabled: false }
  | {
      enabled: true;
      categories: DsCategory[];
      defaultSlug: string;
    };

export type ProductCapabilities = {
  foundations: { enabled: true; bundle: ProductFoundations };
  components: ComponentsCapability;
  templates: { enabled: boolean };
  prototyping: { enabled: boolean };
  documentation: { enabled: boolean; href?: string };
  assets: { enabled: boolean; href?: string };
};

export type Product = {
  id: ProductId;
  /** URL-safe id used in `/products/[slug]`. */
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Accent token used for landing/about cards. */
  accent: "pink" | "indigo" | "amber" | "lime";
  nav: ProductNavItem[];
  capabilities: ProductCapabilities;
};

const WEB_NAV: ProductNavItem[] = [
  { group: "overview", label: "Dashboard", href: "/products/web", matchExact: true },
  { group: "library", label: "Foundations", href: "/products/web/foundations" },
  { group: "library", label: "Templates", href: "/products/web/templates" },
  { group: "library", label: "Assets", href: "/products/web/assets" },
  { group: "workflow", label: "Prototyping", href: "/products/web/prototyping" },
  {
    group: "reference",
    label: "Documentation",
    href: "/products/web/documentation",
    matchExact: true,
  },
  {
    group: "reference",
    label: "Changelog",
    href: "/products/web/changelog",
    matchExact: true,
  },
];

const CORE_NAV: ProductNavItem[] = [
  { group: "overview", label: "Dashboard", href: "/products/core", matchExact: true },
  { group: "library", label: "Foundations", href: "/products/core/foundations" },
  {
    group: "workflow",
    label: "Protozyte",
    href: "/products/core/prototyping",
  },
  {
    group: "reference",
    label: "Documentation",
    href: "/products/core/documentation",
    matchExact: true,
  },
  {
    group: "reference",
    label: "Changelog",
    href: "/products/core/changelog",
    matchExact: true,
  },
];

const SCRAPY_NAV: ProductNavItem[] = [
  { group: "overview", label: "Dashboard", href: "/products/scrapy", matchExact: true },
  { group: "library", label: "Foundations", href: "/products/scrapy/foundations" },
  {
    group: "reference",
    label: "Documentation",
    href: "/products/scrapy/documentation",
    matchExact: true,
  },
  {
    group: "reference",
    label: "Changelog",
    href: "/products/scrapy/changelog",
    matchExact: true,
  },
];

const EXTRACT_SUMMIT_NAV: ProductNavItem[] = [
  { group: "overview", label: "Dashboard", href: "/products/extract-summit", matchExact: true },
  { group: "library", label: "Foundations", href: "/products/extract-summit/foundations" },
  {
    group: "reference",
    label: "Documentation",
    href: "/products/extract-summit/documentation",
    matchExact: true,
  },
  {
    group: "reference",
    label: "Changelog",
    href: "/products/extract-summit/changelog",
    matchExact: true,
  },
];

export const PRODUCTS: Record<ProductId, Product> = {
  web: {
    id: "web",
    slug: "web",
    label: "Web",
    description: "Web product workspace for design system exploration and implementation.",
    icon: Globe,
    accent: "pink",
    nav: WEB_NAV,
    capabilities: {
      foundations: { enabled: true, bundle: WEB_FOUNDATIONS },
      components: {
        enabled: true,
        categories: WEB_COMPONENT_CATEGORIES,
        defaultSlug: "tag",
      },
      templates: { enabled: true },
      prototyping: { enabled: true },
      documentation: { enabled: true, href: "/products/web/documentation" },
      assets: { enabled: true, href: "/products/web/assets" },
    },
  },

  core: {
    id: "core",
    slug: "core",
    label: "Core",
    description: "Core product architecture docs with component and prototype references.",
    icon: Cog,
    accent: "indigo",
    nav: CORE_NAV,
    capabilities: {
      foundations: { enabled: true, bundle: CORE_FOUNDATIONS },
      components: {
        enabled: true,
        categories: CORE_COMPONENT_CATEGORIES,
        defaultSlug: "button",
      },
      templates: { enabled: false },
      prototyping: { enabled: false },
      documentation: { enabled: true, href: "/products/core/documentation" },
      assets: { enabled: false },
    },
  },

  scrapy: {
    id: "scrapy",
    slug: "scrapy",
    label: "Scrapy",
    description: "Scrapy-focused workspace with foundations and component patterns.",
    icon: Code,
    accent: "amber",
    nav: SCRAPY_NAV,
    capabilities: {
      foundations: { enabled: true, bundle: SCRAPY_FOUNDATIONS },
      components: { enabled: false },
      templates: { enabled: false },
      prototyping: { enabled: false },
      documentation: { enabled: true, href: "/products/scrapy/documentation" },
      assets: { enabled: false },
    },
  },

  extractSummit: {
    id: "extractSummit",
    slug: "extract-summit",
    label: "Extract Summit",
    description: "Extract Summit workspace for shared foundations and UI building blocks.",
    icon: Zap,
    accent: "lime",
    nav: EXTRACT_SUMMIT_NAV,
    capabilities: {
      foundations: { enabled: true, bundle: EXTRACT_SUMMIT_FOUNDATIONS },
      components: { enabled: false },
      templates: { enabled: false },
      prototyping: { enabled: false },
      documentation: { enabled: true, href: "/products/extract-summit/documentation" },
      assets: { enabled: false },
    },
  },
};

/** Iteration-friendly list — order matches the topbar product switcher. */
export const PRODUCT_LIST: Product[] = (
  ["web", "core", "scrapy", "extractSummit"] satisfies ProductId[]
).map((id) => PRODUCTS[id]);

const SLUG_TO_ID: Record<string, ProductId> = Object.fromEntries(
  PRODUCT_LIST.map((p) => [p.slug, p.id]),
) as Record<string, ProductId>;

export function isProductSlug(slug: string): boolean {
  return slug in SLUG_TO_ID;
}

export function getProductBySlug(slug: string): Product | null {
  const id = SLUG_TO_ID[slug];
  return id ? PRODUCTS[id] : null;
}

export function getProductById(id: ProductId): Product {
  return PRODUCTS[id];
}
