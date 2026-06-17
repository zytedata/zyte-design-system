import type { ProductFoundations } from "@zyte/ds-types";

import { Badge } from "@/components/ui/badge";

function previewLineHeightForSize(
  sizePx: number,
  lh: ProductFoundations["typography"]["lineHeight"],
): number {
  if (sizePx >= 36) return lh.tight;
  if (sizePx >= 20) return lh.snug;
  return lh.normal;
}

function letterSpacingToCss(value: number): string {
  return `${value}px`;
}

const GENERIC_FAMILIES = new Set([
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "system-ui",
  "-apple-system",
  "blinkmacsystemfont",
  "sans-serif",
  "serif",
  "monospace",
]);

/** First real family in a CSS font stack, as a human label (e.g. "Montserrat", "Geist Sans"). */
function primaryFamilyName(stack: string, fallback: string): string {
  for (const raw of stack.split(",")) {
    const token = raw.trim();
    const varMatch = token.match(/var\(--font-([a-z0-9-]+)\)/i);
    if (varMatch) {
      return varMatch[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    const cleaned = token.replace(/['"]/g, "").trim();
    if (cleaned && !GENERIC_FAMILIES.has(cleaned.toLowerCase())) return cleaned;
  }
  return fallback;
}

export type TypographyLivePreviewProps = {
  bundle: ProductFoundations;
};

/**
 * Shared live typography specimens (editorial + mono, ladder, weights,
 * leading lab, tracking) — used on Foundations → Typography and on the
 * agentic doc Token surface tab.
 */
export function TypographyLivePreview({ bundle }: TypographyLivePreviewProps) {
  const fontFamily = bundle.typography.family.sans ?? "var(--font-sans)";
  const monoFamily = bundle.typography.family.mono ?? "var(--font-mono)";
  const sansName = primaryFamilyName(fontFamily, "Sans");
  const monoName = primaryFamilyName(monoFamily, "Mono");
  const sansToken = fontFamily.split(",")[0]?.trim() ?? fontFamily;
  const sizes = Object.entries(bundle.typography.size);
  const weights = Object.entries(bundle.typography.weight);
  const lineHeights = Object.entries(bundle.typography.lineHeight);
  const tracking = Object.entries(bundle.typography.letterSpacing);
  const lh = bundle.typography.lineHeight;

  const displaySize =
    bundle.typography.size["5xl"] ?? bundle.typography.size["4xl"] ?? 48;
  const bodySize = bundle.typography.size.sm ?? 14;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
          Fonts in use
        </span>
        <Badge variant="secondary" className="text-xs font-semibold">
          {sansName}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs font-medium">
          {monoName}
        </Badge>
      </div>

      <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed">
        Specimens use the foundation stacks verbatim. Sans resolves to{" "}
        {sansName} via{" "}
        <code className="text-foreground bg-muted rounded px-1 py-0.5 font-mono text-[10px]">
          {sansToken}
        </code>
        {" "}— wire it on the root layout so previews match production.
      </p>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="from-muted/30 via-card to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 lg:col-span-3">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
              Editorial · sans
            </p>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {sansName}
            </Badge>
          </div>
          <p
            className="mt-3 max-w-xl text-balance text-foreground"
            style={{
              fontFamily,
              fontSize: `${displaySize}px`,
              fontWeight: bundle.typography.weight.semibold ?? 600,
              lineHeight: lh.tight,
              letterSpacing: letterSpacingToCss(bundle.typography.letterSpacing.tight),
            }}
          >
            Ship trustworthy marketing UI from one token surface.
          </p>
          <p
            className="text-muted-foreground mt-4 max-w-prose text-pretty"
            style={{
              fontFamily,
              fontSize: `${bodySize}px`,
              fontWeight: bundle.typography.weight.regular ?? 400,
              lineHeight: lh.relaxed,
            }}
          >
            Pair display steps with relaxed body copy. Hierarchy stays legible
            when agents read your spec or humans scan pricing and docs.
          </p>
        </div>

        <div
          className="bg-muted/30 flex flex-col rounded-2xl border p-5 lg:col-span-2"
          style={{ fontFamily: monoFamily }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
              Mono · code
            </p>
            <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
              {monoName}
            </Badge>
          </div>
          <pre className="text-foreground mt-3 flex-1 overflow-x-auto text-[12px] leading-relaxed">
            <code>{`// ${bundle.label} foundations
const { typography } = foundations;
// typography.family.sans → CSS stack`}</code>
          </pre>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Family · sans
            </p>
            <Badge variant="secondary" className="text-[10px]">
              {sansName}
            </Badge>
          </div>
          <p
            className="mt-2 text-balance text-2xl font-medium tracking-tight"
            style={{ fontFamily, lineHeight: lh.tight }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <code className="text-muted-foreground mt-3 line-clamp-2 block font-mono text-[11px] leading-relaxed">
            {fontFamily}
          </code>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Family · mono
            </p>
            <Badge variant="outline" className="font-mono text-[10px]">
              {monoName}
            </Badge>
          </div>
          <pre
            className="text-foreground mt-2 text-left text-xl leading-snug whitespace-pre-wrap"
            style={{ fontFamily: monoFamily }}
          >
            {`const slug = "web";
await loadDesign({ slug });`}
          </pre>
          <code className="text-muted-foreground mt-3 line-clamp-2 block font-mono text-[11px] leading-relaxed">
            {monoFamily}
          </code>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-2xl border">
        <header className="bg-muted/20 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <h4 className="text-sm font-semibold">Type ladder</h4>
          <span className="text-muted-foreground font-mono text-[10px]">
            Line-height pairs with size (tight → relaxed)
          </span>
        </header>
        <ul className="divide-y">
          {sizes.map(([key, value]) => {
            const lineHeight = previewLineHeightForSize(value, lh);
            return (
              <li
                key={key}
                className="hover:bg-muted/15 flex flex-col gap-2 px-4 py-3 transition-colors sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="text-muted-foreground flex shrink-0 items-baseline gap-2 font-mono text-[11px] sm:w-36">
                  <span className="text-foreground font-semibold">{key}</span>
                  <span>{value}px</span>
                </div>
                <p
                  className="min-w-0 flex-1 text-pretty text-foreground"
                  style={{
                    fontFamily,
                    fontSize: `${value}px`,
                    fontWeight: bundle.typography.weight.medium ?? 500,
                    lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
                <span className="text-muted-foreground hidden shrink-0 font-mono text-[10px] sm:block sm:w-24 sm:text-right">
                  lh {lineHeight}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Weights
          </p>
          <ul className="mt-3 space-y-4">
            {weights.map(([key, value]) => (
              <li key={key} className="flex flex-col gap-1">
                <span
                  className="text-lg text-foreground"
                  style={{ fontFamily, fontWeight: value }}
                >
                  Zyte design system
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {key} · {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Leading lab
          </p>
          <p className="text-muted-foreground mt-1 font-mono text-[10px]">
            Fixed {bundle.typography.size.base ?? 16}px body
          </p>
          <ul className="mt-3 space-y-4">
            {lineHeights.map(([key, value]) => (
              <li
                key={key}
                className="border-border/60 border-b border-dotted pb-4 last:border-0 last:pb-0"
              >
                <div className="text-muted-foreground mb-1 flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="text-foreground font-medium">{key}</span>
                  <span>{value}</span>
                </div>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily,
                    fontSize: `${bundle.typography.size.base ?? 16}px`,
                    fontWeight: bundle.typography.weight.regular ?? 400,
                    lineHeight: value,
                  }}
                >
                  Readable body copy should breathe. This line shows how the same
                  font size expands or contracts as line-height changes.
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Letter spacing
          </p>
          <ul className="mt-3 space-y-3">
            {tracking.map(([key, value]) => (
              <li key={key} className="flex flex-col gap-1">
                <span
                  className="text-foreground uppercase"
                  style={{
                    fontFamily,
                    fontSize: `${bundle.typography.size.sm ?? 14}px`,
                    fontWeight: bundle.typography.weight.semibold ?? 600,
                    letterSpacing: letterSpacingToCss(value),
                    lineHeight: lh.none,
                  }}
                >
                  Agentic token surface
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {key} · {letterSpacingToCss(value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
