"use client";

import * as React from "react";

import type { ProductFoundations } from "@zyte/ds-types";
import { paletteLabelFor } from "@/lib/foundations";
import { cn } from "@/lib/utils";

function isLightHex(hex: string): boolean {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 3 && cleaned.length !== 6) return false;
  const norm =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = parseInt(norm.slice(0, 2), 16);
  const g = parseInt(norm.slice(2, 4), 16);
  const b = parseInt(norm.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

type Section = { id: string; label: string; description?: string };

const SECTIONS: Section[] = [
  { id: "colors", label: "Colors", description: "Brand palettes + semantic mappings." },
  { id: "typography", label: "Typography", description: "Family, sizes, weights, leading and tracking." },
  { id: "spacing", label: "Spacing", description: "Linear scale used for padding, gaps and offsets." },
  { id: "radius", label: "Radius", description: "Corner-radius scale, applied to surfaces and inputs." },
  { id: "shadow", label: "Elevation", description: "Layered shadows for depth and focus." },
  { id: "breakpoint", label: "Breakpoints", description: "Responsive layout switch points." },
  { id: "opacity", label: "Opacity", description: "Alpha values for overlays, disabled and decorative states." },
  { id: "zindex", label: "Z-Index", description: "Stacking order for popovers, modals, ticker, cursor." },
];

function SectionHeading({ section }: { section: Section }) {
  return (
    <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-base font-semibold tracking-tight">{section.label}</h3>
      {section.description ? (
        <p className="text-muted-foreground text-xs">{section.description}</p>
      ) : null}
    </header>
  );
}

function ColorsBlock({ bundle }: { bundle: ProductFoundations }) {
  const palettes = Object.entries(bundle.colors);
  const semantic = Object.entries(bundle.semanticColors);

  return (
    <section>
      <SectionHeading section={SECTIONS[0]!} />
      {semantic.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {semantic.map(([role, paletteId]) => (
            <span
              key={role}
              className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px]"
            >
              <span className="text-foreground font-medium">{role}</span>
              <span aria-hidden="true">→</span>
              <span>{paletteId}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="space-y-5">
        {palettes.map(([paletteId, shades]) => {
          const entries = Object.entries(shades);
          return (
            <article
              key={paletteId}
              className="bg-card overflow-hidden rounded-xl border"
            >
              <header className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">
                    {paletteLabelFor(paletteId)}
                  </h4>
                  <code className="text-muted-foreground font-mono text-[11px]">
                    {paletteId}
                  </code>
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {entries.length} shades
                </span>
              </header>
              <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {entries.map(([shade, hex]) => (
                  <div
                    key={shade}
                    className="bg-card flex items-center gap-3 px-3 py-2"
                  >
                    <span
                      aria-hidden="true"
                      className="ring-border/50 inline-block size-9 shrink-0 rounded-md ring-1"
                      style={{ background: hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-medium">
                        {shade}
                      </div>
                      <div className="text-muted-foreground truncate font-mono text-[11px] uppercase">
                        {hex}
                      </div>
                    </div>
                    {isLightHex(hex) ? (
                      <span
                        aria-hidden="true"
                        className="text-muted-foreground/60 ml-auto text-[10px]"
                      >
                        light
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TypographyBlock({ bundle }: { bundle: ProductFoundations }) {
  const fontFamily = bundle.typography.family.sans ?? "var(--font-sans)";
  const monoFamily = bundle.typography.family.mono ?? "var(--font-mono)";
  const sizes = Object.entries(bundle.typography.size);
  const weights = Object.entries(bundle.typography.weight);
  const lineHeights = Object.entries(bundle.typography.lineHeight);
  const tracking = Object.entries(bundle.typography.letterSpacing);

  return (
    <section>
      <SectionHeading section={SECTIONS[1]!} />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Family · sans
          </p>
          <p
            className="mt-1.5 truncate text-2xl font-medium"
            style={{ fontFamily }}
            title={fontFamily}
          >
            The quick brown fox
          </p>
          <code className="text-muted-foreground mt-2 line-clamp-1 block font-mono text-[11px]">
            {fontFamily}
          </code>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Family · mono
          </p>
          <p
            className="mt-1.5 truncate text-xl"
            style={{ fontFamily: monoFamily }}
            title={monoFamily}
          >
            const tokens = await load();
          </p>
          <code className="text-muted-foreground mt-2 line-clamp-1 block font-mono text-[11px]">
            {monoFamily}
          </code>
        </div>
      </div>

      <div className="bg-card mt-4 rounded-xl border">
        <header className="border-b px-4 py-2.5 text-sm font-semibold">
          Type scale
        </header>
        <ul className="divide-y">
          {sizes.map(([key, value]) => (
            <li
              key={key}
              className="flex items-baseline gap-4 px-4 py-2.5"
            >
              <span className="text-muted-foreground w-16 shrink-0 font-mono text-[11px]">
                {key}
              </span>
              <span
                className="flex-1 truncate font-medium"
                style={{ fontFamily, fontSize: `${value}px`, lineHeight: 1.1 }}
              >
                Aa — Designing tokens
              </span>
              <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
                {value}px
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Weights
          </p>
          <ul className="mt-3 space-y-2.5">
            {weights.map(([key, value]) => (
              <li key={key} className="flex items-center justify-between gap-3">
                <span
                  className="truncate text-base"
                  style={{ fontFamily, fontWeight: value }}
                >
                  Foundation
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
                  {key} · {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Line heights
          </p>
          <ul className="mt-3 space-y-2">
            {lineHeights.map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between gap-3 font-mono text-[11px]"
              >
                <span className="text-foreground">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
            Letter spacing
          </p>
          <ul className="mt-3 space-y-2">
            {tracking.map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between gap-3 font-mono text-[11px]"
              >
                <span className="text-foreground">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SpacingBlock({ bundle }: { bundle: ProductFoundations }) {
  const entries = Object.entries(bundle.spacing).sort(
    ([, a], [, b]) => a - b,
  );
  const max = entries.reduce((m, [, v]) => Math.max(m, v), 1);

  return (
    <section>
      <SectionHeading section={SECTIONS[2]!} />
      <div className="bg-card rounded-xl border">
        <ul className="divide-y">
          {entries.map(([key, value]) => (
            <li
              key={key}
              className="flex items-center gap-4 px-4 py-2.5"
            >
              <span className="text-muted-foreground w-12 shrink-0 font-mono text-[11px]">
                {key}
              </span>
              <span className="text-muted-foreground w-16 shrink-0 font-mono text-[11px]">
                {value}px
              </span>
              <span
                aria-hidden="true"
                className="bg-foreground/80 h-2 rounded-full"
                style={{ width: `${(value / max) * 100}%`, minWidth: 2 }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RadiusBlock({ bundle }: { bundle: ProductFoundations }) {
  const entries = Object.entries(bundle.radius).sort(
    ([, a], [, b]) => a - b,
  );

  return (
    <section>
      <SectionHeading section={SECTIONS[3]!} />
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {entries.map(([key, value]) => (
          <article
            key={key}
            className="bg-card flex flex-col items-start gap-2 rounded-xl border p-3"
          >
            <div
              aria-hidden="true"
              className="bg-foreground/10 flex h-14 w-full items-center justify-center"
              style={{ borderRadius: value }}
            />
            <div className="flex w-full items-baseline justify-between font-mono text-[11px]">
              <span className="text-foreground font-medium">{key}</span>
              <span className="text-muted-foreground">{value}px</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShadowBlock({ bundle }: { bundle: ProductFoundations }) {
  const entries = Object.entries(bundle.shadow);
  return (
    <section>
      <SectionHeading section={SECTIONS[4]!} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, value]) => (
          <article
            key={key}
            className="bg-background flex flex-col gap-3 rounded-xl border p-4"
          >
            <div
              aria-hidden="true"
              className="bg-card h-14 rounded-lg"
              style={{ boxShadow: value }}
            />
            <div>
              <p className="font-mono text-[11px] font-medium">{key}</p>
              <p className="text-muted-foreground line-clamp-2 font-mono text-[10px]">
                {value}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScaleListBlock({
  section,
  entries,
  formatValue,
}: {
  section: Section;
  entries: Array<[string, number]>;
  formatValue: (value: number) => string;
}) {
  return (
    <section>
      <SectionHeading section={section} />
      <div className="bg-card rounded-xl border">
        <ul className="divide-y">
          {entries.map(([key, value]) => (
            <li
              key={key}
              className="flex items-center justify-between gap-4 px-4 py-2"
            >
              <span className="font-mono text-[12px] font-medium">{key}</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {formatValue(value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OpacityBlock({ bundle }: { bundle: ProductFoundations }) {
  const entries = Object.entries(bundle.opacity).sort(
    ([, a], [, b]) => a - b,
  );
  return (
    <section>
      <SectionHeading section={SECTIONS[6]!} />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {entries.map(([key, value]) => (
          <article
            key={key}
            className="bg-card overflow-hidden rounded-xl border"
          >
            <div
              aria-hidden="true"
              className="bg-foreground h-12"
              style={{ opacity: value }}
            />
            <div className="flex items-baseline justify-between px-3 py-2 font-mono text-[11px]">
              <span className="text-foreground font-medium">{key}</span>
              <span className="text-muted-foreground">
                {Math.round(value * 100)}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TokenSurface({ bundle }: { bundle: ProductFoundations }) {
  const breakpointEntries = Object.entries(bundle.breakpoint).sort(
    ([, a], [, b]) => a - b,
  );
  const zIndexEntries = Object.entries(bundle.zIndex).sort(
    ([, a], [, b]) => a - b,
  );

  return (
    <div className={cn("space-y-10")}>
      <ColorsBlock bundle={bundle} />
      <TypographyBlock bundle={bundle} />
      <SpacingBlock bundle={bundle} />
      <RadiusBlock bundle={bundle} />
      <ShadowBlock bundle={bundle} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ScaleListBlock
          section={SECTIONS[5]!}
          entries={breakpointEntries}
          formatValue={(v) => `${v}px`}
        />
        <ScaleListBlock
          section={SECTIONS[7]!}
          entries={zIndexEntries}
          formatValue={(v) => v.toString()}
        />
      </div>
      <OpacityBlock bundle={bundle} />
    </div>
  );
}
