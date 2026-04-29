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
