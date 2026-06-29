import type { LucideIcon } from "lucide-react";
import { AppWindow, BarChart3, Mail, Megaphone } from "lucide-react";

export type UseCase = {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /**
   * Ready-to-paste starter prompt. The `{product}` token is replaced with the
   * product label at render time so the same template works for every product.
   */
  promptTemplate: string;
};

/**
 * Outcome-oriented starter prompts. Each pairs with the canonical `design.md`
 * (see the "Vibe coding" scenario) so an AI assistant produces a first draft
 * that already matches the design system.
 */
export const DEFAULT_USE_CASES: UseCase[] = [
  {
    key: "report",
    icon: BarChart3,
    title: "Report / analytics dashboard",
    description: "KPI cards, charts, and data tables — on-brand and ready to share.",
    promptTemplate:
      "Build a quarterly analytics report using the attached {product} design system spec (design.md). Include a page header with a title and date range, a row of KPI summary cards, a primary chart, and a sortable data table. Apply the design system's colours, typography, spacing, and component patterns throughout.",
  },
  {
    key: "marketing-landing",
    icon: Megaphone,
    title: "Marketing landing page",
    description: "Hero, feature sections, and a clear CTA in the brand voice.",
    promptTemplate:
      "Build a marketing landing page using the attached {product} design system spec (design.md). Include a hero with headline, subhead and primary CTA, a three-column feature section, a social-proof / logos strip, and a closing call to action. Match the brand's colours, typography, spacing, and tone.",
  },
  {
    key: "email",
    icon: Mail,
    title: "Email / newsletter",
    description: "An on-brand email template with tokens applied inline.",
    promptTemplate:
      "Build a responsive HTML email / newsletter template using the attached {product} design system spec (design.md). Include a logo header, a headline, a body section with one featured item, and a footer with unsubscribe. Apply the design tokens inline (email clients need inline styles) and keep the layout single-column and mobile-friendly.",
  },
  {
    key: "internal-tool",
    icon: AppWindow,
    title: "Internal tool / app UI",
    description: "Forms, settings, and list + detail screens from components.",
    promptTemplate:
      "Build an internal tool screen using the attached {product} design system spec (design.md). Include a sidebar nav, a list + detail layout, a settings form with validation, and toast feedback. Compose it from the design system's components and follow its colours, typography, spacing, and interaction patterns.",
  },
];

/**
 * Per-product use-case overrides. Empty today — every product falls back to
 * the shared default list. Add an entry here (keyed by product slug) to curate
 * a bespoke set without touching call sites.
 */
const USE_CASES_BY_PRODUCT: Record<string, UseCase[]> = {};

export function getUseCases(productSlug: string): UseCase[] {
  return USE_CASES_BY_PRODUCT[productSlug] ?? DEFAULT_USE_CASES;
}
