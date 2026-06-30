import { cookies } from "next/headers";

import { describeGitSync, getGitStatus } from "@/data/git-status";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  // Real local-git sync state for the topbar's GitHub indicator. Derived
  // server-side so the server-only git reader never reaches the client topbar.
  const git = await getGitStatus();
  const githubSync = git
    ? {
        status:
          git.ahead === 0 && git.behind === 0
            ? ("synced" as const)
            : ("not_synced" as const),
        lastUpdate: `${git.lastCommitDate} · ${git.branch}@${git.shortSha} · ${describeGitSync(git)}`,
      }
    : {
        status: "not_synced" as const,
        lastUpdate: "unavailable — no local checkout",
      };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar githubSync={githubSync} />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
