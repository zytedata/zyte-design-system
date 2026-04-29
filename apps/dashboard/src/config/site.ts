export const siteConfig = {
  name: "Zyte Design System",
  shortName: "Zyte DS",
  description:
    "A product workspace for the Zyte design system — foundations, tokens, components, templates and documentation across Web, Core, Scrapy and Extract Summit.",
  tagline:
    "A product workspace is used to load matching navigation and documentation experiences, improve both developer and product designer workflows, and strengthen collaboration with other parts of the organization.",
  meta: ["Open source docs shell", "Built for Zyte teams", "DesignOps workspace"],
  url: "https://design.zyte.com",
  links: {
    github: "https://github.com/placeholder/zyte-design-system",
    figma: "https://www.figma.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
