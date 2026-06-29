"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type PackageManager = "pnpm" | "npm" | "yarn";

const COMMAND_FOR: Record<PackageManager, (pkg: string) => string> = {
  pnpm: (pkg) => `pnpm add ${pkg}`,
  npm: (pkg) => `npm install ${pkg}`,
  yarn: (pkg) => `yarn add ${pkg}`,
};

export type InstallCommandProps = {
  packageName: string;
  /** Optional helper text rendered next to the package-manager tabs. */
  note?: React.ReactNode;
  className?: string;
};

/**
 * Package-manager switcher (pnpm / npm / yarn) with a copy-to-clipboard install
 * command. Single source of truth shared by the dashboard's install card
 * (`DevOnboarding`) and the Getting started onboarding scenarios.
 */
export function InstallCommand({ packageName, note, className }: InstallCommandProps) {
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(COMMAND_FOR[manager](packageName));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable (e.g. insecure context); fail silently.
    }
  }

  return (
    <Tabs
      value={manager}
      onValueChange={(value) => setManager(value as PackageManager)}
      className={className}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="h-8">
          <TabsTrigger value="pnpm" className="text-xs">
            pnpm
          </TabsTrigger>
          <TabsTrigger value="npm" className="text-xs">
            npm
          </TabsTrigger>
          <TabsTrigger value="yarn" className="text-xs">
            yarn
          </TabsTrigger>
        </TabsList>
        {note ? <p className="text-muted-foreground text-xs">{note}</p> : null}
      </div>

      {(["pnpm", "npm", "yarn"] satisfies PackageManager[]).map((m) => (
        <TabsContent key={m} value={m} className="mt-3">
          <div className="bg-muted/40 flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-sm">
            <span className="text-muted-foreground select-none">$</span>
            <code className="flex-1 truncate">{COMMAND_FOR[m](packageName)}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              aria-label="Copy install command"
              className="h-7 px-2"
            >
              {copied ? (
                <Check className={cn("size-4 text-emerald-500")} />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
