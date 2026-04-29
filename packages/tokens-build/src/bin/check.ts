#!/usr/bin/env node
import { buildPackage, checkPackage } from "../index.js";

async function main(): Promise<void> {
  await buildPackage(process.cwd());
  const report = await checkPackage(process.cwd());
  if (report.failures.length > 0) {
    process.stderr.write(
      `tokens-check: ${report.slug} has ${report.failures.length} failure(s):\n`,
    );
    for (const failure of report.failures) {
      process.stderr.write(`  ✗ ${failure}\n`);
    }
    process.exit(1);
  }
  process.stdout.write(`tokens-check: ${report.slug} ok\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`tokens-check failed: ${String(err)}\n`);
  process.exit(1);
});
