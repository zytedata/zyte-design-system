import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ProductId } from "@/data/products";

// Templates ship inside each `@zytedata/ds-<slug>` package as a pair of files
// per template: `<id>.md` (the spec — frontmatter + prose) and `<id>.html`
// (a standalone, design-system-styled preview).
//
// We read them with the same workspace-relative strategy used by
// `data/foundations/docs.ts`: anchor at `process.cwd()` (= apps/dashboard) and
// walk to the sibling `packages/<slug>/…`. We prefer `dist/templates` (what a
// registry-installed dashboard would ship) and fall back to `src/templates`
// (the source of truth designers edit directly in the workspace).
const DASHBOARD_ROOT = process.cwd();
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, "..", "..");

const SLUG_BY_PRODUCT_ID: Record<ProductId, string> = {
  web: "web",
  core: "core",
  scrapy: "scrapy",
  extractSummit: "extract-summit",
};

/** Candidate template directories, in priority order. */
function templateDirs(productId: ProductId): string[] {
  const slug = SLUG_BY_PRODUCT_ID[productId];
  if (!slug) return [];
  const root = path.join(WORKSPACE_ROOT, "packages", slug);
  return [
    path.join(root, "dist", "templates"),
    path.join(root, "src", "templates"),
  ];
}

export type TemplateMeta = {
  /** File-derived id, used in the URL: `/products/web/templates/<id>`. */
  id: string;
  title: string;
  status: string;
  /** One-line summary shown on the list card (from `intent`). */
  summary: string;
};

export type Template = TemplateMeta & {
  /** The use-case overlay — this template's own spec, shown first. */
  markdown: string;
  /** The inherited base design system, shown collapsed (empty if none). */
  baseMarkdown: string;
  /** Full markdown file including YAML frontmatter — used for download. */
  raw: string;
  /** Standalone HTML preview (rendered in a sandboxed iframe). */
  html: string;
};

/**
 * Minimal YAML-frontmatter reader for the handful of top-level scalar fields
 * the dashboard needs (`title`, `status`, `intent`). Deliberately tiny — we do
 * not pull in a YAML dependency. Handles inline scalars, quoted values, inline
 * `#` comments, and folded/literal block scalars (`>`, `>-`, `|`, `|-`).
 * Nested blocks (e.g. `sections:`) are skipped because only column-0 keys match.
 */
function readFrontmatterField(frontmatter: string, key: string): string | null {
  const lines = frontmatter.split(/\r?\n/);
  const keyRe = new RegExp(`^${key}:[ \\t]*(.*)$`);

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(keyRe);
    if (!m) continue;

    let value = m[1];
    // Folded (`>`) / literal (`|`) block scalar: collect indented continuation.
    if (/^[|>][+-]?$/.test(value.trim())) {
      const folded = value.trim().startsWith(">");
      const collected: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (/^\S/.test(lines[j]) && lines[j].trim() !== "") break; // next top-level key
        collected.push(lines[j].trim());
      }
      return collected.join(folded ? " " : "\n").trim();
    }

    // Inline scalar: strip trailing comment + surrounding quotes.
    value = value.replace(/\s+#.*$/, "").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value || null;
  }
  return null;
}

function splitFrontmatter(md: string): { frontmatter: string; body: string } {
  // Tolerate an optional leading generated banner (`<!-- … -->`) before the
  // YAML block — composed template files start with one, so a naive `^---`
  // match would fail and dump the entire token frontmatter into the body.
  const match = md.match(
    /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n([\s\S]*?)\r?\n---\r?\n?/,
  );
  if (!match) return { frontmatter: "", body: md };
  return {
    frontmatter: match[1],
    body: md.slice(match[0].length).replace(/^\r?\n+/, ""),
  };
}

/**
 * Divider tokens-build writes on its own line between the base layer and the
 * overlay. Matched line-anchored — the same token is also mentioned inline
 * inside the base banner prose, so a plain substring search would split too
 * early and spill the base into the overlay.
 */
const BASE_END_MARKER_RE = /^--- END BASE ---$/m;

/**
 * Strip the machine-facing layer scaffolding (HTML comment fences + the
 * generated `▸ BASE/OVERLAY LAYER` banner blockquotes) so the rendered markdown
 * reads cleanly for a non-technical viewer. The full scaffolding stays in the
 * downloadable file.
 */
function stripLayerScaffolding(md: string): string {
  const withoutComments = md.replace(/<!--[\s\S]*?-->/g, "");
  const kept: string[] = [];
  let inBanner = false;
  for (const line of withoutComments.split(/\r?\n/)) {
    if (inBanner) {
      if (line.startsWith(">")) continue; // still inside the banner blockquote
      inBanner = false;
    }
    if (/^>\s*\*\*▸ (?:BASE|OVERLAY) LAYER/.test(line)) {
      inBanner = true;
      continue;
    }
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Split a composed template body into the use-case overlay (shown first, the
 * template's own spec) and the inherited base design system (shown collapsed).
 * Falls back to treating the whole body as the overlay when there is no marker
 * (e.g. a legacy single-layer template).
 */
function splitLayers(body: string): { overlay: string; base: string } {
  const m = BASE_END_MARKER_RE.exec(body);
  if (!m) return { overlay: stripLayerScaffolding(body), base: "" };
  const base = body.slice(0, m.index);
  const overlay = body.slice(m.index + m[0].length);
  return { overlay: stripLayerScaffolding(overlay), base: stripLayerScaffolding(base) };
}

async function firstExistingDir(productId: ProductId): Promise<string | null> {
  for (const dir of templateDirs(productId)) {
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) return dir;
    } catch {
      // try next candidate
    }
  }
  return null;
}

function toMeta(id: string, frontmatter: string): TemplateMeta {
  return {
    id,
    title: readFrontmatterField(frontmatter, "title") ?? id,
    status: readFrontmatterField(frontmatter, "status") ?? "draft",
    summary: readFrontmatterField(frontmatter, "intent") ?? "",
  };
}

/** List every template that has both an `.md` spec and an `.html` preview. */
export async function listTemplates(productId: ProductId): Promise<TemplateMeta[]> {
  const dir = await firstExistingDir(productId);
  if (!dir) return [];

  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const ids = entries.filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
  const out: TemplateMeta[] = [];
  for (const id of ids) {
    if (!entries.includes(`${id}.html`)) continue; // require a preview
    try {
      const md = await fs.readFile(path.join(dir, `${id}.md`), "utf-8");
      out.push(toMeta(id, splitFrontmatter(md).frontmatter));
    } catch {
      // skip unreadable file
    }
  }

  // Home first, then alphabetical by title.
  return out.sort((a, b) => {
    if (a.id === "home") return -1;
    if (b.id === "home") return 1;
    return a.title.localeCompare(b.title);
  });
}

/** Read a single template's spec + preview. Returns null if either is missing. */
export async function readTemplate(
  productId: ProductId,
  id: string,
): Promise<Template | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null; // guard against path traversal
  const dir = await firstExistingDir(productId);
  if (!dir) return null;

  try {
    const [md, html] = await Promise.all([
      fs.readFile(path.join(dir, `${id}.md`), "utf-8"),
      fs.readFile(path.join(dir, `${id}.html`), "utf-8"),
    ]);
    const { frontmatter, body } = splitFrontmatter(md);
    const { overlay, base } = splitLayers(body);
    return {
      ...toMeta(id, frontmatter),
      markdown: overlay,
      baseMarkdown: base,
      raw: md,
      html,
    };
  } catch {
    return null;
  }
}
