import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

import { WEB_FOUNDATIONS } from "@zyte/ds-web";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { PRODUCT_LIST, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { HeroBackdrop } from "@/components/landing/hero-backdrop";
import { MarketingTopbar } from "@/components/layout/marketing-topbar";

const HEADLINE_GRADIENT = WEB_FOUNDATIONS.colors.headlineGradient.DEFAULT;
const BRAND = WEB_FOUNDATIONS.colors.primary["600"];
const BRAND_HOVER = WEB_FOUNDATIONS.colors.primary["700"];
const CANONICAL_DOC_VERSION = WEB_FOUNDATIONS.canonicalDoc?.version ?? "0.1";

const brandCssVars: CSSProperties = {
  ["--brand" as string]: BRAND,
  ["--brand-hover" as string]: BRAND_HOVER,
};

const ACCENT_CHIP: Record<Product["accent"], string> = {
  pink: "bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  lime: "bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
};

function productSummary(product: Product): string {
  switch (product.id) {
    case "web":
      return "Design system for the marketing site, blog, pricing and supporting docs UI.";
    case "core":
      return "Platform UI for dashboards, settings and internal tools — built for power users.";
    case "scrapy":
      return "Documentation-first design system for the Scrapy framework and its ecosystem.";
    case "extractSummit":
      return "Brutalist Wolff Olins-inspired identity for the Extract Summit website and stage.";
  }
}

const HERO_META: { label: string; value: string }[] = [
  { label: "Products", value: String(PRODUCT_LIST.length).padStart(2, "0") },
  { label: "Spec format", value: "DESIGN.md" },
  { label: "Tokens", value: "Live" },
  { label: "Edition", value: `v${CANONICAL_DOC_VERSION}` },
];

export default function LandingPage() {
  return (
    <>
      <MarketingTopbar />

      <main>
        <section
          className="relative isolate overflow-hidden border-b"
          style={brandCssVars}
        >
          <HeroBackdrop />

          <div className="relative mx-auto w-full max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            {/* Readability scrim — a soft fade of the page background sitting
              * underneath the headline + subtitle + CTAs + meta so the
              * animated snakes and grid lines stop competing with the copy
              * for contrast. Edge-faded by a radial mask so it blends back
              * into the hero on every side; `-z-10` keeps it BELOW the
              * content (which sits at `relative`'s default z=0) but still
              * ABOVE the section's `-z-10` backdrop layer. */}
            <div
              aria-hidden="true"
              className="dark:bg-background/60 bg-background/55 pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 backdrop-blur-[2px] [mask-image:radial-gradient(ellipse_70%_75%_at_30%_50%,black,transparent_85%)]"
            />

            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
              {siteConfig.shortName}
              <span className="text-border mx-2" aria-hidden="true">
                /
              </span>
              DesignOps workspace
              <span className="text-border mx-2" aria-hidden="true">
                /
              </span>
              alpha
            </p>

            <h1 className="mt-6 max-w-4xl text-balance text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">
              The Zyte{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: HEADLINE_GRADIENT }}
              >
                design system
              </span>
              .
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-base leading-relaxed md:text-lg">
              {siteConfig.tagline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] [a]:hover:bg-[var(--brand-hover)]"
              >
                <Link href="/products/web">
                  Open Web workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
        
              <Button variant="ghost" size="lg" asChild>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>

            <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-6 border-t pt-8 md:grid-cols-4">
              {HERO_META.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-muted/20 border-b">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
            <header className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                  01 — Workspaces
                </p>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                  Pick a product workspace.
                </h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                Each scope ships its own foundations, components catalog, and
                canonical agentic spec. Pick where you want to land — switch
                anytime from the workspace sidebar.
              </p>
            </header>

            <div className="bg-border mt-12 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2">
              {PRODUCT_LIST.map((product) => {
                const Icon = product.icon;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={cn(
                      "group bg-card hover:bg-card/60 flex flex-col p-8 transition-colors md:p-10",
                    )}
                  >
                    <header className="flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          "inline-flex size-11 items-center justify-center rounded-xl",
                          ACCENT_CHIP[product.accent],
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                      <code className="text-muted-foreground font-mono text-[11px] tracking-tight">
                        /products/{product.slug}
                      </code>
                    </header>

                    <h3 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
                      {product.label}
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
                      {productSummary(product)}
                    </p>

                    <span className="text-foreground mt-auto inline-flex items-center gap-2 pt-10 text-sm font-medium">
                      Open workspace
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="border-t">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs md:flex-row">
            <span className="font-mono tracking-tight">
              © {new Date().getFullYear()} Zyte
              <span className="text-border mx-2" aria-hidden="true">
                /
              </span>
              {siteConfig.shortName} alpha
            </span>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <li>
                  <Link href="/products/web" className="hover:text-foreground">
                    Web
                  </Link>
                </li>
                <li>
                  <Link href="/products/core" className="hover:text-foreground">
                    Core
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/scrapy"
                    className="hover:text-foreground"
                  >
                    Scrapy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/extract-summit"
                    className="hover:text-foreground"
                  >
                    Extract Summit
                  </Link>
                </li>
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
