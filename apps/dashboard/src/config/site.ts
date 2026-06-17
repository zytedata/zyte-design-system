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
    figma:
      "https://www.figma.com/design/UzBE4joH5SCAQl4CGRlbTk/Design-System-2.0?node-id=71-168",
    // Importable Figma plugin bundle (manifest.json + code.js + ui.html),
    // served from apps/dashboard/public. Import via Figma desktop →
    // Plugins → Development → Import plugin from manifest.
    figmaPlugin: "/zyte-figma-plugin.zip",
  },
} as const;

export type SiteConfig = typeof siteConfig;
