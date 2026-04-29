import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { PRODUCT_LIST, type Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingTopbar } from "@/components/layout/marketing-topbar";

const ACCENT_CLASSES: Record<Product["accent"], string> = {
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
};

const ACCENT_RING: Record<Product["accent"], string> = {
  pink: "group-hover:border-pink-300 dark:group-hover:border-pink-500/40",
  indigo: "group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40",
  amber: "group-hover:border-amber-300 dark:group-hover:border-amber-500/40",
  lime: "group-hover:border-lime-300 dark:group-hover:border-lime-500/40",
};

const FEATURE_HIGHLIGHTS = [
  {
    title: "One source of tokens",
    body: "Foundations, palettes and type scales rendered live from the same data agents consume.",
  },
  {
    title: "Per-product workspaces",
    body: "Web, Core, Scrapy and Extract Summit each get a tailored set of foundations and components.",
  },
  {
    title: "Agentic by default",
    body: "Every product ships a canonical DESIGN.md — copy, download, or feed it straight to a coding agent.",
  },
];

function productHighlights(product: Product): string[] {
  return product.nav
    .filter((item) => item.label.toLowerCase() !== "dashboard")
    .slice(0, 4)
    .map((item) => item.label);
}

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

export default function LandingPage() {
  return (
    <>
      <MarketingTopbar />

      <main>
        <section className="from-background via-background to-muted/40 relative overflow-hidden border-b bg-gradient-to-b">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in oklab, var(--foreground) 5%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
          />

          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 pt-20 pb-24 text-center md:pt-28">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase"
            >
              <Sparkles className="size-3" /> DesignOps workspace
            </Badge>

            <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
              {siteConfig.name}
            </h1>

            <p className="text-muted-foreground max-w-2xl text-pretty text-base leading-relaxed md:text-lg">
              {siteConfig.tagline}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/products/web">
                  Open Web workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in">Sign in</Link>
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

            <ul className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
              {siteConfig.meta.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-muted-foreground/40 size-1 rounded-full"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              Workspaces
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Pick a product workspace
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Each scope ships its own foundations, components catalog, and
              canonical agentic spec. Pick where you want to land — switch
              anytime from the workspace sidebar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRODUCT_LIST.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={cn(
                    "group bg-card hover:bg-accent/40 relative flex flex-col rounded-2xl border p-6 transition-colors",
                    ACCENT_RING[product.accent],
                  )}
                >
                  <header className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-xl",
                        ACCENT_CLASSES[product.accent],
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Product
                    </Badge>
                  </header>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    {product.label}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {productSummary(product)}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {productHighlights(product).map((highlight) => (
                      <li key={highlight}>
                        <span className="bg-muted text-muted-foreground inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <span className="text-foreground mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                    Open {product.label}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-muted/30 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Why this exists
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Built for designers, engineers and agents
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FEATURE_HIGHLIGHTS.map((feature) => (
                <article
                  key={feature.title}
                  className="bg-card rounded-2xl border p-6"
                >
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs md:flex-row">
            <span>
              © {new Date().getFullYear()} Zyte. {siteConfig.shortName} alpha.
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
                  <Link href="/products/scrapy" className="hover:text-foreground">
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
