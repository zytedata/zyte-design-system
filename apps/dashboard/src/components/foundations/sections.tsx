import type { LucideIcon } from "lucide-react";

import type { ProductFoundations } from "@zytedata/ds-types";
import type { FileChangelog } from "@zytedata/ds-types";
import type {
  CanonicalDocPayload,
  GeneratedArtefact,
} from "@/data/foundations/docs";
import { cn } from "@/lib/utils";
import { paletteRowsFor } from "@/lib/foundations";
import { TAILWIND_COLOR_FAMILIES } from "@/data/tailwind-palette";

import { AgenticDoc } from "@/components/foundations/agentic-doc";
import { ChangelogView } from "@/components/foundations/changelog-view";
import { CopyableSwatch } from "@/components/foundations/copyable-swatch";
import { GeneratedArtefacts } from "@/components/foundations/generated-artefacts";
import { LucideIconsCatalog } from "@/components/foundations/lucide-icons-catalog";
import { TypographyLivePreview } from "@/components/foundations/typography-live-preview";
import { Badge } from "@/components/ui/badge";

// ─── Color palette section ─────────────────────────────────────────────────

export function PaletteSection({
  bundle,
  paletteId,
  productId,
}: {
  bundle: ProductFoundations;
  paletteId: string;
  productId: string;
}) {
  const rows = paletteRowsFor(bundle, paletteId);

  return (
    <section className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Source:{" "}
        <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-xs">
          PRODUCT_FOUNDATIONS.{productId}.colors.{paletteId}
        </code>{" "}
        in{" "}
        <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-xs">
          src/data/foundations/{productId}.ts
        </code>
        .
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((color) => (
          <CopyableSwatch
            key={color.name}
            value={color.hex}
            label={color.hex}
            className="bg-card overflow-hidden rounded-xl border"
          >
            <div aria-hidden="true" className="h-20" style={{ background: color.hex }} />
            <div className="space-y-1 p-3">
              <h3 className="font-mono text-sm font-medium">{color.name}</h3>
              <p className="text-muted-foreground font-mono text-xs uppercase">{color.hex}</p>
              <p className="text-muted-foreground/80 truncate font-mono text-[10px]">
                {color.utility}
              </p>
            </div>
          </CopyableSwatch>
        ))}
      </div>
    </section>
  );
}

// ─── Generic scale table ───────────────────────────────────────────────────

type ScaleRow = { token: string; value: string; utility?: string };

export function ScaleTable({ rows }: { rows: ScaleRow[] }) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground text-sm">No tokens declared for this scale yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-muted-foreground text-left text-xs tracking-wide uppercase">
            <th className="px-4 py-2.5 font-medium">Token</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="px-4 py-2.5 font-medium">Utility</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.token}>
              <td className="px-4 py-2 font-mono text-xs">{row.token}</td>
              <td className="text-muted-foreground px-4 py-2 font-mono text-xs">{row.value}</td>
              <td className="text-muted-foreground/80 px-4 py-2 font-mono text-xs">
                {row.utility ?? row.token}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Spacing / radius / shadow / breakpoints / opacity / z-index ───────────

function formatPxToRem(px: number, includePx = true): string {
  if (px === 0) return "0px";
  if (px === 9999) return "9999px";
  const rem = px / 16;
  const remStr = `${rem}rem`;
  return includePx ? `${remStr} (${px}px)` : remStr;
}

export function SpacingSection({ bundle }: { bundle: ProductFoundations }) {
  const rows: ScaleRow[] = Object.entries(bundle.spacing).map(([token, px]) => ({
    token,
    value: formatPxToRem(px),
    utility: /^\d+(\.\d+)?$/.test(token)
      ? `p-${token} / m-${token} / gap-${token}`
      : `var(--spacing-${token})`,
  }));
  return <ScaleTable rows={rows} />;
}

export function RadiusShadowSection({ bundle }: { bundle: ProductFoundations }) {
  const radius: ScaleRow[] = Object.entries(bundle.radius).map(([token, px]) => {
    const tw = token === "DEFAULT" ? "rounded" : `rounded-${token}`;
    return {
      token: tw,
      value: px === 0 ? "0px" : px === 9999 ? "9999px" : formatPxToRem(px, false),
      utility: tw,
    };
  });
  const shadow: ScaleRow[] = Object.entries(bundle.shadow).map(([token, value]) => {
    const tw = token === "DEFAULT" ? "shadow" : `shadow-${token}`;
    return { token: tw, value, utility: tw };
  });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Radius</h3>
        <ScaleTable rows={radius} />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Shadow</h3>
        <ScaleTable rows={shadow} />
      </section>
    </div>
  );
}

export function BreakpointsSection({ bundle }: { bundle: ProductFoundations }) {
  const rows: ScaleRow[] = Object.entries(bundle.breakpoint).map(([token, px]) => ({
    token,
    value: `${px}px`,
    utility: `${token}:*`,
  }));
  return <ScaleTable rows={rows} />;
}

export function OpacityZIndexSection({ bundle }: { bundle: ProductFoundations }) {
  const opacity: ScaleRow[] = Object.entries(bundle.opacity).map(([token, value]) => ({
    token: token.startsWith("opacity-") ? token : `opacity-${token}`,
    value: String(value),
    utility: token.startsWith("opacity-") ? token : `opacity-${token}`,
  }));
  const zIndex: ScaleRow[] = Object.entries(bundle.zIndex).map(([token, value]) => ({
    token: token.startsWith("z-") ? token : `z-${token}`,
    value: String(value),
    utility: token.startsWith("z-") ? token : `z-${token}`,
  }));
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Opacity</h3>
        <ScaleTable rows={opacity} />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Z-Index</h3>
        <ScaleTable rows={zIndex} />
      </section>
    </div>
  );
}

// ─── Sizing (static for Web/Tailwind) ──────────────────────────────────────

const SIZING_SCALE: ScaleRow[] = [
  { token: "w-0 / h-0", value: "0px", utility: "w-0 / h-0" },
  { token: "w-4 / h-4", value: "1rem (16px)", utility: "w-4 / h-4" },
  { token: "w-8 / h-8", value: "2rem (32px)", utility: "w-8 / h-8" },
  { token: "w-16 / h-16", value: "4rem (64px)", utility: "w-16 / h-16" },
  { token: "w-24 / h-24", value: "6rem (96px)", utility: "w-24 / h-24" },
  { token: "w-32 / h-32", value: "8rem (128px)", utility: "w-32 / h-32" },
  { token: "w-48", value: "12rem (192px)", utility: "w-48" },
  { token: "w-64", value: "16rem (256px)", utility: "w-64" },
  { token: "w-auto / h-auto", value: "auto", utility: "w-auto / h-auto" },
  { token: "w-full / h-full", value: "100%", utility: "w-full / h-full" },
  { token: "max-w-2xl", value: "42rem (672px)", utility: "max-w-2xl" },
  { token: "max-w-7xl", value: "80rem (1280px)", utility: "max-w-7xl" },
];

export function SizingSection() {
  return <ScaleTable rows={SIZING_SCALE} />;
}

// ─── Typography ────────────────────────────────────────────────────────────

export function TypographySection({ bundle }: { bundle: ProductFoundations }) {
  const sizes: ScaleRow[] = Object.entries(bundle.typography.size).map(([token, px]) => {
    const lh =
      bundle.typography.lineHeight[token] ??
      bundle.typography.lineHeight["default"] ??
      bundle.typography.lineHeight["normal"] ??
      1.5;
    return {
      token,
      value: `${px / 16}rem (${px}px) / ${lh}`,
      utility: token.startsWith("text-") ? token : `text-[${px}px]`,
    };
  });

  const families: ScaleRow[] = Object.entries(bundle.typography.family).map(
    ([token, stack]) => ({
      token,
      value: stack,
      utility: `typography.family.${token}`,
    }),
  );

  return (
    <div className="space-y-10">
      <p className="text-muted-foreground text-sm leading-relaxed">
        Same live specimens as the agentic{" "}
        <span className="text-foreground font-medium">Token surface</span> tab
        (LLM Design.md): editorial + mono cards, type ladder, weights, leading lab,
        and letter-spacing samples — all driven by the current foundations bundle.
      </p>
      <TypographyLivePreview bundle={bundle} />
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">
          Reference · font stacks
        </h3>
        <ScaleTable rows={families} />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase">
          Reference · type scale
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Machine-readable rem/px and a suggested utility hint per step (Tailwind-style).
        </p>
        <ScaleTable rows={sizes} />
      </section>
    </div>
  );
}

// ─── Agent (DESIGN.md) ─────────────────────────────────────────────────────

export function AgenticSection({
  bundle,
  productLabel,
  productSlug,
  icon,
  accent,
  doc,
  artefacts,
}: {
  bundle: ProductFoundations;
  productLabel: string;
  productSlug: string;
  icon: LucideIcon;
  accent: "pink" | "indigo" | "amber" | "lime";
  doc: CanonicalDocPayload | null;
  artefacts: GeneratedArtefact[];
}) {
  const Icon = icon;
  const meta = bundle.canonicalDoc;

  if (!meta) {
    return (
      <article className="bg-card space-y-3 rounded-xl border p-6">
        <Badge variant="secondary">No canonical DESIGN.md</Badge>
        <h3 className="text-lg font-semibold">Agentic spec not wired</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This product does not declare a <code>canonicalDoc</code> yet. Add the prose to{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            packages/{productSlug}/src/design.body.md
          </code>{" "}
          and the tokens to <code>foundations.ts</code>; running{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            pnpm tokens:build
          </code>{" "}
          regenerates <code>dist/design.md</code> for preview, copy and download here.
        </p>
      </article>
    );
  }

  if (!doc) {
    return (
      <article className="bg-card space-y-3 rounded-xl border p-6">
        <Badge variant="secondary">canonicalDoc · v{meta.version}</Badge>
        <h3 className="text-lg font-semibold">{meta.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Failed to load{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {meta.assetPath}
          </code>
          . Confirm the markdown file exists in the source tree.
        </p>
      </article>
    );
  }

  return (
    <div className="space-y-6">
      <AgenticDoc
        productLabel={productLabel}
        productSlug={productSlug}
        icon={<Icon className="size-6" />}
        accent={accent}
        meta={meta}
        doc={doc}
        bundle={bundle}
      />
      <GeneratedArtefacts productLabel={productLabel} artefacts={artefacts} />
    </div>
  );
}

// ─── Tailwind colors ───────────────────────────────────────────────────────

const NEUTRAL_FAMILIES = new Set(["slate", "gray", "zinc", "neutral", "stone"]);

export function TailwindColorsSection() {
  const totalShades = TAILWIND_COLOR_FAMILIES.reduce(
    (sum, family) => sum + family.shades.length,
    0,
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm leading-relaxed">
          The full default Tailwind palette — {TAILWIND_COLOR_FAMILIES.length}{" "}
          families × 11 shades ({totalShades.toLocaleString()} swatches). Use
          neutral ramps for non-brand surfaces and overlay product-specific
          palettes on top.
        </p>
      </header>

      <div className="space-y-3">
        {TAILWIND_COLOR_FAMILIES.map((family) => (
          <article
            key={family.name}
            className="bg-card overflow-hidden rounded-xl border"
          >
            <header className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold capitalize">
                  {family.name}
                </h3>
                {NEUTRAL_FAMILIES.has(family.name) ? (
                  <Badge variant="secondary" className="text-[10px]">
                    Neutral
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground font-mono text-[10px]">
                bg-{family.name}-* / text-{family.name}-*
              </p>
            </header>
            <div
              className="grid divide-x border-t"
              style={{
                gridTemplateColumns: `repeat(${family.shades.length}, minmax(0, 1fr))`,
              }}
            >
              {family.shades.map((shade) => {
                const lighter = Number(shade.shade) <= 400;
                return (
                  <CopyableSwatch
                    key={shade.shade}
                    value={shade.hex}
                    label={`${family.name}-${shade.shade} (${shade.hex})`}
                    className="group flex h-20 flex-col justify-end p-2"
                    badgeClassName="top-1.5 right-1.5"
                    style={{ background: shade.hex }}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] font-medium tracking-wide",
                        lighter ? "text-slate-900/80" : "text-white/90",
                      )}
                    >
                      {shade.shade}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[9px] tabular-nums opacity-0 transition-opacity group-hover:opacity-100",
                        lighter ? "text-slate-900/70" : "text-white/80",
                      )}
                    >
                      {shade.hex}
                    </span>
                  </CopyableSwatch>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Lucide icons ──────────────────────────────────────────────────────────

export function LucideIconsSection() {
  return <LucideIconsCatalog />;
}

// ─── Changelog ─────────────────────────────────────────────────────────────

export function ChangelogSection({
  changelogs,
  productSlug,
}: {
  changelogs: FileChangelog[];
  productSlug: string;
}) {
  return <ChangelogView changelogs={changelogs} productSlug={productSlug} />;
}
