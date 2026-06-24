/**
 * Schema-tolerant codegen for `@zytedata/ds-*` packages.
 *
 * Run by each package's `build:tokens` script (in the package's cwd) it reads
 * `src/foundations.ts` + `src/design.body.md` and emits `dist/tokens.json`,
 * `dist/tokens.css`, `dist/tokens.scss`, `dist/tokens.tailwind.cjs` and the
 * composed `dist/design.md`. The walker treats every product's foundations as
 * an arbitrary tree of value leaves so flat Tailwind-style palettes (Web,
 * Core, Scrapy) and nested brutalist scales (Extract Summit) both emit.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { ProductBranding, ProductFoundations } from "@zytedata/ds-types";

// ---------------------------------------------------------------------------
// Slug + export-name conventions

const SCOPED_NAME_RE = /^@zytedata\/ds-([a-z][a-z0-9-]*)$/;

export function slugFromPackageName(name: string): string {
  const match = SCOPED_NAME_RE.exec(name);
  if (!match) {
    throw new Error(
      `tokens-build: package "${name}" must be named "@zytedata/ds-<slug>" (kebab-case slug).`,
    );
  }
  return match[1]!;
}

export function exportNameForSlug(slug: string): string {
  return `${slug.replace(/-/g, "_").toUpperCase()}_FOUNDATIONS`;
}

export function brandingExportNameForSlug(slug: string): string {
  return `${slug.replace(/-/g, "_").toUpperCase()}_BRANDING`;
}

// ---------------------------------------------------------------------------
// Walk + slugify utilities

const PX_CATEGORIES = new Set([
  "spacing",
  "radius",
  "breakpoint",
  "size",
  "letterSpacing",
]);

function slugifyPart(s: string | number): string {
  return String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\./g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function* walkLeaves(
  value: unknown,
  parts: string[] = [],
): Generator<{ parts: string[]; value: string | number }> {
  if (value === null || value === undefined) return;
  if (typeof value === "string" || typeof value === "number") {
    yield { parts, value };
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, sub] of Object.entries(value)) {
    if (key === "DEFAULT") {
      yield* walkLeaves(sub, parts);
      continue;
    }
    yield* walkLeaves(sub, [...parts, key]);
  }
}

function withUnit(value: string | number, category: string): string {
  if (typeof value === "string") return value;
  if (PX_CATEGORIES.has(category)) return `${value}px`;
  return String(value);
}

function cssVarFragment(group: string, parts: string[]): string {
  const flat = parts.map(slugifyPart).filter(Boolean);
  switch (group) {
    case "colors":
      return flat.join("-");
    case "spacing":
      return ["spacing", ...flat].join("-");
    case "radius":
      return ["radius", ...flat].join("-");
    case "shadow":
      return ["shadow", ...flat].join("-");
    case "breakpoint":
      return ["breakpoint", ...flat].join("-");
    case "opacity":
      return ["opacity", ...flat].join("-");
    case "zIndex":
      return ["z", ...flat].join("-");
    case "typography.family":
      return ["font", ...flat].join("-");
    case "typography.size":
      return ["text", ...flat].join("-");
    case "typography.weight":
      return ["font-weight", ...flat].join("-");
    case "typography.lineHeight":
      return ["line-height", ...flat].join("-");
    case "typography.letterSpacing":
      return ["letter-spacing", ...flat].join("-");
    default:
      return [slugifyPart(group), ...flat].join("-");
  }
}

function categoryForUnit(group: string): string {
  switch (group) {
    case "spacing":
    case "radius":
    case "breakpoint":
      return group;
    case "typography.size":
      return "size";
    case "typography.letterSpacing":
      return "letterSpacing";
    default:
      return group;
  }
}

type TokenRecord = {
  group: string;
  parts: string[];
  value: string | number;
};

function* iterateTokens(foundations: ProductFoundations): Generator<TokenRecord> {
  const top: Array<keyof ProductFoundations> = [
    "colors",
    "spacing",
    "radius",
    "shadow",
    "breakpoint",
    "opacity",
    "zIndex",
  ];

  for (const group of top) {
    const value = foundations[group];
    if (!value) continue;
    for (const leaf of walkLeaves(value)) {
      yield { group: String(group), parts: leaf.parts, value: leaf.value };
    }
  }

  if (foundations.typography) {
    const typo = foundations.typography as Record<string, unknown>;
    for (const subGroup of [
      "family",
      "size",
      "weight",
      "lineHeight",
      "letterSpacing",
    ]) {
      const value = typo[subGroup];
      if (!value) continue;
      for (const leaf of walkLeaves(value)) {
        yield {
          group: `typography.${subGroup}`,
          parts: leaf.parts,
          value: leaf.value,
        };
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Emitters

export function buildTokensCss(
  foundations: ProductFoundations,
  slug: string,
): string {
  const lines: string[] = [
    `/* Generated by @zytedata/tokens-build. Do not edit by hand. */`,
    `/* Product: ${foundations.label} (${slug}) */`,
    ``,
    `:root {`,
  ];
  for (const { group, parts, value } of iterateTokens(foundations)) {
    const fragment = cssVarFragment(group, parts);
    const formatted = withUnit(value, categoryForUnit(group));
    lines.push(`  --${slug}-${fragment}: ${formatted};`);
  }
  lines.push(`}`, ``);
  return lines.join("\n");
}

export function buildTokensScss(
  foundations: ProductFoundations,
  slug: string,
): string {
  const lines: string[] = [
    `// Generated by @zytedata/tokens-build. Do not edit by hand.`,
    `// Product: ${foundations.label} (${slug})`,
    ``,
  ];
  for (const { group, parts, value } of iterateTokens(foundations)) {
    const fragment = cssVarFragment(group, parts);
    const formatted = withUnit(value, categoryForUnit(group));
    const formattedQuoted =
      typeof value === "string" && /[,\s'"]/.test(value)
        ? JSON.stringify(formatted)
        : formatted;
    lines.push(`$${slug}-${fragment}: ${formattedQuoted};`);
  }
  lines.push(``);
  return lines.join("\n");
}

const DTCG_TYPE_BY_GROUP: Record<string, string> = {
  colors: "color",
  spacing: "dimension",
  radius: "dimension",
  shadow: "shadow",
  breakpoint: "dimension",
  opacity: "number",
  zIndex: "number",
  "typography.family": "fontFamily",
  "typography.size": "dimension",
  "typography.weight": "fontWeight",
  "typography.lineHeight": "number",
  "typography.letterSpacing": "dimension",
};

export function buildTokensJson(
  foundations: ProductFoundations,
  slug: string,
): string {
  const out: Record<string, unknown> = {
    $product: slug,
    $label: foundations.label,
    $description: foundations.description,
    $version: foundations.canonicalDoc?.version ?? "0.0.0",
  };

  for (const { group, parts, value } of iterateTokens(foundations)) {
    const groupKey = group;
    const segments = groupKey.split(".");
    let cursor: Record<string, unknown> = out;
    for (const segment of segments) {
      const next = cursor[segment];
      if (!isPlainObject(next)) {
        cursor[segment] = {};
      }
      cursor = cursor[segment] as Record<string, unknown>;
    }
    let leaf = cursor;
    for (const part of parts) {
      const next = leaf[part];
      if (!isPlainObject(next)) {
        leaf[part] = {};
      }
      leaf = leaf[part] as Record<string, unknown>;
    }
    const dtcgValue =
      typeof value === "number" && PX_CATEGORIES.has(categoryForUnit(group))
        ? `${value}px`
        : value;
    leaf.$value = dtcgValue;
    leaf.$type = DTCG_TYPE_BY_GROUP[group] ?? "other";
  }

  if (foundations.semanticColors) {
    out.semantic = { color: foundations.semanticColors };
  }
  if (foundations.components) {
    out.components = foundations.components;
  }

  return JSON.stringify(out, null, 2) + "\n";
}

export function buildTokensTailwind(
  foundations: ProductFoundations,
  slug: string,
): string {
  const preset: Record<string, Record<string, unknown>> = {
    colors: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {},
    screens: {},
    opacity: {},
    zIndex: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  };

  const setNested = (
    target: Record<string, unknown>,
    parts: string[],
    value: unknown,
  ) => {
    if (parts.length === 0) return;
    const [head, ...rest] = parts;
    if (rest.length === 0) {
      target[head!] = value;
      return;
    }
    const next = isPlainObject(target[head!]) ? target[head!] : {};
    target[head!] = next;
    setNested(next as Record<string, unknown>, rest, value);
  };

  const tailwindKeyByGroup: Record<string, string> = {
    colors: "colors",
    spacing: "spacing",
    radius: "borderRadius",
    shadow: "boxShadow",
    breakpoint: "screens",
    opacity: "opacity",
    zIndex: "zIndex",
    "typography.family": "fontFamily",
    "typography.size": "fontSize",
    "typography.weight": "fontWeight",
    "typography.lineHeight": "lineHeight",
    "typography.letterSpacing": "letterSpacing",
  };

  for (const { group, parts } of iterateTokens(foundations)) {
    const tailwindKey = tailwindKeyByGroup[group];
    if (!tailwindKey) continue;
    const fragment = cssVarFragment(group, parts);
    const cssVar = `var(--${slug}-${fragment})`;
    if (group === "colors") {
      // Colors stay nested: Tailwind v3's flattenColorPalette deep-flattens
      // `colors.${slug}.primary.500` into the `${slug}-primary-500` utility on
      // its own, and consumers read the nested `colors` object directly.
      setNested(preset[tailwindKey]!, [slug, ...parts], cssVar);
    } else {
      // Every other scale must ship as a flat `${slug}-*` key. Tailwind v3 only
      // deep-flattens `colors`, so a nested `borderRadius.${slug}.xl` never emits
      // a utility. Emitting `${slug}-xl` directly makes `rounded-${slug}-xl`,
      // `text-${slug}-5xl`, `font-${slug}-display`, etc. generate without forcing
      // every consumer to re-flatten the preset in their tailwind.config.
      const flatKey = [slug, ...parts].join("-");
      preset[tailwindKey]![flatKey] = cssVar;
    }
  }

  return [
    "// Generated by @zytedata/tokens-build. Do not edit by hand.",
    `// Product: ${foundations.label} (${slug})`,
    "//",
    "// Usage (Tailwind v3):",
    `//   const ${slug}Preset = require("@zytedata/ds-${slug}/tailwind");`,
    "//   module.exports = { presets: [zytePreset], content: [...] };",
    "",
    "/** @type {import('tailwindcss').Config} */",
    "module.exports = {",
    "  theme: {",
    `    extend: ${JSON.stringify(preset, null, 6).replace(/\n/g, "\n    ")},`,
    "  },",
    "};",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// design.md composer

function dumpYaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return `${pad}null`;
  if (typeof value === "string") {
    return `${pad}${JSON.stringify(value)}`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `${pad}${value}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]`;
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          // Render the item one level deeper, then hoist its first line onto
          // the `- ` marker so block sequences of maps indent correctly.
          const dumped = dumpYaml(item, indent + 1);
          const lines = dumped.split("\n");
          lines[0] = `${pad}- ${lines[0]!.slice((indent + 1) * 2)}`;
          return lines.join("\n");
        }
        return `${pad}- ${dumpYaml(item, 0).trimStart()}`;
      })
      .join("\n");
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return `${pad}{}`;
    return entries
      .map(([k, v]) => {
        const safeKey = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(k)
          ? k
          : JSON.stringify(k);
        if (v === null) return `${pad}${safeKey}: null`;
        if (isPlainObject(v)) {
          return Object.keys(v).length === 0
            ? `${pad}${safeKey}: {}`
            : `${pad}${safeKey}:\n${dumpYaml(v, indent + 1)}`;
        }
        if (Array.isArray(v)) {
          return v.length === 0
            ? `${pad}${safeKey}: []`
            : `${pad}${safeKey}:\n${dumpYaml(v, indent + 1)}`;
        }
        return `${pad}${safeKey}: ${dumpYaml(v, 0).trimStart()}`;
      })
      .join("\n");
  }
  return `${pad}${String(value)}`;
}

function buildFrontmatter(
  foundations: ProductFoundations,
  slug: string,
  branding?: ProductBranding,
): string {
  const yaml = dumpYaml({
    product: slug,
    name: foundations.label,
    description: foundations.description,
    version: foundations.canonicalDoc?.version ?? "0.0.0",
    semanticColors: foundations.semanticColors,
    colors: foundations.colors,
    typography: foundations.typography,
    spacing: foundations.spacing,
    radius: foundations.radius,
    shadow: foundations.shadow,
    breakpoint: foundations.breakpoint,
    opacity: foundations.opacity,
    zIndex: foundations.zIndex,
    components: foundations.components,
    // Brand guidance (logo, voice, visual language, …) so agents reading
    // design.md get the full editorial brief alongside the tokens. Emitted
    // only when the package ships a `<SLUG>_BRANDING` export.
    branding: branding
      ? { intro: branding.intro, sections: branding.sections }
      : undefined,
  });
  return ["---", yaml, "---"].join("\n");
}

export function composeDesignMd(
  foundations: ProductFoundations,
  slug: string,
  body: string,
  branding?: ProductBranding,
): string {
  const banner = [
    "<!--",
    "  This file is generated by @zytedata/tokens-build.",
    "  Edit the prose in design.body.md and the tokens in foundations.ts;",
    "  the YAML frontmatter is regenerated on every `pnpm tokens:build`.",
    "-->",
  ].join("\n");
  return [
    banner,
    buildFrontmatter(foundations, slug, branding),
    "",
    body.trim(),
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Per-package driver

function stripFrontmatter(raw: string): string {
  const fm = raw.match(
    /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n[\s\S]*?\r?\n---\r?\n?/,
  );
  if (!fm) return raw;
  return raw.slice(fm[0].length).replace(/^\r?\n+/, "");
}

async function readBody(srcDir: string): Promise<string> {
  const bodyPath = path.join(srcDir, "design.body.md");
  try {
    return await fs.readFile(bodyPath, "utf-8");
  } catch {
    const designMd = path.join(srcDir, "design.md");
    const raw = await fs.readFile(designMd, "utf-8");
    return stripFrontmatter(raw);
  }
}

/**
 * Optionally load the package's `<SLUG>_BRANDING` export from the compiled
 * `dist/branding.js`. Branding is opt-in — packages without it simply omit the
 * `branding` block from design.md. Returns undefined when the module or export
 * is absent.
 */
async function readBranding(
  distDir: string,
  slug: string,
): Promise<ProductBranding | undefined> {
  const brandingPath = path.join(distDir, "branding.js");
  try {
    await fs.access(brandingPath);
  } catch {
    return undefined;
  }
  const mod = (await import(pathToFileURL(brandingPath).href)) as Record<
    string,
    unknown
  >;
  const branding = mod[brandingExportNameForSlug(slug)] as
    | ProductBranding
    | undefined;
  return branding;
}

async function readPackageJson(
  pkgDir: string,
): Promise<{ name?: string; version?: string }> {
  const raw = await fs.readFile(path.join(pkgDir, "package.json"), "utf-8");
  return JSON.parse(raw) as { name?: string; version?: string };
}

export type BuildPackageResult = {
  slug: string;
  exportName: string;
  emitted: string[];
};

export async function buildPackage(
  pkgDir: string = process.cwd(),
): Promise<BuildPackageResult> {
  const pkg = await readPackageJson(pkgDir);
  if (!pkg.name) {
    throw new Error(
      `tokens-build: ${pkgDir}/package.json is missing the "name" field.`,
    );
  }
  const slug = slugFromPackageName(pkg.name);
  const exportName = exportNameForSlug(slug);

  const srcDir = path.join(pkgDir, "src");
  const distDir = path.join(pkgDir, "dist");
  // tokens-build expects the package to have already produced
  // `dist/foundations.js` via `tsc -p tsconfig.build.json` (the build:js step);
  // dynamically importing TypeScript source is not supported by Node and
  // pulling in tsx as a runtime would force every consumer of @zytedata/ds-* to
  // ship it. The package script order therefore has to be build:js first,
  // build:tokens second.
  const foundationsPath = path.join(distDir, "foundations.js");
  try {
    await fs.access(foundationsPath);
  } catch {
    throw new Error(
      `tokens-build: expected compiled module at ${foundationsPath}; run "pnpm run build:js" before "pnpm run build:tokens".`,
    );
  }

  const mod = (await import(pathToFileURL(foundationsPath).href)) as Record<
    string,
    unknown
  >;
  const foundations = mod[exportName] as ProductFoundations | undefined;
  if (!foundations) {
    throw new Error(
      `tokens-build: ${foundationsPath} must export ${exportName} (named export).`,
    );
  }

  const branding = await readBranding(distDir, slug);

  const body = await readBody(srcDir);
  await fs.mkdir(distDir, { recursive: true });

  const emitted: Array<[string, string]> = [
    ["tokens.json", buildTokensJson(foundations, slug)],
    ["tokens.css", buildTokensCss(foundations, slug)],
    ["tokens.scss", buildTokensScss(foundations, slug)],
    ["tokens.tailwind.cjs", buildTokensTailwind(foundations, slug)],
    ["design.md", composeDesignMd(foundations, slug, body, branding)],
  ];

  await Promise.all(
    emitted.map(([name, content]) =>
      fs.writeFile(path.join(distDir, name), content),
    ),
  );

  return { slug, exportName, emitted: emitted.map(([name]) => name) };
}

// ---------------------------------------------------------------------------
// Per-package validator

const REQUIRED_FILES = [
  "tokens.json",
  "tokens.css",
  "tokens.scss",
  "tokens.tailwind.cjs",
  "design.md",
] as const;

export type CheckPackageReport = {
  slug: string;
  failures: string[];
};

export async function checkPackage(
  pkgDir: string = process.cwd(),
): Promise<CheckPackageReport> {
  const pkg = await readPackageJson(pkgDir);
  if (!pkg.name) {
    return { slug: "<unknown>", failures: [`${pkgDir}/package.json missing name`] };
  }
  const slug = slugFromPackageName(pkg.name);
  const distDir = path.join(pkgDir, "dist");
  const failures: string[] = [];

  for (const filename of REQUIRED_FILES) {
    const filePath = path.join(distDir, filename);
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      failures.push(`missing ${filename}`);
      continue;
    }
    if (stat.size === 0) {
      failures.push(`${filename} is empty`);
      continue;
    }

    if (filename === "tokens.json") {
      try {
        const parsed = JSON.parse(await fs.readFile(filePath, "utf-8")) as {
          $product?: string;
        };
        if (parsed.$product !== slug) {
          failures.push(
            `tokens.json $product is "${parsed.$product}", expected "${slug}"`,
          );
        }
      } catch (err) {
        failures.push(`tokens.json is not valid JSON: ${String(err)}`);
      }
    }

    if (filename === "design.md") {
      const raw = await fs.readFile(filePath, "utf-8");
      const fmMatch = raw.match(
        /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n([\s\S]*?)\r?\n---/,
      );
      if (!fmMatch) {
        failures.push("design.md missing YAML frontmatter");
      } else if (!fmMatch[1]!.includes(`product: "${slug}"`)) {
        failures.push(
          `design.md frontmatter does not declare product: "${slug}"`,
        );
      }
    }

    if (filename === "tokens.css") {
      const raw = await fs.readFile(filePath, "utf-8");
      if (!raw.includes(`--${slug}-`)) {
        failures.push(`tokens.css contains no --${slug}-* variables`);
      }
    }
  }

  return { slug, failures };
}
