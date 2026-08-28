@AGENTS.md

## Parallel worktrees (Claude Code)

Each task runs in its own git worktree (`claude -w <name>` or `claude-wt spawn <repo> <name>`).

1. If `node_modules` is missing: `./scripts/worktree-bootstrap.sh`
2. Env files are copied via `.worktreeinclude` (from the main checkout).
3. Quick health: `./scripts/worktree-smoke.sh`
4. One task per worktree; open a PR when done. Do not edit other agents' branches.

