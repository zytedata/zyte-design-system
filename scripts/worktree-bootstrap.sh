#!/usr/bin/env bash
# zyte-design-system — pnpm workspace monorepo bootstrap
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "==> bootstrap $ROOT"

command -v pnpm >/dev/null || { echo "pnpm required"; exit 1; }
if [[ -n "${WORKTREE_FILTER:-}" ]]; then
  echo "filtered install: $WORKTREE_FILTER"
  pnpm install --filter "${WORKTREE_FILTER}..."
else
  pnpm install
fi

echo "==> bootstrap complete — try: pnpm typecheck | pnpm --filter dashboard dev"
