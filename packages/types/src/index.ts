export type FileChangeKind = "added" | "changed" | "removed" | "fixed";

export type FileChangeEntry = {
  date: string;
  author: string;
  kind: FileChangeKind;
  message: string;
};

export type FileChangelog = {
  file: string;
  entries: FileChangeEntry[];
};

export type DsItem = {
  label: string;
  slug: string;
  implemented?: boolean;
};

export type DsCategory = {
  title: string;
  items: DsItem[];
};

export type FoundationColorRow = {
  name: string;
  hex: string;
  utility: string;
};

export type ColorShadeMap = Record<string, string>;
export type ColorPalettes = Record<string, ColorShadeMap>;

export type NumericScale = Record<string, number>;
export type StringScale = Record<string, string>;

export type TypographyFoundations = {
  family: StringScale;
  size: NumericScale;
  weight: NumericScale;
  lineHeight: NumericScale;
  letterSpacing: NumericScale;
};

export type ProductComponentContract = Record<string, Record<string, string>>;

export type ProductFoundations = {
  label: string;
  description: string;
  colors: ColorPalettes;
  semanticColors: Record<string, string>;
  typography: TypographyFoundations;
  spacing: NumericScale;
  radius: NumericScale;
  shadow: StringScale;
  breakpoint: NumericScale;
  opacity: NumericScale;
  zIndex: NumericScale;
  components?: ProductComponentContract;
  canonicalDoc?: {
    assetPath: string;
    title: string;
    version: string;
  };
};

// ---------------------------------------------------------------------------
// Product documentation: the "how this scope works" surface that the
// dashboard's Documentation page renders. Each @zytedata/ds-* package exports a
// `<SLUG>_DOCUMENTATION: ProductDocumentation` constant so the page renders
// uniformly across products and the same content can be machine-consumed
// by agents/LLMs through the package's exports map.

export type DocStep = {
  /** Short headline shown above the step body, e.g. "1. Bump foundations.ts". */
  heading?: string;
  /** Paragraph-level body. Plain text; markdown is intentionally not parsed. */
  text: string;
};

export type DocCalloutTone = "info" | "tip" | "warning";

export type DocCallout = {
  tone: DocCalloutTone;
  title?: string;
  body: string;
};

export type DocCodeBlock = {
  language: string;
  content: string;
};

export type DocSection = {
  /** URL-safe id for in-page anchors. */
  id: string;
  title: string;
  /** Optional lead paragraph; rendered above any list/code. */
  body?: string;
  /** Bulleted list of short statements. */
  bullets?: string[];
  /** Numbered, multi-paragraph procedure (preferred for workflow docs). */
  steps?: DocStep[];
  /** A single example code block; we keep it minimal on purpose. */
  code?: DocCodeBlock;
  /** Optional callout pinned at the bottom of the section. */
  callout?: DocCallout;
};

export type ProductDocumentation = {
  /** Stable identifier (matches the package slug). */
  productSlug: string;
  /** One-paragraph elevator pitch for this design-system scope. */
  intro: string;
  /** Audiences served by this page, e.g. ["Designers", "Developers", "Agents"]. */
  audience?: string[];
  sections: DocSection[];
};
