"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code,
  Copy,
  ExternalLink,
  FileCode,
  Layers,
  Package,
  ScrollText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DevOnboardingProps = {
  productLabel: string;
  productSlug: string;
  packageName: string;
  version: string | null;
  links: {
    /** GitHub source for the package directory. */
    source: string;
    /** GitHub Packages registry page (placeholder until first publish). */
    registry: string;
    /** Workspace-internal foundations route. */
    foundations: string;
    /** Workspace-internal changelog route. */
    changelog: string;
    /** Workspace-internal design.md viewer route (the "agent" surface). */
    designMd: string;
    /** RELEASING.md inside the monorepo on GitHub. */
    releasing: string;
  };
};

type Manager = "pnpm" | "npm" | "yarn";

const COMMAND_FOR: Record<Manager, (pkg: string) => string> = {
  pnpm: (pkg) => `pnpm add ${pkg}`,
  npm: (pkg) => `npm install ${pkg}`,
  yarn: (pkg) => `yarn add ${pkg}`,
};

export function DevOnboarding({
  productLabel,
  packageName,
  version,
  links,
}: DevOnboardingProps) {
  const [manager, setManager] = useState<Manager>("pnpm");
  const [copied, setCopied] = useState(false);

  const command = COMMAND_FOR[manager](packageName);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable (e.g. insecure context); fail silently.
    }
  }

  return (
    <section className="from-card via-card to-muted/40 rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Get started</h2>
            {version ? (
              <Badge variant="secondary" className="font-mono text-[11px]">
                v{version}
              </Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            New to the {productLabel} design system? Install the package, wire
            it into your app, and use the links below for the source, the
            spec, and the live token surface.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-[11px]">
          {packageName}
        </Badge>
      </div>

      <Tabs
        value={manager}
        onValueChange={(value) => setManager(value as Manager)}
        className="mt-5"
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
          <p className="text-muted-foreground text-xs">
            Requires <code className="font-mono">.npmrc</code> with the{" "}
            <code className="font-mono">@zyte</code> scope pointed at GitHub
            Packages.
          </p>
        </div>

        {(["pnpm", "npm", "yarn"] satisfies Manager[]).map((m) => (
          <TabsContent key={m} value={m} className="mt-3">
            <div className="bg-muted/40 flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-sm">
              <span className="text-muted-foreground select-none">$</span>
              <code className="flex-1 truncate">
                {COMMAND_FOR[m](packageName)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                aria-label="Copy install command"
                className="h-7 px-2"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <ResourceLink
          icon={Code}
          label="Source"
          description="packages/{slug} on GitHub"
          href={links.source}
          external
        />
        <ResourceLink
          icon={Package}
          label="Package"
          description="GitHub Packages registry"
          href={links.registry}
          external
        />
        <ResourceLink
          icon={Layers}
          label="Foundations"
          description="Live tokens + palette"
          href={links.foundations}
        />
        <ResourceLink
          icon={FileCode}
          label="design.md spec"
          description="Agent-readable contract"
          href={links.designMd}
        />
        <ResourceLink
          icon={ScrollText}
          label="Changelog"
          description="What shipped per version"
          href={links.changelog}
        />
        <ResourceLink
          icon={BookOpen}
          label="Releasing guide"
          description="How a token reaches consumers"
          href={links.releasing}
          external
        />
      </div>
    </section>
  );
}

function ResourceLink({
  icon: Icon,
  label,
  description,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground flex items-center gap-1 text-sm font-medium">
          <span className="truncate">{label}</span>
          {external ? (
            <ExternalLink className="text-muted-foreground size-3 shrink-0" />
          ) : (
            <ArrowRight className="text-muted-foreground size-3 shrink-0 opacity-60" />
          )}
        </p>
        <p className="text-muted-foreground truncate text-xs">{description}</p>
      </div>
    </>
  );

  const className =
    "group bg-card hover:bg-muted/50 hover:border-foreground/20 flex items-center gap-3 rounded-xl border p-3 transition-colors";

  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {inner}
    </Link>
  );
}
