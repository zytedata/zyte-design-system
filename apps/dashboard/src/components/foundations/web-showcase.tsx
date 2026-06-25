"use client";

import * as React from "react";
import {
  ArrowRight,
  Check,
  Database,
  Gauge,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import type { ProductFoundations } from "@zytedata/ds-types";

import {
  TokenGallery,
  buildTheme,
  makeScales,
} from "@/components/foundations/design-preview";

/* -------------------------------------------------------------------------- */
/* Web showcase — a faithful render of packages/web/src/design.body.md.        */
/*                                                                             */
/* Unlike the generic DesignPreview, this is purpose-built for the Web scope:  */
/* it hard-wires the documented component rules (white nav, gradient landing   */
/* hero, eyebrow→headline→sublead bands, section numbering, flat 0.5px cards,  */
/* dark code section) and pulls every value from the Web foundations bundle by */
/* token key so it re-skins when foundations.ts changes.                       */
/* -------------------------------------------------------------------------- */

function useTokens(bundle: ProductFoundations) {
  const color = React.useCallback(
    (palette: string, shade: string, fallback = "#000000"): string => {
      const p = bundle.colors[palette] as Record<string, string> | undefined;
      const v = p?.[shade];
      return typeof v === "string" ? v : fallback;
    },
    [bundle],
  );
  const gradient = React.useCallback(
    (palette: string, fallback: string): string => {
      const p = bundle.colors[palette] as Record<string, string> | undefined;
      return p?.DEFAULT ?? fallback;
    },
    [bundle],
  );
  const t = bundle.typography;
  const size = (k: string, f: number) => t.size[k] ?? f;
  const weight = (k: string, f: number) => t.weight[k] ?? f;
  const lh = (k: string, f: number) => t.lineHeight[k] ?? f;
  const track = (k: string, f = 0) =>
    `${t.letterSpacing[k] ?? f}px`;
  const sp = (k: string, f: number) => `${bundle.spacing[k] ?? f}px`;
  const rad = (k: string, f: number) => `${bundle.radius[k] ?? f}px`;
  const sans = t.family.sans ?? "Yellix, ui-sans-serif, system-ui, sans-serif";
  const mono = t.family.mono ?? "ui-monospace, monospace";
  return { color, gradient, size, weight, lh, track, sp, rad, sans, mono };
}

type Tk = ReturnType<typeof useTokens>;

const MAX_W = 1080; // design.md → Page Metrics: max content width

/* ── Primitives (per design.md → Primitive Style Rules) ──────────────────── */

function Eyebrow({
  tk,
  num,
  children,
  onDark = false,
}: {
  tk: Tk;
  num?: string;
  children: React.ReactNode;
  onDark?: boolean;
}) {
  const labelColor = onDark
    ? "rgba(255,255,255,0.72)"
    : tk.color("secondary", "500", "#181e5a");
  const numColor = onDark
    ? tk.color("primary", "300", "#f0abfc")
    : tk.color("primary", "500", "#b02cce");
  return (
    <p
      style={{
        margin: `0 0 ${tk.sp("2", 8)}`,
        fontFamily: tk.sans,
        fontSize: tk.size("xs", 12),
        fontWeight: tk.weight("semibold", 600),
        letterSpacing: tk.track("wider", 0.8),
        textTransform: "uppercase",
        color: labelColor,
      }}
    >
      {num ? <span style={{ color: numColor }}>{num} · </span> : null}
      {children}
    </p>
  );
}

function PrimaryButton({
  tk,
  children,
}: {
  tk: Tk;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: tk.sp("2", 8),
        background: tk.color("primary", "500", "#b02cce"),
        color: tk.color("neutral", "0", "#ffffff"),
        fontFamily: tk.sans,
        fontSize: tk.size("base", 16),
        fontWeight: tk.weight("semibold", 600),
        padding: `${tk.sp("3", 12)} ${tk.sp("5", 20)}`,
        borderRadius: tk.rad("lg", 8),
      }}
    >
      {children}
    </span>
  );
}

function GhostButton({
  tk,
  children,
  onDark = false,
}: {
  tk: Tk;
  children: React.ReactNode;
  onDark?: boolean;
}) {
  const line = onDark
    ? tk.color("neutral", "0", "#ffffff")
    : tk.color("secondary", "500", "#181e5a");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: tk.sp("2", 8),
        background: "transparent",
        color: line,
        fontFamily: tk.sans,
        fontSize: tk.size("base", 16),
        fontWeight: tk.weight("semibold", 600),
        padding: `${tk.sp("3", 12)} ${tk.sp("5", 20)}`,
        borderRadius: tk.rad("lg", 8),
        border: `2px solid ${onDark ? "rgba(255,255,255,0.25)" : line}`,
      }}
    >
      {children}
    </span>
  );
}

function Pill({ tk, children }: { tk: Tk; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: tk.sp("1.5", 6),
        background: tk.color("primary", "50", "#fdf4ff"),
        color: tk.color("primary", "500", "#b02cce"),
        fontFamily: tk.sans,
        fontSize: tk.size("xs", 12),
        fontWeight: tk.weight("semibold", 600),
        padding: `${tk.sp("1", 4)} ${tk.sp("3", 12)}`,
        borderRadius: tk.rad("full", 9999),
      }}
    >
      {children}
    </span>
  );
}

/** Flat card: 0.5px neutral.200 border, radius.2xl, NO shadow. */
function Card({
  tk,
  children,
  feature = false,
  style,
}: {
  tk: Tk;
  children: React.ReactNode;
  feature?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: tk.color("surfaceLight", "cards", "#ffffff"),
        border: `0.5px solid ${tk.color("neutral", "200", "#e5e5e5")}`,
        borderTop: feature
          ? `3px solid ${tk.color("accent", "500", "#db005f")}`
          : undefined,
        borderRadius: tk.rad("2xl", 16),
        padding: tk.sp("6", 24),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({
  tk,
  num,
  eyebrow,
  title,
  sublead,
  onDark = false,
}: {
  tk: Tk;
  num?: string;
  eyebrow: string;
  title: string;
  sublead?: string;
  onDark?: boolean;
}) {
  return (
    <div style={{ maxWidth: 680, marginBottom: tk.sp("10", 40) }}>
      <Eyebrow tk={tk} num={num} onDark={onDark}>
        {eyebrow}
      </Eyebrow>
      <h2
        style={{
          margin: 0,
          fontFamily: tk.sans,
          fontSize: tk.size("5xl", 48),
          fontWeight: tk.weight("semibold", 600),
          lineHeight: tk.lh("tight", 1.25),
          letterSpacing: tk.track("tight", -0.4),
          color: onDark
            ? tk.color("neutral", "0", "#ffffff")
            : tk.color("secondary", "500", "#181e5a"),
        }}
      >
        {title}
      </h2>
      {sublead ? (
        <p
          style={{
            margin: `${tk.sp("4", 16)} 0 0`,
            fontFamily: tk.sans,
            fontSize: tk.size("lg", 18),
            fontWeight: tk.weight("regular", 400),
            lineHeight: tk.lh("relaxed", 1.625),
            color: onDark
              ? "rgba(255,255,255,0.72)"
              : tk.color("neutral", "600", "#525252"),
          }}
        >
          {sublead}
        </p>
      ) : null}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Gauge,
    title: "Dynamic pricing",
    body: "Track competitor prices across thousands of SKUs and react in near real time.",
  },
  {
    icon: Database,
    title: "Catalogue enrichment",
    body: "Fill gaps in your own catalogue with clean specs, images and descriptions.",
  },
  {
    icon: ShieldCheck,
    title: "Availability monitoring",
    body: "Spot stock-outs and assortment changes the moment they happen.",
  },
];

const STATS = [
  { value: "12B+", label: "records / month" },
  { value: "99.9%", label: "extraction uptime" },
  { value: "5×", label: "faster than headless" },
];

export function WebShowcase({ bundle }: { bundle: ProductFoundations }) {
  const tk = useTokens(bundle);
  // Spec-sheet gallery (colours, type, spacing, radius, elevation…) shown below
  // the landing page, reusing the shared token-gallery from DesignPreview.
  const galleryTheme = React.useMemo(() => buildTheme(bundle, "light"), [bundle]);
  const galleryScales = React.useMemo(() => makeScales(bundle), [bundle]);

  const pageBg = tk.color("surfaceLight", "background", "#f7f7f8");
  const sectionBg = tk.color("surfaceLight", "pageSections", "#f0f0f2");
  const white = tk.color("surfaceLight", "cards", "#ffffff");
  const featureBg = tk.color("primary", "50", "#fdf4ff");
  const darkBg = tk.color("secondary", "800", "#101339");
  const ink = tk.color("secondary", "500", "#181e5a");
  const muted = tk.color("neutral", "600", "#525252");
  const border = tk.color("neutral", "200", "#e5e5e5");
  const heroGrad = tk.gradient(
    "heroGradient",
    "linear-gradient(113.78deg, rgb(19,20,87) 39.45%, rgb(176,44,206) 108.24%)",
  );
  const sectionPadY = tk.sp("24", 96);
  const gutter = tk.sp("6", 24);

  const band = (bg: string): React.CSSProperties => ({
    background: bg,
    padding: `${sectionPadY} ${gutter}`,
  });
  const inner: React.CSSProperties = { maxWidth: MAX_W, margin: "0 auto" };

  return (
    <div className="space-y-6">
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${border}`,
        fontFamily: tk.sans,
        background: pageBg,
      }}
    >
      {/* ── Hero (landing gradient) with transparent nav over it ──────────── */}
      <div style={{ background: heroGrad }}>
        {/* Nav — transparent-on-hero exception: reversed logo + light text */}
        <nav
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: `${tk.sp("5", 20)} ${gutter}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: tk.size("2xl", 24),
              fontWeight: tk.weight("bold", 700),
              color: "#ffffff",
              letterSpacing: tk.track("tight", -0.4),
            }}
          >
            zyte
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: tk.sp("6", 24),
              fontSize: tk.size("sm", 14),
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {["Products", "Pricing", "Resources", "Company"].map((i) => (
              <span key={i}>{i}</span>
            ))}
            <span
              style={{
                background: tk.color("primary", "500", "#b02cce"),
                color: "#ffffff",
                fontWeight: tk.weight("semibold", 600),
                padding: `${tk.sp("2", 8)} ${tk.sp("4", 16)}`,
                borderRadius: tk.rad("xl", 12),
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Get started
            </span>
          </div>
        </nav>

        <header
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: `${tk.sp("20", 80)} ${gutter} ${tk.sp("24", 96)}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: tk.sp("1", 4),
              marginBottom: tk.sp("5", 20),
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={14} fill="#ffd166" stroke="#ffd166" />
            ))}
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: tk.size("xs", 12),
                marginLeft: tk.sp("2", 8),
              }}
            >
              4.8 / 5 on G2
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              maxWidth: 820,
              fontFamily: tk.sans,
              fontSize: tk.size("7xl", 68),
              fontWeight: tk.weight("semibold", 600),
              lineHeight: tk.lh("tight", 1.25),
              letterSpacing: tk.track("tighter", -0.8),
              color: "#ffffff",
            }}
          >
            Web data solved — from a single API request to billions of records.
          </h1>
          <p
            style={{
              margin: `${tk.sp("6", 24)} 0 0`,
              maxWidth: 540,
              fontSize: tk.size("xl", 20),
              lineHeight: tk.lh("relaxed", 1.625),
              color: "rgba(255,255,255,0.8)",
            }}
          >
            One API for teams that want infrastructure control. Fully managed
            delivery for teams that want the outcome.
          </p>
          <div
            style={{
              display: "flex",
              gap: tk.sp("3", 12),
              marginTop: tk.sp("8", 32),
              flexWrap: "wrap",
            }}
          >
            <PrimaryButton tk={tk}>
              Try Zyte API <ArrowRight size={16} />
            </PrimaryButton>
            <GhostButton tk={tk} onDark>
              Talk to a data expert
            </GhostButton>
          </div>
        </header>
      </div>

      {/* ── Logo cloud (white) ────────────────────────────────────────────── */}
      <div
        style={{
          background: white,
          borderBottom: `1px solid ${border}`,
          padding: `${tk.sp("10", 40)} ${gutter}`,
        }}
      >
        <div
          style={{
            ...inner,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: tk.sp("8", 32),
            flexWrap: "wrap",
            opacity: 0.55,
            fontWeight: tk.weight("bold", 700),
            color: ink,
            fontSize: tk.size("lg", 18),
          }}
        >
          {["munchkin", "edmunds", "BORDER X", "SIXT", "Red Bull"].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>

      {/* ── 01 · Data types (white, feature cards) ────────────────────────── */}
      <section style={band(white)}>
        <div style={inner}>
          <SectionHead
            tk={tk}
            num="01"
            eyebrow="Data types"
            title="I want ecommerce product data."
            sublead="Structured product data — prices, availability, variants, reviews and images — extracted from any retailer and refreshed on the cadence you need."
          />
          <div
            style={{
              display: "grid",
              gap: tk.sp("5", 20),
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Card key={title} tk={tk} feature>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: tk.rad("xl", 12),
                    background: tk.color("primary", "50", "#fdf4ff"),
                    color: tk.color("primary", "500", "#b02cce"),
                    marginBottom: tk.sp("4", 16),
                  }}
                >
                  <Icon size={22} />
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: tk.size("xl", 20),
                    fontWeight: tk.weight("semibold", 600),
                    color: ink,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: `${tk.sp("2", 8)} 0 0`,
                    fontSize: tk.size("base", 16),
                    lineHeight: tk.lh("normal", 1.5),
                    color: muted,
                  }}
                >
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · For developers (dark code/integration band) ──────────────── */}
      <section style={band(darkBg)}>
        <div style={inner}>
          <SectionHead
            tk={tk}
            num="02"
            eyebrow="For developers"
            title="Web data at the speed of an API call."
            sublead="One endpoint handles requests, anti-bot, browser rendering, proxy rotation and extraction."
            onDark
          />
          <div
            style={{
              background: tk.color("surfaceDark", "secondary", "#0a0a0e"),
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: tk.rad("lg", 8),
              padding: tk.sp("5", 20),
              fontFamily: tk.mono,
              fontSize: tk.size("sm", 14),
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
              overflowX: "auto",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.45)" }}>{"# python"}</div>
            <div>
              <span style={{ color: tk.color("primary", "300", "#f0abfc") }}>
                resp
              </span>{" "}
              = requests.post(
            </div>
            <div>{'  "https://api.zyte.com/v1/extract",'}</div>
            <div>{'  json={"url": url, "product": True},'}</div>
            <div>)</div>
            <div>
              data = resp.json()[
              <span style={{ color: tk.color("accent", "300", "#e83281") }}>
                {'"product"'}
              </span>
              ]
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: tk.sp("8", 32),
              marginTop: tk.sp("8", 32),
              flexWrap: "wrap",
            }}
          >
            {STATS.map((st) => (
              <div key={st.label}>
                <div
                  style={{
                    fontSize: tk.size("4xl", 36),
                    fontWeight: tk.weight("semibold", 600),
                    color: "#ffffff",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {st.value}
                </div>
                <div
                  style={{
                    fontSize: tk.size("sm", 14),
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Reviews (subtle band, flat cards) ────────────────────────── */}
      <section style={band(sectionBg)}>
        <div style={inner}>
          <SectionHead
            tk={tk}
            num="03"
            eyebrow="Reviews"
            title="What our users say."
          />
          <div
            style={{
              display: "grid",
              gap: tk.sp("5", 20),
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {[
              {
                q: "Zyte API was a speed demon, unblocking every target without headless browsers.",
                a: "Marek Supp",
                r: "Benchmark",
              },
              {
                q: "Five engineers went back to building product instead of babysitting proxies.",
                a: "Anna Petrov",
                r: "Head of Engineering",
              },
              {
                q: "12 billion fare records a month, not a single scraping incident in a year.",
                a: "Diego F.",
                r: "VP Data",
              },
            ].map((t) => (
              <Card key={t.a} tk={tk}>
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    marginBottom: tk.sp("3", 12),
                  }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={tk.color("primary", "500", "#b02cce")}
                      stroke={tk.color("primary", "500", "#b02cce")}
                    />
                  ))}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: tk.size("base", 16),
                    lineHeight: tk.lh("relaxed", 1.625),
                    color: ink,
                  }}
                >
                  “{t.q}”
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: tk.sp("3", 12),
                    marginTop: tk.sp("4", 16),
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: tk.rad("full", 9999),
                      background: tk.color("primary", "100", "#fae8ff"),
                      color: tk.color("primary", "700", "#a21caf"),
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: tk.size("xs", 12),
                      fontWeight: tk.weight("semibold", 600),
                    }}
                  >
                    {t.a.slice(0, 2)}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: tk.size("sm", 14),
                        fontWeight: tk.weight("semibold", 600),
                        color: ink,
                      }}
                    >
                      {t.a}
                    </div>
                    <div
                      style={{ fontSize: tk.size("xs", 12), color: muted }}
                    >
                      {t.r}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Feature band (primary.50) with badges ────────────────────── */}
      <section style={band(featureBg)}>
        <div style={inner}>
          <SectionHead
            tk={tk}
            num="04"
            eyebrow="Why Zyte"
            title="Everything composed from one token surface."
            sublead="Buttons, pills, badges and cards all draw from the same foundations — change a token and the brand follows."
          />
          <div
            style={{ display: "flex", gap: tk.sp("3", 12), flexWrap: "wrap" }}
          >
            <Pill tk={tk}>
              <Zap size={12} /> Anti-bot
            </Pill>
            <Pill tk={tk}>Smart proxy</Pill>
            <Pill tk={tk}>Browser rendering</Pill>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: tk.sp("1.5", 6),
                background: tk.color("primary", "100", "#fae8ff"),
                color: tk.color("primary", "700", "#a21caf"),
                fontSize: tk.size("xs", 12),
                fontWeight: tk.weight("semibold", 600),
                padding: `${tk.sp("1", 4)} ${tk.sp("3", 12)}`,
                borderRadius: tk.rad("full", 9999),
              }}
            >
              <Check size={12} /> SOC 2
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: tk.sp("1.5", 6),
                background: tk.color("secondary", "500", "#181e5a"),
                color: "#ffffff",
                fontSize: tk.size("xs", 12),
                fontWeight: tk.weight("semibold", 600),
                padding: `${tk.sp("1", 4)} ${tk.sp("3", 12)}`,
                borderRadius: tk.rad("full", 9999),
              }}
            >
              Enterprise
            </span>
          </div>
          <div style={{ marginTop: tk.sp("8", 32), display: "flex", gap: tk.sp("3", 12), flexWrap: "wrap" }}>
            <PrimaryButton tk={tk}>
              Get started <ArrowRight size={16} />
            </PrimaryButton>
            <GhostButton tk={tk}>Explore docs</GhostButton>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: white,
          borderTop: `1px solid ${border}`,
          padding: `${tk.sp("10", 40)} ${gutter}`,
        }}
      >
        <div
          style={{
            ...inner,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: tk.sp("4", 16),
          }}
        >
          <span
            style={{
              fontSize: tk.size("xl", 20),
              fontWeight: tk.weight("bold", 700),
              color: ink,
            }}
          >
            zyte
          </span>
          <span style={{ fontSize: tk.size("sm", 14), color: muted }}>
            © Zyte — rendered live from {bundle.label} foundations
          </span>
        </div>
      </footer>
    </div>

    {/* ── Spec sheet: every foundation token, laid out ────────────────────── */}
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          padding: `${tk.sp("4", 16)} ${gutter}`,
          background: tk.color("surfaceLight", "cards", "#ffffff"),
          borderBottom: `1px solid ${border}`,
          fontFamily: tk.sans,
        }}
      >
        <Eyebrow tk={tk} num="05">
          Foundations
        </Eyebrow>
        <h2
          style={{
            margin: 0,
            fontSize: tk.size("2xl", 24),
            fontWeight: tk.weight("semibold", 600),
            color: ink,
          }}
        >
          Token spec — colours, type, spacing, radius &amp; elevation
        </h2>
      </div>
      <TokenGallery bundle={bundle} theme={galleryTheme} s={galleryScales} />
    </div>
    </div>
  );
}
