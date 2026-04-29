/**
 * Phase 1 codegen.
 *
 * Reads each product's `src/data/products/<slug>/foundations.ts` and emits, into
 * a per-product `dist/` folder:
 *
 *   - tokens.json          DTCG-style design-tokens JSON
 *   - tokens.css           CSS custom properties on :root, namespaced by slug
 *   - tokens.scss          SCSS variables, namespaced by slug
 *   - tokens.tailwind.cjs  Tailwind v3 preset (theme.extend.*) namespaced by slug
 *   - design.md            Hand-prose body (`design.body.md`) wrapped in a
 *                          freshly-regenerated YAML frontmatter derived from
 *                          foundations.ts so the agent surface never drifts.
 *
 * Schema-tolerant by design: each product's `foundations.ts` may declare a
 * different shape (Web's flat Tailwind-style palette vs Extract Summit's
 * brutalist nested groups). The emitter walks whatever it finds and never
 * enforces a fixed schema across products.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { ProductFoundations } from "../src/data/foundations/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PRODUCTS_DIR = path.join(REPO_ROOT, "src", "data", "products");

const PRODUCT_SLUGS = ["web", "core", "scrapy", "extract-summit"] as const;
type ProductSlug = (typeof PRODUCT_SLUGS)[number];

const FOUNDATIONS_EXPORT_BY_SLUG: Record<ProductSlug, string> = {
  web: "WEB_FOUNDATIONS",
  core: "CORE_FOUNDATIONS",
  scrapy: "SCRAPY_FOUNDATIONS",
  "extract-summit": "EXTRACT_SUMMIT_FOUNDATIONS",
};

// Categories where a numeric scalar means "pixels" in CSS output.
const PX_CATEGORIES = new Set([
  "spacing",
  "radius",
  "breakpoint",
  "size",
  "letterSpacing",
]);

// ---------------------------------------------------------------------------
// utilities

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

/**
 * Walk a (possibly nested) value tree and yield every leaf with its key path.
 * `DEFAULT` keys are collapsed (so `colors.primary.DEFAULT` becomes
 * `colors.primary` — same convention Tailwind uses).
 */
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

// ---------------------------------------------------------------------------
// CSS variable name conventions

/**
 * Map a foundations top-level group + key path to a CSS variable name fragment
 * (without the leading `--<slug>-`). Keeps names readable and namespaced.
 */
function cssVarFragment(group: string, parts: string[]): string {
  const flat = parts.map(slugifyPart).filter(Boolean);
  switch (group) {
    case "colors":
      return flat.join("-"); // `--<slug>-primary-500`, `--<slug>-surface-black`
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
  // Map the group name to the unit category (so withUnit can decide px-vs-bare).
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

// ---------------------------------------------------------------------------
// Iterate the foundations bundle, yielding per-token records

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

function buildTokensCss(foundations: ProductFoundations, slug: string): string {
  const lines: string[] = [
    `/* Generated by scripts/tokens-build.ts. Do not edit by hand. */`,
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

function buildTokensScss(foundations: ProductFoundations, slug: string): string {
  const lines: string[] = [
    `// Generated by scripts/tokens-build.ts. Do not edit by hand.`,
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

function buildTokensJson(
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
    const groupKey = group.replace(/^typography\./, "typography.");
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

function buildTokensTailwind(
  foundations: ProductFoundations,
  slug: string,
): string {
  // Build a Tailwind v3 preset that exposes namespaced tokens via theme.extend.
  // CSS variables are referenced (not literal hex/px) so the preset stays in
  // sync with `tokens.css` once both are loaded.
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
      target[head] = value;
      return;
    }
    const next = isPlainObject(target[head]) ? target[head] : {};
    target[head] = next;
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
    // Namespace at the top level under the slug, e.g. theme.colors.web.primary[500]
    setNested(preset[tailwindKey], [slug, ...parts], cssVar);
  }

  return [
    "// Generated by scripts/tokens-build.ts. Do not edit by hand.",
    `// Product: ${foundations.label} (${slug})`,
    "//",
    "// Usage (Tailwind v3):",
    `//   const ${slug}Preset = require("@zyte/ds-${slug}/tailwind");`,
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
      .map((item) => `${pad}- ${dumpYaml(item, 0).trimStart()}`)
      .join("\n");
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return `${pad}{}`;
    return entries
      .map(([k, v]) => {
        const safeKey = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(k)
          ? k
          : JSON.stringify(k);
        if (
          isPlainObject(v) ||
          (Array.isArray(v) && v.some((it) => typeof it === "object"))
        ) {
          return `${pad}${safeKey}:\n${dumpYaml(v, indent + 1)}`;
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
  });
  return ["---", yaml, "---"].join("\n");
}

function composeDesignMd(
  foundations: ProductFoundations,
  slug: string,
  body: string,
): string {
  const banner = [
    "<!--",
    "  This file is generated by scripts/tokens-build.ts.",
    "  Edit the prose in design.body.md and the tokens in foundations.ts;",
    "  the YAML frontmatter is regenerated on every `pnpm tokens build`.",
    "-->",
  ].join("\n");
  return [banner, buildFrontmatter(foundations, slug), "", body.trim(), ""].join(
    "\n",
  );
}

// ---------------------------------------------------------------------------
// design.body.md fallback (Phase 1 transition)

function stripFrontmatter(raw: string): string {
  const fm = raw.match(
    /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n[\s\S]*?\r?\n---\r?\n?/,
  );
  if (!fm) return raw;
  return raw.slice(fm[0].length).replace(/^\r?\n+/, "");
}

async function readBody(productDir: string): Promise<string> {
  const bodyPath = path.join(productDir, "design.body.md");
  try {
    return await fs.readFile(bodyPath, "utf-8");
  } catch {
    const designMd = path.join(productDir, "design.md");
    const raw = await fs.readFile(designMd, "utf-8");
    return stripFrontmatter(raw);
  }
}

// ---------------------------------------------------------------------------
// driver

async function buildProduct(slug: ProductSlug): Promise<void> {
  const productDir = path.join(PRODUCTS_DIR, slug);
  const foundationsPath = path.join(productDir, "foundations.ts");
  const distDir = path.join(productDir, "dist");

  const mod = await import(pathToFileURL(foundationsPath).href);
  const exportName = FOUNDATIONS_EXPORT_BY_SLUG[slug];
  const foundations = mod[exportName] as ProductFoundations | undefined;
  if (!foundations) {
    throw new Error(
      `Could not find ${exportName} export in ${foundationsPath}`,
    );
  }

  const body = await readBody(productDir);

  await fs.mkdir(distDir, { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(distDir, "tokens.json"),
      buildTokensJson(foundations, slug),
    ),
    fs.writeFile(
      path.join(distDir, "tokens.css"),
      buildTokensCss(foundations, slug),
    ),
    fs.writeFile(
      path.join(distDir, "tokens.scss"),
      buildTokensScss(foundations, slug),
    ),
    fs.writeFile(
      path.join(distDir, "tokens.tailwind.cjs"),
      buildTokensTailwind(foundations, slug),
    ),
    fs.writeFile(
      path.join(distDir, "design.md"),
      composeDesignMd(foundations, slug, body),
    ),
  ]);
}

async function main(): Promise<void> {
  const start = Date.now();
  for (const slug of PRODUCT_SLUGS) {
    await buildProduct(slug);
    process.stdout.write(`  ✓ ${slug}\n`);
  }
  const elapsed = Date.now() - start;
  process.stdout.write(
    `tokens-build: ${PRODUCT_SLUGS.length} products in ${elapsed}ms\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`tokens-build failed: ${String(err)}\n`);
  if (err instanceof Error && err.stack) {
    process.stderr.write(err.stack + "\n");
  }
  process.exit(1);
});
