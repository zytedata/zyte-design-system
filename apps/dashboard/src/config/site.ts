export const siteConfig = {
  name: "Zyte Design System",
  shortName: "Zyte DS",
  description:
    "A product workspace for the Zyte design system — foundations, tokens, components, templates and documentation across Web, Core, Scrapy and Extract Summit.",
  tagline:
    "Product workspaces help teams access the right design documentation, and guidance, foundations, tokens, components, templates for each Zyte product area, improving developer and designer workflows while creating a shared collaboration layer across the organization.",
  meta: ["Open source docs shell", "Built for Zyte teams", "DesignOps workspace"],
  url: "https://design.zyte.com",
  links: {
    github: "https://github.com/zytedata/zyte-design-system",
    figma: "https://www.figma.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
