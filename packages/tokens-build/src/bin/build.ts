#!/usr/bin/env node
import { buildPackage } from "../index.js";

async function main(): Promise<void> {
  const start = Date.now();
  const result = await buildPackage(process.cwd());
  const elapsed = Date.now() - start;
  process.stdout.write(
    `tokens-build: ${result.slug} (${result.emitted.length} artefacts in ${elapsed}ms)\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`tokens-build failed: ${String(err)}\n`);
  if (err instanceof Error && err.stack) {
    process.stderr.write(err.stack + "\n");
  }
  process.exit(1);
});
