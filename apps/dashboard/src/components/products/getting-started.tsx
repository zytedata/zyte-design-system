"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  ExternalLink,
  Palette,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import type { ProductDocLinks } from "@/data/documentation";
import type { TemplateCard } from "@/data/templates";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DesignMdActions } from "@/components/products/design-md-actions";
import { InstallCommand } from "@/components/products/install-command";
import { UseCaseGallery } from "@/components/products/use-case-gallery";

type ScenarioAccent = "violet" | "pink" | "indigo" | "amber";

const ACCENT_BG: Record<ScenarioAccent, string> = {
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export type GettingStartedCapabilities = {
  prototyping: boolean;
  templates: boolean;
  documentation: boolean;
  assets: boolean;
};

export type GettingStartedProps = {
  productLabel: string;
  productSlug: string;
  packageName: string;
  version: string | null;
  links: ProductDocLinks;
  capabilities: GettingStartedCapabilities;
  /** Canonical design.md, when the product ships one. */
  designDoc: { content: string; filename: string } | null;
  /** Use-case templates surfaced as a "what you can build" snapshot. */
  templates: TemplateCard[];
};

type Scenario = {
  key: string;
  icon: LucideIcon;
  accent: ScenarioAccent;
  title: string;
  tagline: string;
  badges: string[];
  body: React.ReactNode;
};

export function GettingStarted({
  productLabel,
  productSlug,
  packageName,
  version,
  links,
  capabilities,
  designDoc,
  templates,
}: GettingStartedProps) {
  const npmrcNote = (
    <>
      Requires <code className="font-mono">.npmrc</code> with the{" "}
      <code className="font-mono">@zytedata</code> scope pointed at GitHub Packages.
    </>
  );

  const scenarios: Scenario[] = [];

  // 1. Vibe coding — easiest path, no install. Only when a spec exists.
  if (designDoc) {
    scenarios.push({
      key: "vibe-coding",
      icon: Sparkles,
      accent: "violet",
      title: "Vibe coding with AI",
      tagline: `Describe what you want in plain English — your AI assistant matches the ${productLabel} look from one spec file. No install, no build step.`,
      badges: ["No install", "~2 min"],
      body: (
        <div className="space-y-5">
          <Steps>
            <Step n={1} title="Grab the spec">
              <p>
                Copy or download <code className="font-mono">design.md</code> — the
                machine-readable token layer plus a human implementation guide,
                served verbatim to coding agents.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <DesignMdActions
                  content={designDoc.content}
                  filename={designDoc.filename}
                />
                <code className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[11px]">
                  {designDoc.filename}
                </code>
              </div>
            </Step>
            <Step n={2} title="Drop it into your AI tool">
              <p>
                Paste it into Cursor, Claude, v0, or ChatGPT as project context (a
                pinned file or system prompt works best).
              </p>
            </Step>
            <Step n={3} title="Prompt away">
              <p>
                Ask for a screen or component — the assistant follows{" "}
                {productLabel}&apos;s colours, type scale, spacing, and rules
                automatically.
              </p>
            </Step>
          </Steps>
          <ActionRow>
            <ActionLink href={links.designMd} label="Open the Agentic surface" />
          </ActionRow>
        </div>
      ),
    });
  }

  // 2. Prototyping — install the package, wire tokens, start from templates.
  if (capabilities.prototyping || capabilities.templates) {
    scenarios.push({
      key: "prototyping",
      icon: Wand2,
      accent: "pink",
      title: "Prototyping",
      tagline: `Spin up a working prototype on real ${productLabel} tokens${
        capabilities.templates ? " and ready-made templates" : ""
      }.`,
      badges: ["Install", "~5 min"],
      body: (
        <div className="space-y-5">
          <Steps>
            <Step n={1} title="Install the package">
              <InstallCommand
                packageName={packageName}
                note={npmrcNote}
                className="mt-1"
              />
            </Step>
            <Step n={2} title="Wire the tokens">
              <p>
                Import the Tailwind preset or <code className="font-mono">tokens.css</code>{" "}
                so utilities resolve to {productLabel} values.
              </p>
              <CodeBlock>{`// tailwind.config.ts\nimport preset from "${packageName}/tailwind";\nexport default { presets: [preset] };`}</CodeBlock>
            </Step>
            {capabilities.templates ? (
              <Step n={3} title="Start from a template">
                <p>
                  Compose pages from ready-made {productLabel} templates instead of
                  building layouts from scratch.
                </p>
              </Step>
            ) : null}
          </Steps>
          <ActionRow>
            {capabilities.prototyping ? (
              <ActionLink
                href={`/products/${productSlug}/prototyping`}
                label="Open Prototyping"
              />
            ) : null}
            {capabilities.templates ? (
              <ActionLink
                href={`/products/${productSlug}/templates`}
                label="Browse Templates"
              />
            ) : null}
          </ActionRow>
        </div>
      ),
    });
  }

  // 3. Production engineer — authenticated install, typed foundations, releases.
  if (capabilities.documentation) {
    scenarios.push({
      key: "production",
      icon: Code2,
      accent: "indigo",
      title: "Production engineer",
      tagline: `Set up ${productLabel} properly in a production app — authenticated installs, typed foundations, and releases you can track.`,
      badges: ["Full setup"],
      body: (
        <div className="space-y-5">
          <Steps>
            <Step n={1} title="Authenticate the registry">
              <p>
                Point the <code className="font-mono">@zytedata</code> scope at GitHub
                Packages in your <code className="font-mono">.npmrc</code>.
              </p>
              <CodeBlock>{`# .npmrc\n@zytedata:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`}</CodeBlock>
            </Step>
            <Step n={2} title="Install">
              <InstallCommand packageName={packageName} className="mt-1" />
              {version ? (
                <p className="mt-2">
                  Latest published version:{" "}
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    v{version}
                  </Badge>
                </p>
              ) : null}
            </Step>
            <Step n={3} title="Import foundations & components">
              <CodeBlock>{`import { ${foundationsConst(productSlug)} } from "${packageName}";\nimport "${packageName}/tokens.css";`}</CodeBlock>
            </Step>
            <Step n={4} title="Track releases">
              <p>
                Follow the changelog and releasing guide so token changes never
                surprise a deploy.
              </p>
            </Step>
          </Steps>
          <ActionRow>
            <ActionLink
              href={`/products/${productSlug}/documentation`}
              label="Documentation"
            />
            <ActionLink href={links.foundations} label="Foundations" />
            <ActionLink href={links.changelog} label="Changelog" />
            <ActionLink href={links.releasing} label="Releasing guide" external />
          </ActionRow>
        </div>
      ),
    });
  }

  // 4. Designer / Figma — brand, assets, design tokens.
  if (capabilities.assets) {
    scenarios.push({
      key: "designer",
      icon: Palette,
      accent: "amber",
      title: "Designer / Figma",
      tagline: `Pull ${productLabel} brand guidelines, assets, and design tokens straight into your design tooling.`,
      badges: ["Design tooling"],
      body: (
        <div className="space-y-5">
          <Steps>
            <Step n={1} title="Read the brand guidelines">
              <p>Voice, logo usage, and the colour principles behind {productLabel}.</p>
            </Step>
            <Step n={2} title="Grab the assets">
              <p>Logos and illustrations ready to drop into a design file.</p>
            </Step>
            <Step n={3} title="Use the design tokens">
              <p>
                The same <code className="font-mono">tokens.json</code> your engineers
                consume — keep design and code in lockstep.
              </p>
            </Step>
          </Steps>
          <ActionRow>
            <ActionLink href={`/products/${productSlug}/brand`} label="Brand" />
            <ActionLink href={`/products/${productSlug}/assets`} label="Assets" />
          </ActionRow>
        </div>
      ),
    });
  }

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold">Pick the path that matches how you work</h2>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          From the fastest way to borrow the {productLabel} look to a full
          production setup — start wherever you are.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {scenarios.map((scenario, index) => (
          <ScenarioCard
            key={scenario.key}
            scenario={scenario}
            defaultOpen={index === 0}
          />
        ))}
      </div>

      <div className="border-border/60 mt-12 border-t pt-10">
        <UseCaseGallery
          productLabel={productLabel}
          productSlug={productSlug}
          prototypingEnabled={capabilities.prototyping}
          templates={templates}
        />
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  defaultOpen,
}: {
  scenario: Scenario;
  defaultOpen: boolean;
}) {
  const Icon = scenario.icon;
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <section className="bg-card rounded-2xl border">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group hover:bg-muted/40 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-colors"
          >
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
                ACCENT_BG[scenario.accent],
              )}
              aria-hidden="true"
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold">{scenario.title}</span>
                {scenario.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-[10px]">
                    {badge}
                  </Badge>
                ))}
              </span>
              <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                {scenario.tagline}
              </span>
            </span>
            <ChevronDown
              className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 border-t">
          <div className="p-5">{scenario.body}</div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-5">{children}</ol>;
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span
        className="bg-muted text-foreground mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="text-muted-foreground min-w-0 flex-1 text-sm leading-relaxed">
        <p className="text-foreground font-medium">{title}</p>
        <div className="mt-1 space-y-1">{children}</div>
      </div>
    </li>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted/40 mt-3 overflow-auto rounded-xl border p-3 font-mono text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2.5">{children}</div>;
}

function ActionLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "group bg-card hover:bg-muted/50 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors";
  const inner = (
    <>
      <span>{label}</span>
      {external ? (
        <ExternalLink className="text-muted-foreground size-3.5" />
      ) : (
        <ArrowRight className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** Maps a product slug to its exported foundations constant name. */
function foundationsConst(slug: string): string {
  const base = slug.replace(/-/g, "_").toUpperCase();
  return `${base}_FOUNDATIONS`;
}
