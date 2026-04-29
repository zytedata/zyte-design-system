import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Box,
  ExternalLink,
  FlaskConical,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutTemplate,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductNavItem } from "@/data/products";

type JourneyAccent = "pink" | "indigo" | "amber" | "lime" | "teal" | "violet" | "sky" | "rose";

const ACCENT_BG: Record<JourneyAccent, string> = {
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const ICON_MAP = {
  foundations: Layers,
  components: Box,
  templates: LayoutTemplate,
  prototyping: Wand2,
  documentation: BookOpen,
  assets: ImageIcon,
  protozyte: FlaskConical,
  about: Info,
  external: ExternalLink,
} as const;

type JourneyIconName = keyof typeof ICON_MAP;

function iconForLabel(item: ProductNavItem): JourneyIconName {
  const label = item.label.toLowerCase();
  if (item.externalUrl) return "external";
  if (label.includes("foundation")) return "foundations";
  if (label.includes("component")) return "components";
  if (label.includes("template")) return "templates";
  if (label.includes("prototyp")) return "prototyping";
  if (label.includes("document")) return "documentation";
  if (label.includes("asset")) return "assets";
  if (label.includes("protozyte")) return "protozyte";
  return "about";
}

export type JourneyCardProps = {
  item: ProductNavItem;
  description: string;
  accent: JourneyAccent;
};

export function JourneyCard({ item, description, accent }: JourneyCardProps) {
  const iconKey = iconForLabel(item);
  const Icon: LucideIcon = ICON_MAP[iconKey];
  const isExternal = !!item.externalUrl;
  const href = item.externalUrl ?? item.href;

  const content = (
    <>
      <header className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl",
            ACCENT_BG[accent],
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>
        <span className="bg-muted text-muted-foreground inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
          {item.label}
        </span>
      </header>

      <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.label}</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>

      <span className="text-foreground mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
        Open {item.label}
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </>
  );

  const className =
    "group bg-card hover:bg-accent/40 hover:border-foreground/15 flex flex-col rounded-2xl border p-6 transition-colors";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

const ACCENT_PALETTES: Record<string, JourneyAccent[]> = {
  web: ["pink", "indigo", "sky", "amber", "rose", "violet"],
  core: ["indigo", "sky", "teal", "violet", "amber", "rose"],
  scrapy: ["amber", "rose", "teal", "sky"],
  extractSummit: ["lime", "rose", "amber", "violet"],
};

export function accentForIndex(productId: string, index: number): JourneyAccent {
  const palette = ACCENT_PALETTES[productId] ?? ACCENT_PALETTES.web;
  return palette[index % palette.length];
}

export function descriptionForLabel(item: ProductNavItem, productLabel: string): string {
  const label = item.label.toLowerCase();
  const product = productLabel;
  if (label.includes("foundation"))
    return `Color, typography, spacing, and motion tokens that define ${product}.`;
  if (label.includes("component"))
    return `Browse the published ${product} component catalog with usage guidance and code.`;
  if (label.includes("template"))
    return `Page-level templates and layout patterns assembled from ${product} components.`;
  if (label.includes("prototyp"))
    return `AI-assisted prototyping workspace tuned to ${product} foundations and components.`;
  if (label.includes("document"))
    return `Architecture notes, decision records, and onboarding for ${product}.`;
  if (label.includes("asset"))
    return `Logos, illustrations, and brand assets ready to drop into ${product} surfaces.`;
  if (label.includes("protozyte"))
    return `Protozyte playground — tinkerable patterns and experiments for ${product}.`;
  return `Entry point to ${item.label.toLowerCase()} for ${product} developers.`;
}
