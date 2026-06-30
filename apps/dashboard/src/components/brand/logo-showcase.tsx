import { X } from "lucide-react";

import { ZyteLogo } from "@/components/common/zyte-logo";
import { LogoDownloadButtons } from "@/components/brand/logo-download-buttons";
import type { ZyteLogoFill } from "@/lib/zyte-logo-svg";

/** Zyte brand colours (mirrors packages/web foundations). */
const FUCHSIA = "#C026D3";
const INK = "#0D0D14";

/** Wordmark aspect ratio from the SVG viewBox (972 × 420). */
const RATIO = 420 / 972;

// Three approved variants: primary is the brand fuchsia wordmark; mono (ink)
// and reversed (white) cover single-colour and dark surfaces. No gradient.
const FILL_PRIMARY: ZyteLogoFill = { type: "solid", color: FUCHSIA };
const FILL_MONO: ZyteLogoFill = { type: "solid", color: INK };
const FILL_REVERSED: ZyteLogoFill = { type: "solid", color: "#FFFFFF" };

function logoHeight(width: number): number {
  return Math.round(width * RATIO);
}

function TileFooter({
  caption,
  name,
  fill,
}: {
  caption: string;
  name: string;
  fill: ZyteLogoFill;
}) {
  return (
    <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2">
      <p className="text-muted-foreground text-xs">{caption}</p>
      <LogoDownloadButtons name={name} fill={fill} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-muted-foreground mb-4 font-mono text-[11px] tracking-[0.16em] uppercase">
      {children}
    </h2>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground mt-3 text-xs leading-relaxed">{children}</p>;
}

export function BrandLogoShowcase() {
  const primaryWidth = 220;

  return (
    <div className="space-y-12">
      {/* Primary lockup — on light and on dark */}
      <section>
        <SectionLabel>Primary logo</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-border/60 overflow-hidden rounded-lg border">
            <div className="flex items-center justify-center bg-white p-12">
              <ZyteLogo
                width={primaryWidth}
                height={logoHeight(primaryWidth)}
                className="text-[#C026D3]"
              />
            </div>
            <TileFooter
              caption="On light — primary (fuchsia) wordmark"
              name="primary"
              fill={FILL_PRIMARY}
            />
          </div>
          <div className="border-border/60 overflow-hidden rounded-lg border">
            <div
              className="flex items-center justify-center p-12"
              style={{ backgroundColor: INK }}
            >
              <ZyteLogo
                width={primaryWidth}
                height={logoHeight(primaryWidth)}
                className="text-white"
              />
            </div>
            <TileFooter
              caption="On dark — reversed (white) wordmark"
              name="reversed"
              fill={FILL_REVERSED}
            />
          </div>
        </div>
      </section>

      {/* Clear space */}
      <section>
        <SectionLabel>Clear space</SectionLabel>
        <div className="border-border/60 rounded-lg border bg-white p-8">
          <div className="relative inline-block">
            {/* Dashed clear-space boundary; padding ≈ cap height of the "Z". */}
            <div className="border-2 border-dashed border-fuchsia-400 p-10">
              <ZyteLogo width={200} height={logoHeight(200)} className="text-[#0D0D14]" />
            </div>
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 font-mono text-[10px] tracking-widest text-fuchsia-500 uppercase">
              X
            </span>
            <span className="absolute top-1/2 -left-2.5 -translate-y-1/2 -rotate-90 bg-white px-2 font-mono text-[10px] tracking-widest text-fuchsia-500 uppercase">
              X
            </span>
          </div>
        </div>
        <Caption>
          Keep clear space of at least <span className="font-medium">X</span> — the height of the
          “Z” — on all sides. Nothing (text, imagery, edges) should intrude on this zone.
        </Caption>
      </section>

      {/* Minimum sizes */}
      <section>
        <SectionLabel>Minimum size</SectionLabel>
        <div className="border-border/60 flex flex-wrap items-end gap-10 rounded-lg border bg-white p-8">
          <div className="flex flex-col items-center gap-3">
            <ZyteLogo width={160} height={logoHeight(160)} className="text-[#0D0D14]" />
            <span className="text-muted-foreground font-mono text-[10px]">160px — print / large UI</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ZyteLogo width={96} height={logoHeight(96)} className="text-[#0D0D14]" />
            <span className="text-muted-foreground font-mono text-[10px]">96px — minimum on screen</span>
          </div>
        </div>
        <Caption>
          Don’t render the full lockup below <span className="font-medium">96px</span> wide. For
          tighter slots (favicons, avatars) use the standalone mark instead.
        </Caption>
      </section>

      {/* Colour variants */}
      <section>
        <SectionLabel>Colour variants</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-border/60 overflow-hidden rounded-lg border">
            <div className="flex items-center justify-center bg-white p-10">
              <ZyteLogo width={150} height={logoHeight(150)} className="text-[#C026D3]" />
            </div>
            <TileFooter caption="Primary (fuchsia)" name="primary" fill={FILL_PRIMARY} />
          </div>
          <div className="border-border/60 overflow-hidden rounded-lg border">
            <div className="flex items-center justify-center bg-white p-10">
              <ZyteLogo width={150} height={logoHeight(150)} className="text-[#0D0D14]" />
            </div>
            <TileFooter caption="Monochrome ink" name="mono" fill={FILL_MONO} />
          </div>
          <div className="border-border/60 overflow-hidden rounded-lg border">
            <div
              className="flex items-center justify-center p-10"
              style={{ backgroundColor: INK }}
            >
              <ZyteLogo width={150} height={logoHeight(150)} className="text-white" />
            </div>
            <TileFooter caption="Reversed white" name="reversed" fill={FILL_REVERSED} />
          </div>
        </div>
      </section>

      {/* Misuse */}
      <section>
        <SectionLabel>Misuse</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MisuseTile caption="Don’t stretch or distort">
            <div style={{ transform: "scaleX(1.6)" }}>
              <ZyteLogo width={110} height={logoHeight(110)} className="text-[#0D0D14]" />
            </div>
          </MisuseTile>
          <MisuseTile caption="Don’t rotate">
            <div className="rotate-12">
              <ZyteLogo width={130} height={logoHeight(130)} className="text-[#0D0D14]" />
            </div>
          </MisuseTile>
          <MisuseTile caption="Don’t recolour off-brand">
            <ZyteLogo width={130} height={logoHeight(130)} className="text-[#65A30D]" />
          </MisuseTile>
          <MisuseTile caption="Don’t place on low contrast" tint="#8B95EE">
            <ZyteLogo width={130} height={logoHeight(130)} className="text-white/70" />
          </MisuseTile>
        </div>
      </section>
    </div>
  );
}

function MisuseTile({
  children,
  caption,
  tint,
}: {
  children: React.ReactNode;
  caption: string;
  tint?: string;
}) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden bg-white px-4"
        style={tint ? { backgroundColor: tint } : undefined}
      >
        <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white">
          <X className="size-3" />
        </span>
        {children}
      </div>
      <p className="border-border/60 text-muted-foreground border-t px-4 py-2 text-xs">{caption}</p>
    </div>
  );
}
