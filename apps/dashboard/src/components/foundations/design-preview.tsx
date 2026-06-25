"use client";

import * as React from "react";
import {
  ArrowRight,
  Check,
  Moon,
  Quote,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

import type { ProductFoundations } from "@zytedata/ds-types";

/* -------------------------------------------------------------------------- */
/* Token resolution                                                            */
/*                                                                             */
/* Palettes differ wildly across products (web: surfaceDark/primary,           */
/* extract-summit: primary.DEFAULT/surface.black, core: actionPrimary…), so    */
/* we never hard-code palette keys. We resolve brand/accent from               */
/* `semanticColors` and derive a neutral surface ramp by luminance, then build */
/* light + dark themes from the same bundle. The result is a real page that    */
/* re-skins itself the moment foundations.ts changes.                          */
/* -------------------------------------------------------------------------- */

type Mode = "light" | "dark";

type Theme = {
  pageBg: string;
  sectionBg: string;
  cardBg: string;
  text: string;
  mutedText: string;
  subtleText: string;
  border: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  onBrand: string;
  accent: string;
  onAccent: string;
  headlineGradient: string;
};

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function isHex(value: string): value is string {
  return typeof value === "string" && HEX_RE.test(value.trim());
}

function normHex(hex: string): string {
  const c = hex.replace("#", "").trim();
  return c.length === 3
    ? c
        .split("")
        .map((ch) => ch + ch)
        .join("")
    : c;
}

function rgb(hex: string): [number, number, number] {
  const n = normHex(hex);
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

/** Perceived luminance 0 (black) → 1 (white). */
function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Black or white, whichever reads on top of `hex`. */
function readableOn(hex: string): string {
  return luminance(hex) > 0.58 ? "#0a0a0a" : "#ffffff";
}

/** Mix two hexes by ratio (0 = a, 1 = b). */
function mix(a: string, b: string, ratio: number): string {
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  const ch = (x: number, y: number) =>
    Math.round(x + (y - x) * ratio)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(ar, br)}${ch(ag, bg)}${ch(ab, bb)}`;
}

/** rgba() string from a hex + alpha. */
function alpha(hex: string, a: number): string {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type ShadeMap = Record<string, string>;

/** Solid-hex entries of a palette, ignoring gradients / vars. */
function solidHexes(shades: ShadeMap | undefined): string[] {
  if (!shades) return [];
  return Object.values(shades).filter(isHex);
}

/** A palette's "main" colour — prefer mid shades, else the median by luminance. */
function mainShade(shades: ShadeMap | undefined): string | null {
  if (!shades) return null;
  for (const key of ["500", "DEFAULT", "600", "400", "700", "default"]) {
    const v = shades[key];
    if (isHex(v)) return v;
  }
  const hexes = solidHexes(shades).sort((a, b) => luminance(a) - luminance(b));
  return hexes.length ? hexes[Math.floor(hexes.length / 2)]! : null;
}

/** Resolve a semantic ref like "primary" or "primary.DEFAULT" to a hex. */
function resolveRef(bundle: ProductFoundations, ref: string | undefined): string | null {
  if (!ref) return null;
  const [key, shade] = ref.split(".");
  const palette = bundle.colors[key!] as ShadeMap | undefined;
  if (!palette) return null;
  if (shade && isHex(palette[shade]!)) return palette[shade]!;
  return mainShade(palette);
}

/** Find the palette whose ramp best behaves as a neutral surface scale. */
function neutralRamp(bundle: ProductFoundations): string[] {
  const surfaceRef = bundle.semanticColors?.surface;
  const candidateKeys = [
    surfaceRef?.split(".")[0],
    "neutral",
    "surface",
    "gray",
    "grey",
    "ink",
    "stone",
  ].filter(Boolean) as string[];

  for (const key of candidateKeys) {
    const hexes = solidHexes(bundle.colors[key] as ShadeMap | undefined);
    if (hexes.length >= 3) return hexes.sort((a, b) => luminance(a) - luminance(b));
  }

  // Otherwise pick the palette with the most solid shades (likely a ramp).
  let best: string[] = [];
  for (const shades of Object.values(bundle.colors)) {
    const hexes = solidHexes(shades as ShadeMap);
    if (hexes.length > best.length) best = hexes;
  }
  if (best.length >= 3) return best.sort((a, b) => luminance(a) - luminance(b));

  // Last resort: a synthetic grayscale.
  return [
    "#000000",
    "#171717",
    "#404040",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
    "#f5f5f5",
    "#ffffff",
  ];
}

export function buildTheme(bundle: ProductFoundations, mode: Mode): Theme {
  const ramp = neutralRamp(bundle);
  const darkest = ramp[0]!;
  const lightest = ramp[ramp.length - 1]!;

  const brand =
    resolveRef(bundle, bundle.semanticColors?.brand) ??
    mainShade(bundle.colors.primary as ShadeMap) ??
    mainShade(bundle.colors[Object.keys(bundle.colors)[0]!] as ShadeMap) ??
    "#b02cce";
  const accent =
    resolveRef(bundle, bundle.semanticColors?.accent) ??
    mainShade(bundle.colors.accent as ShadeMap) ??
    brand;

  const gradientToken = (bundle.colors.headlineGradient as ShadeMap | undefined)
    ?.DEFAULT;
  const headlineGradient =
    gradientToken && /gradient|linear-/i.test(gradientToken)
      ? gradientToken
      : `linear-gradient(95deg, ${brand} 0%, ${accent} 100%)`;

  if (mode === "dark") {
    const pageBg = luminance(darkest) < 0.12 ? darkest : mix(darkest, "#000000", 0.5);
    return {
      pageBg,
      sectionBg: mix(pageBg, lightest, 0.04),
      cardBg: mix(pageBg, lightest, 0.07),
      text: mix(lightest, "#ffffff", 0.3),
      mutedText: alpha(lightest, 0.66),
      subtleText: alpha(lightest, 0.42),
      border: alpha(lightest, 0.12),
      brand: mix(brand, "#ffffff", 0.08),
      brandStrong: brand,
      brandSoft: alpha(brand, 0.16),
      onBrand: readableOn(brand),
      accent,
      onAccent: readableOn(accent),
      headlineGradient,
    };
  }

  const pageBg = luminance(lightest) > 0.92 ? mix(lightest, "#000000", 0.02) : lightest;
  return {
    pageBg,
    sectionBg: mix(pageBg, darkest, 0.035),
    cardBg: "#ffffff",
    text: luminance(darkest) < 0.25 ? darkest : mix(darkest, "#000000", 0.6),
    mutedText: alpha(darkest, 0.62),
    subtleText: alpha(darkest, 0.4),
    border: alpha(darkest, 0.1),
    brand,
    brandStrong: mix(brand, "#000000", 0.12),
    brandSoft: alpha(brand, 0.1),
    onBrand: readableOn(brand),
    accent,
    onAccent: readableOn(accent),
    headlineGradient,
  };
}

/* -------------------------------------------------------------------------- */
/* Typography / scale helpers                                                  */
/* -------------------------------------------------------------------------- */

export function makeScales(bundle: ProductFoundations) {
  const t = bundle.typography;
  const sans = t.family.sans ?? "ui-sans-serif, system-ui, sans-serif";
  const mono = t.family.mono ?? "ui-monospace, monospace";
  const size = (key: string, fallback: number) => t.size[key] ?? fallback;
  const weight = (key: string, fallback: number) => t.weight[key] ?? fallback;
  const lh = (key: string, fallback: number) => t.lineHeight[key] ?? fallback;
  const track = (key: string) =>
    t.letterSpacing[key] != null ? `${t.letterSpacing[key]}px` : "0";
  const sp = (key: string, fallback: number) => `${bundle.spacing[key] ?? fallback}px`;
  const rad = (key: string, fallback: number) => `${bundle.radius[key] ?? fallback}px`;
  const shadow = (key: string, fallback: string) => bundle.shadow[key] ?? fallback;
  return { sans, mono, size, weight, lh, track, sp, rad, shadow };
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

type S = ReturnType<typeof makeScales>;

function PrimaryButton({
  theme,
  s,
  children,
  icon,
}: {
  theme: Theme;
  s: S;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.sp("2", 8),
        background: theme.brandStrong,
        color: theme.onBrand,
        fontFamily: s.sans,
        fontSize: s.size("sm", 14),
        fontWeight: s.weight("semibold", 600),
        padding: `${s.sp("3", 12)} ${s.sp("5", 20)}`,
        borderRadius: s.rad("lg", 8),
        boxShadow: s.shadow("md", "0 4px 6px -1px rgb(0 0 0 / 0.1)"),
      }}
    >
      {children}
      {icon}
    </span>
  );
}

function GhostButton({
  theme,
  s,
  children,
}: {
  theme: Theme;
  s: S;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.sp("2", 8),
        background: "transparent",
        color: theme.text,
        fontFamily: s.sans,
        fontSize: s.size("sm", 14),
        fontWeight: s.weight("medium", 500),
        padding: `${s.sp("3", 12)} ${s.sp("5", 20)}`,
        borderRadius: s.rad("lg", 8),
        border: `1px solid ${theme.border}`,
      }}
    >
      {children}
    </span>
  );
}

function Pill({
  theme,
  s,
  children,
}: {
  theme: Theme;
  s: S;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.sp("1.5", 6),
        background: theme.brandSoft,
        color: theme.brand,
        fontFamily: s.sans,
        fontSize: s.size("xs", 12),
        fontWeight: s.weight("semibold", 600),
        letterSpacing: s.track("wide"),
        padding: `${s.sp("1.5", 6)} ${s.sp("3", 12)}`,
        borderRadius: s.rad("full", 9999),
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: "One token surface",
    body: "Colours, type, spacing and elevation flow from a single foundations bundle into every product.",
  },
  {
    icon: ShieldCheck,
    title: "Agent-ready spec",
    body: "The same DESIGN.md powers humans and coding agents — no drift between docs and shipped UI.",
  },
  {
    icon: Sparkles,
    title: "Skinned instantly",
    body: "Change a foundation value and this entire page re-themes itself. What you see is the live system.",
  },
];

const STATS = [
  { value: "8", label: "Token families" },
  { value: "100%", label: "Spec ↔ code parity" },
  { value: "4", label: "Product themes" },
  { value: "0ms", label: "Re-skin lag" },
];

/* -------------------------------------------------------------------------- */
/* Token gallery — every palette, every shade, every scale value, exactly      */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  theme,
  s,
  eyebrow,
  title,
  meta,
}: {
  theme: Theme;
  s: S;
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: s.sp("4", 16),
        flexWrap: "wrap",
        marginBottom: s.sp("5", 20),
      }}
    >
      <div>
        <div
          style={{
            fontFamily: s.mono,
            fontSize: s.size("xs", 12),
            letterSpacing: s.track("wider"),
            textTransform: "uppercase",
            color: theme.brand,
            marginBottom: s.sp("1", 4),
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            fontSize: s.size("3xl", 30),
            fontWeight: s.weight("bold", 700),
            letterSpacing: s.track("tight"),
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {meta ? (
        <span style={{ fontFamily: s.mono, fontSize: s.size("xs", 12), color: theme.subtleText }}>
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function GalleryCard({
  theme,
  s,
  children,
  pad = true,
}: {
  theme: Theme;
  s: S;
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: s.rad("2xl", 16),
        overflow: "hidden",
        padding: pad ? s.sp("5", 20) : 0,
      }}
    >
      {children}
    </div>
  );
}

export function TokenGallery({
  bundle,
  theme,
  s,
}: {
  bundle: ProductFoundations;
  theme: Theme;
  s: S;
}) {
  const maxW = 1080;
  const wrap: React.CSSProperties = {
    maxWidth: maxW,
    margin: "0 auto",
    padding: `${s.sp("12", 48)} ${s.sp("6", 24)}`,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: s.mono,
    fontSize: 11,
    color: theme.subtleText,
    textTransform: "uppercase",
    letterSpacing: s.track("wider"),
    marginBottom: s.sp("3", 12),
  };

  const palettes = Object.entries(bundle.colors);
  const sizes = Object.entries(bundle.typography.size).sort(([, a], [, b]) => a - b);
  const weights = Object.entries(bundle.typography.weight).sort(([, a], [, b]) => a - b);
  const spacing = Object.entries(bundle.spacing).sort(([, a], [, b]) => a - b);
  const spacingMax = spacing.reduce((m, [, v]) => Math.max(m, v), 1);
  const radii = Object.entries(bundle.radius).sort(([, a], [, b]) => a - b);
  const shadows = Object.entries(bundle.shadow);
  const opacities = Object.entries(bundle.opacity).sort(([, a], [, b]) => a - b);
  const breakpoints = Object.entries(bundle.breakpoint).sort(([, a], [, b]) => a - b);
  const zIndexes = Object.entries(bundle.zIndex).sort(([, a], [, b]) => a - b);

  return (
    <div style={{ background: theme.pageBg }}>
      {/* Colours */}
      <section style={{ ...wrap, borderTop: `1px solid ${theme.border}` }}>
        <SectionTitle
          theme={theme}
          s={s}
          eyebrow="Color"
          title="Color system"
          meta={`${palettes.length} palettes`}
        />
        {bundle.semanticColors && Object.keys(bundle.semanticColors).length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: s.sp("2", 8), marginBottom: s.sp("5", 20) }}>
            {Object.entries(bundle.semanticColors).map(([role, ref]) => (
              <span
                key={role}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: theme.sectionBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: s.rad("md", 6),
                  padding: `${s.sp("1", 4)} ${s.sp("2.5", 10)}`,
                  fontFamily: s.mono,
                  fontSize: 11,
                  color: theme.mutedText,
                }}
              >
                <span style={{ color: theme.text, fontWeight: s.weight("semibold", 600) }}>{role}</span>
                <span>→</span>
                <span>{ref}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div style={{ display: "grid", gap: s.sp("5", 20) }}>
          {palettes.map(([paletteId, shades]) => {
            const entries = Object.entries(shades as ShadeMap);
            return (
              <GalleryCard key={paletteId} theme={theme} s={s} pad={false}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: s.sp("2", 8),
                    padding: `${s.sp("3", 12)} ${s.sp("4", 16)}`,
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ fontWeight: s.weight("semibold", 600), fontSize: s.size("sm", 14) }}>
                    {paletteId}
                  </span>
                  <span style={{ fontFamily: s.mono, fontSize: 11, color: theme.subtleText }}>
                    {entries.length} shades
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(116px, 1fr))",
                    gap: 1,
                    background: theme.border,
                  }}
                >
                  {entries.map(([shade, value]) => {
                    const isColor = isHex(value);
                    const isGradient = /gradient|linear-/i.test(value);
                    return (
                      <div key={shade} style={{ background: theme.cardBg, padding: s.sp("3", 12) }}>
                        <div
                          style={{
                            height: 48,
                            borderRadius: s.rad("md", 6),
                            background: isColor || isGradient ? value : theme.sectionBg,
                            border: `1px solid ${theme.border}`,
                            marginBottom: s.sp("2", 8),
                          }}
                        />
                        <div style={{ fontFamily: s.mono, fontSize: 11, fontWeight: s.weight("semibold", 600) }}>
                          {shade}
                        </div>
                        <div
                          style={{
                            fontFamily: s.mono,
                            fontSize: 10,
                            color: theme.subtleText,
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={value}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GalleryCard>
            );
          })}
        </div>
      </section>

      {/* Typography */}
      <section style={{ ...wrap, borderTop: `1px solid ${theme.border}` }}>
        <SectionTitle
          theme={theme}
          s={s}
          eyebrow="Type"
          title="Typography"
          meta={`${sizes.length} sizes · ${weights.length} weights`}
        />
        <div style={{ display: "grid", gap: s.sp("5", 20), gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <GalleryCard theme={theme} s={s} pad={false}>
            <div style={{ padding: `${s.sp("3", 12)} ${s.sp("4", 16)}`, borderBottom: `1px solid ${theme.border}` }}>
              <span style={labelStyle}>Type scale</span>
            </div>
            <div>
              {sizes.map(([key, px]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: s.sp("4", 16),
                    padding: `${s.sp("2.5", 10)} ${s.sp("4", 16)}`,
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ width: 64, flexShrink: 0, fontFamily: s.mono, fontSize: 11, color: theme.subtleText }}>
                    {key} · {px}px
                  </span>
                  <span
                    style={{
                      fontSize: px,
                      fontWeight: s.weight("medium", 500),
                      lineHeight: s.lh("tight", 1.2),
                      letterSpacing: s.track("tight"),
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Quick fox
                  </span>
                </div>
              ))}
            </div>
          </GalleryCard>

          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Weights</span>
            <div style={{ display: "grid", gap: s.sp("3", 12) }}>
              {weights.map(([key, value]) => (
                <div key={key} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: s.sp("3", 12) }}>
                  <span style={{ fontSize: s.size("xl", 20), fontWeight: value }}>{bundle.label} system</span>
                  <span style={{ fontFamily: s.mono, fontSize: 11, color: theme.subtleText }}>{key} · {value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: s.sp("5", 20), paddingTop: s.sp("4", 16), borderTop: `1px solid ${theme.border}` }}>
              <span style={labelStyle}>Families</span>
              <p style={{ margin: 0, fontFamily: s.sans, fontSize: s.size("lg", 18) }}>Sans · The quick brown fox</p>
              <p style={{ margin: `${s.sp("2", 8)} 0 0`, fontFamily: s.mono, fontSize: s.size("sm", 14), color: theme.mutedText }}>
                Mono · const tokens = foundations
              </p>
            </div>
          </GalleryCard>
        </div>
      </section>

      {/* Spacing + Radius */}
      <section style={{ ...wrap, borderTop: `1px solid ${theme.border}` }}>
        <SectionTitle theme={theme} s={s} eyebrow="Layout" title="Spacing & radius" meta={`${spacing.length} steps`} />
        <div style={{ display: "grid", gap: s.sp("5", 20), gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Spacing scale</span>
            <div style={{ display: "grid", gap: s.sp("2", 8) }}>
              {spacing.map(([key, px]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: s.sp("3", 12) }}>
                  <span style={{ width: 40, flexShrink: 0, fontFamily: s.mono, fontSize: 11, color: theme.subtleText }}>{key}</span>
                  <span style={{ width: 44, flexShrink: 0, fontFamily: s.mono, fontSize: 11, color: theme.mutedText }}>{px}px</span>
                  <span style={{ height: 8, borderRadius: 9999, background: theme.brand, width: `${Math.max((px / spacingMax) * 100, 1)}%`, minWidth: 2 }} />
                </div>
              ))}
            </div>
          </GalleryCard>
          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Radius</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: s.sp("3", 12) }}>
              {radii.map(([key, px]) => (
                <div key={key}>
                  <div
                    style={{
                      height: 56,
                      background: theme.brandSoft,
                      border: `1px solid ${theme.border}`,
                      borderRadius: Math.min(px, 56),
                      marginBottom: s.sp("2", 8),
                    }}
                  />
                  <div style={{ fontFamily: s.mono, fontSize: 11, fontWeight: s.weight("semibold", 600) }}>{key}</div>
                  <div style={{ fontFamily: s.mono, fontSize: 10, color: theme.subtleText }}>{px}px</div>
                </div>
              ))}
            </div>
          </GalleryCard>
        </div>
      </section>

      {/* Elevation */}
      <section style={{ ...wrap, borderTop: `1px solid ${theme.border}` }}>
        <SectionTitle theme={theme} s={s} eyebrow="Depth" title="Elevation" meta={`${shadows.length} levels`} />
        <div style={{ display: "grid", gap: s.sp("5", 20), gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {shadows.map(([key, value]) => (
            <div key={key} style={{ background: theme.sectionBg, borderRadius: s.rad("2xl", 16), padding: s.sp("6", 24) }}>
              <div style={{ height: 56, borderRadius: s.rad("lg", 8), background: theme.cardBg, boxShadow: value, marginBottom: s.sp("3", 12) }} />
              <div style={{ fontFamily: s.mono, fontSize: 11, fontWeight: s.weight("semibold", 600) }}>{key}</div>
              <div style={{ fontFamily: s.mono, fontSize: 10, color: theme.subtleText, lineHeight: 1.4, marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Opacity / breakpoints / z-index */}
      <section style={{ ...wrap, borderTop: `1px solid ${theme.border}` }}>
        <SectionTitle theme={theme} s={s} eyebrow="System" title="Opacity, breakpoints & z-index" />
        <div style={{ display: "grid", gap: s.sp("5", 20), gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Opacity</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: s.sp("2", 8) }}>
              {opacities.map(([key, value]) => (
                <div key={key}>
                  <div style={{ height: 40, borderRadius: s.rad("md", 6), background: theme.brand, opacity: value, marginBottom: 4 }} />
                  <div style={{ fontFamily: s.mono, fontSize: 10, color: theme.mutedText }}>{key} · {Math.round(value * 100)}%</div>
                </div>
              ))}
            </div>
          </GalleryCard>
          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Breakpoints</span>
            <div>
              {breakpoints.map(([key, px]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: `${s.sp("2", 8)} 0`, borderBottom: `1px solid ${theme.border}`, fontFamily: s.mono, fontSize: 12 }}>
                  <span style={{ fontWeight: s.weight("semibold", 600) }}>{key}</span>
                  <span style={{ color: theme.mutedText }}>{px}px</span>
                </div>
              ))}
            </div>
          </GalleryCard>
          <GalleryCard theme={theme} s={s}>
            <span style={labelStyle}>Z-index</span>
            <div>
              {zIndexes.map(([key, value]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: `${s.sp("2", 8)} 0`, borderBottom: `1px solid ${theme.border}`, fontFamily: s.mono, fontSize: 12 }}>
                  <span style={{ fontWeight: s.weight("semibold", 600) }}>{key}</span>
                  <span style={{ color: theme.mutedText }}>{value}</span>
                </div>
              ))}
            </div>
          </GalleryCard>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The showcase page                                                           */
/* -------------------------------------------------------------------------- */

function ShowcasePage({
  bundle,
  theme,
  s,
}: {
  bundle: ProductFoundations;
  theme: Theme;
  s: S;
}) {
  const maxW = 1080;
  const sectionPad = `${s.sp("16", 64)} ${s.sp("6", 24)}`;

  return (
    <div
      style={{
        background: theme.pageBg,
        color: theme.text,
        fontFamily: s.sans,
        lineHeight: s.lh("normal", 1.5),
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: s.sp("4", 16),
          maxWidth: maxW,
          margin: "0 auto",
          padding: `${s.sp("5", 20)} ${s.sp("6", 24)}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: s.sp("2", 8),
            fontWeight: s.weight("bold", 700),
            fontSize: s.size("lg", 18),
            letterSpacing: s.track("tight"),
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: s.rad("md", 6),
              background: theme.headlineGradient,
              color: theme.onBrand,
            }}
          >
            <Sparkles size={16} />
          </span>
          {bundle.label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: s.sp("6", 24),
            fontSize: s.size("sm", 14),
            color: theme.mutedText,
          }}
        >
          <span style={{ cursor: "pointer" }}>Product</span>
          <span style={{ cursor: "pointer" }}>Pricing</span>
          <span style={{ cursor: "pointer" }}>Docs</span>
          <PrimaryButton theme={theme} s={s}>
            Get started
          </PrimaryButton>
        </div>
      </nav>

      {/* Hero */}
      <header
        style={{
          maxWidth: maxW,
          margin: "0 auto",
          padding: `${s.sp("16", 64)} ${s.sp("6", 24)} ${s.sp("12", 48)}`,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: s.sp("6", 24) }}>
          <Pill theme={theme} s={s}>
            <Sparkles size={12} /> {bundle.label} design system
          </Pill>
        </div>
        <h1
          style={{
            fontSize: s.size("7xl", 68),
            lineHeight: s.lh("tight", 1.1),
            fontWeight: s.weight("bold", 700),
            letterSpacing: s.track("tighter"),
            margin: 0,
            maxWidth: 760,
            marginInline: "auto",
            background: theme.headlineGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Ship trustworthy UI from one token surface.
        </h1>
        <p
          style={{
            fontSize: s.size("xl", 20),
            lineHeight: s.lh("relaxed", 1.6),
            color: theme.mutedText,
            maxWidth: 560,
            margin: `${s.sp("6", 24)} auto 0`,
          }}
        >
          {bundle.description}
        </p>
        <div
          style={{
            display: "flex",
            gap: s.sp("3", 12),
            justifyContent: "center",
            marginTop: s.sp("8", 32),
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton theme={theme} s={s} icon={<ArrowRight size={16} />}>
            Start building
          </PrimaryButton>
          <GhostButton theme={theme} s={s}>
            View components
          </GhostButton>
        </div>
        <p
          style={{
            marginTop: s.sp("6", 24),
            fontSize: s.size("xs", 12),
            color: theme.subtleText,
            fontFamily: s.mono,
          }}
        >
          Trusted by teams shipping with the {bundle.label} foundations
        </p>
      </header>

      {/* Features */}
      <section style={{ background: theme.sectionBg, borderTop: `1px solid ${theme.border}` }}>
        <div
          style={{
            maxWidth: maxW,
            margin: "0 auto",
            padding: sectionPad,
            display: "grid",
            gap: s.sp("6", 24),
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: s.rad("2xl", 16),
                padding: s.sp("6", 24),
                /* design.md: cards are flat — border only, no shadow */
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: s.rad("xl", 12),
                  background: theme.brandSoft,
                  color: theme.brand,
                  marginBottom: s.sp("4", 16),
                }}
              >
                <Icon size={22} />
              </span>
              <h3
                style={{
                  fontSize: s.size("xl", 20),
                  fontWeight: s.weight("semibold", 600),
                  margin: 0,
                  letterSpacing: s.track("tight"),
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: s.size("base", 16),
                  lineHeight: s.lh("relaxed", 1.6),
                  color: theme.mutedText,
                  marginTop: s.sp("2", 8),
                  marginBottom: 0,
                }}
              >
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section
        style={{
          maxWidth: maxW,
          margin: "0 auto",
          padding: `${s.sp("12", 48)} ${s.sp("6", 24)}`,
          display: "grid",
          gap: s.sp("6", 24),
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          textAlign: "center",
        }}
      >
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontSize: s.size("5xl", 48),
                fontWeight: s.weight("bold", 700),
                lineHeight: s.lh("none", 1),
                letterSpacing: s.track("tight"),
                background: theme.headlineGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: s.size("sm", 14),
                color: theme.mutedText,
                marginTop: s.sp("2", 8),
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section style={{ background: theme.sectionBg, borderBlock: `1px solid ${theme.border}` }}>
        <figure
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: sectionPad,
            textAlign: "center",
          }}
        >
          <Quote size={32} style={{ color: theme.brand, marginBottom: s.sp("4", 16) }} />
          <blockquote
            style={{
              fontSize: s.size("3xl", 30),
              fontWeight: s.weight("medium", 500),
              lineHeight: s.lh("snug", 1.375),
              letterSpacing: s.track("tight"),
              margin: 0,
            }}
          >
            “Every product reads from the same spec. The design system finally feels
            like one product, not five.”
          </blockquote>
          <figcaption
            style={{
              marginTop: s.sp("6", 24),
              fontSize: s.size("sm", 14),
              color: theme.mutedText,
            }}
          >
            <strong style={{ color: theme.text }}>Design Platform</strong> · Zyte
          </figcaption>
        </figure>
      </section>

      {/* CTA + form */}
      <section
        style={{
          maxWidth: maxW,
          margin: "0 auto",
          padding: `${s.sp("16", 64)} ${s.sp("6", 24)}`,
        }}
      >
        <div
          style={{
            background: theme.headlineGradient,
            borderRadius: s.rad("2xl", 16),
            padding: `${s.sp("12", 48)} ${s.sp("8", 32)}`,
            textAlign: "center",
            color: theme.onBrand,
            boxShadow: s.shadow("xl", "0 20px 25px -5px rgb(0 0 0 / 0.2)"),
          }}
        >
          <h2
            style={{
              fontSize: s.size("4xl", 36),
              fontWeight: s.weight("bold", 700),
              letterSpacing: s.track("tight"),
              margin: 0,
            }}
          >
            Build on the {bundle.label} system today
          </h2>
          <p
            style={{
              fontSize: s.size("lg", 18),
              lineHeight: s.lh("relaxed", 1.6),
              margin: `${s.sp("3", 12)} auto ${s.sp("8", 32)}`,
              maxWidth: 480,
              opacity: 0.9,
            }}
          >
            Drop your email and get the foundations bundle plus the canonical
            DESIGN.md spec.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              gap: s.sp("2", 8),
              maxWidth: 420,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              placeholder="you@company.com"
              style={{
                flex: "1 1 220px",
                minWidth: 0,
                background: alpha("#ffffff", theme.onBrand === "#ffffff" ? 0.14 : 0.85),
                color: theme.onBrand === "#ffffff" ? "#ffffff" : "#0a0a0a",
                border: `1px solid ${alpha(theme.onBrand, 0.3)}`,
                borderRadius: s.rad("lg", 8),
                padding: `${s.sp("3", 12)} ${s.sp("4", 16)}`,
                fontFamily: s.sans,
                fontSize: s.size("sm", 14),
                outline: "none",
              }}
            />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: s.sp("2", 8),
                background: theme.onBrand,
                color: theme.brandStrong,
                fontWeight: s.weight("semibold", 600),
                fontSize: s.size("sm", 14),
                padding: `${s.sp("3", 12)} ${s.sp("5", 20)}`,
                borderRadius: s.rad("lg", 8),
              }}
            >
              Request access <ArrowRight size={16} />
            </span>
          </form>
        </div>
      </section>

      {/* Component swatch row */}
      <section
        style={{
          maxWidth: maxW,
          margin: "0 auto",
          padding: `0 ${s.sp("6", 24)} ${s.sp("16", 64)}`,
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: s.rad("2xl", 16),
            padding: s.sp("8", 32),
            display: "grid",
            gap: s.sp("6", 24),
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div>
            <p style={{ fontSize: s.size("xs", 12), color: theme.subtleText, fontFamily: s.mono, margin: `0 0 ${s.sp("3", 12)}`, textTransform: "uppercase", letterSpacing: s.track("wider") }}>
              Buttons
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: s.sp("2", 8) }}>
              <PrimaryButton theme={theme} s={s}>Primary</PrimaryButton>
              <GhostButton theme={theme} s={s}>Secondary</GhostButton>
            </div>
          </div>
          <div>
            <p style={{ fontSize: s.size("xs", 12), color: theme.subtleText, fontFamily: s.mono, margin: `0 0 ${s.sp("3", 12)}`, textTransform: "uppercase", letterSpacing: s.track("wider") }}>
              Badges
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: s.sp("2", 8), alignItems: "center" }}>
              <Pill theme={theme} s={s}>New</Pill>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: alpha(theme.accent, 0.14), color: theme.accent, borderRadius: s.rad("full", 9999), padding: `${s.sp("1", 4)} ${s.sp("3", 12)}`, fontSize: s.size("xs", 12), fontWeight: s.weight("semibold", 600) }}>
                <Check size={12} /> Stable
              </span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: s.size("xs", 12), color: theme.subtleText, fontFamily: s.mono, margin: `0 0 ${s.sp("3", 12)}`, textTransform: "uppercase", letterSpacing: s.track("wider") }}>
              Input
            </p>
            <input
              placeholder="Search tokens…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: theme.pageBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: s.rad("lg", 8),
                padding: `${s.sp("2.5", 10)} ${s.sp("3", 12)}`,
                fontFamily: s.sans,
                fontSize: s.size("sm", 14),
                outline: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* Full token gallery — every palette, shade and scale value, exactly */}
      <TokenGallery bundle={bundle} theme={theme} s={s} />

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.border}` }}>
        <div
          style={{
            maxWidth: maxW,
            margin: "0 auto",
            padding: `${s.sp("8", 32)} ${s.sp("6", 24)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: s.sp("4", 16),
            fontSize: s.size("sm", 14),
            color: theme.mutedText,
          }}
        >
          <span style={{ fontWeight: s.weight("semibold", 600), color: theme.text }}>
            {bundle.label}
          </span>
          <span style={{ fontFamily: s.mono, fontSize: s.size("xs", 12) }}>
            Rendered live from foundations.ts · {Object.keys(bundle.colors).length} palettes
          </span>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Framed preview with mode toggle                                             */
/* -------------------------------------------------------------------------- */

export function DesignPreview({ bundle }: { bundle: ProductFoundations }) {
  const [mode, setMode] = React.useState<Mode>("dark");
  const theme = React.useMemo(() => buildTheme(bundle, mode), [bundle, mode]);
  const s = React.useMemo(() => makeScales(bundle), [bundle]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed">
          A real, fully-composed landing page rendered entirely from the current{" "}
          <code className="text-foreground font-mono text-[11px]">
            {bundle.label}
          </code>{" "}
          foundations — colours, typography, spacing, radius and elevation are all
          live tokens. Change a value in <code className="text-foreground font-mono text-[11px]">foundations.ts</code> and this page re-skins itself.
        </p>
        <div className="bg-muted/60 inline-flex shrink-0 items-center rounded-full border p-0.5">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors " +
                (mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {m === "light" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {m === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl border"
        style={{ boxShadow: "0 20px 40px -20px rgb(0 0 0 / 0.35)" }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ background: theme.sectionBg, borderColor: theme.border }}
        >
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: alpha(theme.text, 0.25) }} />
            <span className="size-2.5 rounded-full" style={{ background: alpha(theme.text, 0.25) }} />
            <span className="size-2.5 rounded-full" style={{ background: alpha(theme.text, 0.25) }} />
          </span>
          <span
            className="mx-auto rounded-md px-3 py-1 font-mono text-[11px]"
            style={{ background: theme.pageBg, color: theme.mutedText }}
          >
            {bundle.label.toLowerCase().replace(/\s+/g, "")}.design
          </span>
        </div>

        <div className="max-h-[760px] overflow-auto">
          <ShowcasePage bundle={bundle} theme={theme} s={s} />
        </div>
      </div>
    </div>
  );
}
