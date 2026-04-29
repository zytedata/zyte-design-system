/**
 * Phase 1 sanity validator for the codegen output.
 *
 * Runs after `tokens-build` and asserts each product produced every expected
 * artefact, that each is non-empty, and that the structured ones (JSON,
 * design.md frontmatter) parse. CI calls this as `tokens:check`; treat any
 * failure as a regression in either the source data or the codegen.
 *
 * Phase 3 will extend this with WCAG contrast and per-product token diff.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PRODUCTS_DIR = path.join(REPO_ROOT, "src", "data", "products");

const PRODUCT_SLUGS = ["web", "core", "scrapy", "extract-summit"] as const;

const REQUIRED_FILES = [
  "tokens.json",
  "tokens.css",
  "tokens.scss",
  "tokens.tailwind.cjs",
  "design.md",
] as const;

const failures: string[] = [];

function fail(slug: string, msg: string): void {
  failures.push(`  ✗ ${slug}: ${msg}`);
}

async function checkProduct(slug: string): Promise<void> {
  const distDir = path.join(PRODUCTS_DIR, slug, "dist");
  for (const filename of REQUIRED_FILES) {
    const filePath = path.join(distDir, filename);
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      fail(slug, `missing ${filename}`);
      continue;
    }
    if (stat.size === 0) {
      fail(slug, `${filename} is empty`);
      continue;
    }

    if (filename === "tokens.json") {
      const raw = await fs.readFile(filePath, "utf-8");
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.$product !== slug) {
          fail(
            slug,
            `tokens.json $product is "${parsed?.$product}", expected "${slug}"`,
          );
        }
      } catch (err) {
        fail(slug, `tokens.json is not valid JSON: ${String(err)}`);
      }
    }

    if (filename === "design.md") {
      const raw = await fs.readFile(filePath, "utf-8");
      const fmMatch = raw.match(
        /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n([\s\S]*?)\r?\n---/,
      );
      if (!fmMatch) {
        fail(slug, `design.md missing YAML frontmatter`);
      } else if (!fmMatch[1].includes(`product: "${slug}"`)) {
        fail(slug, `design.md frontmatter does not declare product: "${slug}"`);
      }
    }

    if (filename === "tokens.css") {
      const raw = await fs.readFile(filePath, "utf-8");
      if (!raw.includes(`--${slug}-`)) {
        fail(slug, `tokens.css contains no --${slug}-* variables`);
      }
    }
  }
}

async function main(): Promise<void> {
  for (const slug of PRODUCT_SLUGS) {
    await checkProduct(slug);
  }

  if (failures.length > 0) {
    process.stderr.write(`tokens-check: ${failures.length} failure(s):\n`);
    for (const line of failures) process.stderr.write(line + "\n");
    process.exit(1);
  }

  process.stdout.write(
    `tokens-check: ${PRODUCT_SLUGS.length} products, all artefacts valid\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`tokens-check failed: ${String(err)}\n`);
  process.exit(1);
});
