---
"@zytedata/ds-web": minor
---

Expose brand assets via the package `exports` map: `@zytedata/ds-web/assets/*` now resolves to the shipped SVGs in `src/assets` (e.g. `@zytedata/ds-web/assets/logo.primary.svg`). The files were already published but sealed off by the `exports` encapsulation; consumers can now import them directly instead of reaching into internal paths.
