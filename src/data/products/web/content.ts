/**
 * Product-specific narrative content for the Web package.
 * Surfaced by the product dashboard and the Web Documentation page.
 */
export const WEB_FRONTEND_STACK = [
  "Next.js App Router + React 19",
  "TypeScript across app, util, and component layers",
  "Tailwind CSS v4 loaded globally from styles/tailwind.css",
  "SCSS modules plus global SCSS (reset, theme, primereact overrides)",
  "Contento CMS as content source with local module/template rendering",
  "PrimeReact used in selected flows with custom SCSS overrides",
];

export const WEB_DESIGN_LAYERS = [
  {
    title: "Global Styling Base",
    details:
      "app/layout.tsx loads reset.scss, global.scss, and tailwind.css to establish baseline styles and utility classes.",
  },
  {
    title: "Component Styling",
    details:
      "Feature components use SCSS modules for scoped styles and optionally mix Tailwind utility classes in JSX.",
  },
  {
    title: "Token Sources",
    details:
      "Legacy tokens live in styles/_colors.scss and related SCSS files, then mirrored in tailwind.config.js and runtime constants.",
  },
  {
    title: "Render Model",
    details:
      "Legacy Contento module handles map through ModuleMap while newer payload-template pages use Tailwind-heavy template components.",
  },
];

export const WEB_ALIGNMENT_PRIORITIES = [
  "Define a single token source of truth for SCSS + Tailwind + JS consumers.",
  "Document when to use Tailwind utilities vs SCSS modules for new Web UI work.",
  "Track migration from legacy module rendering to template-based page sections.",
  "Keep PrimeReact/third-party overrides tied to design tokens, not ad-hoc values.",
];
