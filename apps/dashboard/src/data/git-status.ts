import "server-only";

import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { cache } from "react";

const exec = promisify(execFile);

// `process.cwd()` is `apps/dashboard` for both `next dev` and `next build`;
// the git checkout lives at the workspace root two levels up (same anchor the
// foundations docs reader uses).
const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..");

export type GitStatus = {
  branch: string;
  shortSha: string;
  /** Committer date of HEAD, formatted `YYYY-MM-DD`. */
  lastCommitDate: string;
  /** Commits HEAD is ahead of its upstream; null when no upstream is tracked. */
  ahead: number | null;
  /** Commits HEAD is behind its upstream; null when no upstream is tracked. */
  behind: number | null;
};

async function git(args: string[]): Promise<string> {
  const { stdout } = await exec("git", args, {
    cwd: WORKSPACE_ROOT,
    timeout: 4000,
  });
  return stdout.trim();
}

/**
 * Read the local git checkout's sync state. Returns `null` when git or a
 * checkout isn't available (e.g. a Vercel build), so callers can fall back.
 *
 * Ahead/behind is measured against the upstream tracking ref as of the last
 * `git fetch` — it reflects the local view of the remote, not a live fetch.
 * `cache()` dedupes the work across a single render pass.
 */
export const getGitStatus = cache(async (): Promise<GitStatus | null> => {
  try {
    const [branch, shortSha, lastCommitDate] = await Promise.all([
      git(["rev-parse", "--abbrev-ref", "HEAD"]),
      git(["rev-parse", "--short", "HEAD"]),
      git(["log", "-1", "--format=%cd", "--date=short"]),
    ]);

    let ahead: number | null = null;
    let behind: number | null = null;
    try {
      // `--left-right --count A...B` → "<left> <right>"; with `@{u}...HEAD`,
      // left = upstream-only (behind), right = HEAD-only (ahead).
      const counts = await git([
        "rev-list",
        "--left-right",
        "--count",
        "@{upstream}...HEAD",
      ]);
      const [b, a] = counts.split(/\s+/).map((n) => Number.parseInt(n, 10));
      behind = Number.isFinite(b) ? b : null;
      ahead = Number.isFinite(a) ? a : null;
    } catch {
      // No upstream tracking branch configured for the current branch.
    }

    return { branch, shortSha, lastCommitDate, ahead, behind };
  } catch {
    return null;
  }
});

/** Human-readable sync state for the dashboard header. */
export function describeGitSync(status: GitStatus): string {
  if (status.behind === null || status.ahead === null) return "no upstream";
  if (status.behind === 0 && status.ahead === 0) return "in sync with origin";
  const parts: string[] = [];
  if (status.behind > 0) parts.push(`${status.behind} behind`);
  if (status.ahead > 0) parts.push(`${status.ahead} ahead`);
  return parts.join(" · ");
}
