#!/usr/bin/env bash
# zyte-design-system — quick health check after bootstrap (no full e2e)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "==> smoke $ROOT"

if grep -q '"packageManager": "pnpm' package.json 2>/dev/null || [[ -f pnpm-lock.yaml ]]; then
  PM=pnpm
elif [[ -f yarn.lock ]]; then
  PM=yarn
else
  PM=npm
fi

run_script() {
  local s="$1"
  # package.json has a script key
  node -e "const p=require('./package.json'); process.exit(p.scripts&&p.scripts['$s']?0:1)" 2>/dev/null || return 0
  echo "--> $PM run $s"
  case "$PM" in
    pnpm) pnpm run "$s" ;;
    yarn) yarn "$s" ;;
    *) npm run "$s" ;;
  esac
}

for s in typecheck; do
  run_script "$s"
done

echo "==> smoke complete"
