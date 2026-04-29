import type { DsCategory } from "@/data/foundations/types";

export const WEB_COMPONENT_CATEGORIES: DsCategory[] = [
  {
    title: "Marketing",
    items: [
      { label: "Tag", slug: "tag", implemented: true },
      { label: "Pricing card", slug: "pricing-card", implemented: true },
      { label: "Hero", slug: "hero", implemented: true },
      { label: "Quote", slug: "quote", implemented: true },
      { label: "Module map", slug: "module-map", implemented: false },
    ],
  },
  {
    title: "Form",
    items: [
      { label: "Input", slug: "input", implemented: true },
      { label: "Button", slug: "button", implemented: true },
      { label: "Newsletter", slug: "newsletter", implemented: true },
    ],
  },
];
