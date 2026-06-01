"use client";

import type { CSSProperties } from "react";

/**
 * Hero backdrop for the landing page — ported from the zyte-onboarding-prototype
 * "Hero 7" experience. Three stacked layers:
 *
 *   1. **Perspective grid** — a 48 px grid tilted ~22° on rotateX, faded
 *      at top/bottom by a radial mask so the perspective never reveals a
 *      hard horizon line. Light/dark variants via `bg-zyte-grid(-dark)`.
 *
 *   2. **Snake SVG** — orthogonal line segments that crawl along the grid
 *      via animated `stroke-dashoffset`. Each interior corner gets a small
 *      circle ("blip") whose pulse is phase-shifted to coincide with the
 *      snake's visible window passing over the corner — giving the
 *      illusion of a packet hitting a junction. The third tone uses the
 *      brand headline-gradient paint server (orange→fuchsia) so snakes on
 *      the left run warm, snakes on the right run cool, mirroring the
 *      page's headline wash. Honors `prefers-reduced-motion: reduce`.
 *
 *   3. **Ambient glow wash** — flat (not skewed) radial glow at the top
 *      of the hero, in the headline-gradient anchor tones.
 *
 * All visual tokens live in `globals.css` (utilities `bg-zyte-grid(-dark)`,
 * `bg-zyte-glow(-dark)`, plus `--color-zyte-primary-600`,
 * `--color-zyte-ai-to`, `--gradient-headline-from/to`) so the SVG paint
 * server can resolve them via `var(...)`.
 */
export function HeroBackdrop() {
  return (
    <>
      {/* Skewed plane — grid + snake SVG share a single transformed
        * wrapper so they tilt together. This is what keeps the snake
        * paths landing exactly on grid intersections: both layers get
        * the same `rotateX`, so the grid lines and the snake
        * coordinates skew in lockstep. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [perspective:1400px]"
        style={{ perspectiveOrigin: "50% 35%" }}
      >
        <div className="absolute inset-0 [transform:rotateX(22deg)] [transform-origin:50%_50%]">
          <div className="bg-zyte-grid dark:bg-zyte-grid-dark absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,_black_30%,_transparent_75%)] dark:opacity-70" />
          <GridSnakes />
        </div>
      </div>

      {/* Glow wash stays flat — it's an ambient brand tint, not part of
        * the data plane, so it shouldn't share the grid's perspective. */}
      <div
        aria-hidden
        className="bg-zyte-glow dark:bg-zyte-glow-dark pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] opacity-80 dark:opacity-95"
      />
    </>
  );
}

/* -----------------------------------------------------------------------------
 * GridSnakes — thin line segments that crawl orthogonally along the grid.
 * Pure SVG + CSS; pauses with `prefers-reduced-motion`.
 *
 * Tone mix is intentionally restrained for the design system dashboard:
 *   • `primary`   — brand fuchsia (`--color-zyte-primary-600`)
 *   • `ai`        — accent indigo (`--color-zyte-ai-to`)
 *   • `gradient`  — orange→fuchsia headline gradient paint server
 *
 * Stroke widths span 0.75 → 2 to give the field visual hierarchy rather
 * than a uniform "noise" of identical lines.
 * --------------------------------------------------------------------------- */
function GridSnakes() {
  const snakes = [
    /* —— LEFT / CENTER — long roaming ambient lines —— */
    {
      d: "M 96 96 L 96 288 L 288 288 L 288 144 L 432 144 L 432 432 L 624 432 L 624 528",
      width: 1.5,
      dash: "70 520",
      offset: -590,
      duration: "12s",
      delay: "0s",
      tone: "primary" as const,
    },
    {
      d: "M 192 48 L 192 192 L 384 192 L 384 96 L 576 96",
      width: 1,
      dash: "50 420",
      offset: -470,
      duration: "11s",
      delay: "-9s",
      tone: "ai" as const,
    },
    {
      d: "M 720 144 L 720 336 L 528 336 L 528 528",
      width: 1.25,
      dash: "65 460",
      offset: -525,
      duration: "13s",
      delay: "-2s",
      tone: "primary" as const,
    },
    {
      d: "M 240 624 L 240 480 L 432 480 L 432 624 L 720 624",
      width: 1.25,
      dash: "75 540",
      offset: -615,
      duration: "15s",
      delay: "-8s",
      tone: "gradient" as const,
    },

    /* —— RIGHT — denser, with thicker "feature" gradient lines —— */
    {
      d: "M 1344 96 L 1152 96 L 1152 240 L 960 240 L 960 432 L 768 432",
      width: 1.5,
      dash: "90 560",
      offset: -650,
      duration: "14s",
      delay: "-3s",
      tone: "primary" as const,
    },
    {
      d: "M 1056 48 L 1056 192 L 1248 192 L 1248 288",
      width: 1.75,
      dash: "55 380",
      offset: -435,
      duration: "10s",
      delay: "-6s",
      tone: "gradient" as const,
    },
    {
      d: "M 1392 432 L 1248 432 L 1248 576 L 1056 576 L 1056 672",
      width: 1.75,
      dash: "60 480",
      offset: -540,
      duration: "13s",
      delay: "-4s",
      tone: "gradient" as const,
    },
    {
      d: "M 1392 192 L 1392 336 L 1296 336 L 1296 528",
      width: 2,
      dash: "100 580",
      offset: -680,
      duration: "18s",
      delay: "-7s",
      tone: "gradient" as const,
    },
    {
      d: "M 960 96 L 1104 96 L 1104 240 L 1296 240",
      width: 0.75,
      dash: "60 400",
      offset: -460,
      duration: "16s",
      delay: "-10s",
      tone: "ai" as const,
    },
    {
      d: "M 1056 336 L 1200 336 L 1200 432 L 1344 432",
      width: 0.75,
      dash: "35 240",
      offset: -275,
      duration: "6s",
      delay: "-5s",
      tone: "ai" as const,
    },

    /* —— Burst spiders — short paths, tight dash patterns, fast durations. —— */
    {
      d: "M 48 48 L 48 192 L 240 192",
      width: 1,
      dash: "35 180",
      offset: -215,
      duration: "5s",
      delay: "-1s",
      tone: "ai" as const,
    },
    {
      d: "M 1248 144 L 1248 288 L 1104 288 L 1104 432",
      width: 1.25,
      dash: "40 220",
      offset: -260,
      duration: "5.5s",
      delay: "-2.5s",
      tone: "gradient" as const,
    },
    {
      d: "M 48 528 L 144 528 L 144 624 L 336 624",
      width: 1,
      dash: "35 200",
      offset: -235,
      duration: "5s",
      delay: "-3.5s",
      tone: "ai" as const,
    },
    {
      d: "M 432 96 L 624 96 L 624 192 L 816 192",
      width: 1.25,
      dash: "45 280",
      offset: -325,
      duration: "6.5s",
      delay: "-4s",
      tone: "gradient" as const,
    },
    {
      d: "M 864 528 L 864 384 L 1008 384 L 1008 528",
      width: 1.25,
      dash: "40 240",
      offset: -280,
      duration: "6s",
      delay: "-1.5s",
      tone: "primary" as const,
    },

    /* —— "Long slow request" — lazy single sustained line —— */
    {
      d: "M 1344 576 L 1344 720 L 1152 720",
      width: 1.75,
      dash: "150 750",
      offset: -900,
      duration: "22s",
      delay: "-14s",
      tone: "gradient" as const,
    },

    /* —— FAR-RIGHT band (x ≥ 1440 px) — only visible on wide / ultrawide
     * screens. All gradient-toned because the page-wide paint server is
     * at its fuchsia end by this point. —— */

    // Band 1 — 1440-1600 px
    {
      d: "M 1488 144 L 1488 336 L 1632 336",
      width: 1.5,
      dash: "70 480",
      offset: -550,
      duration: "13s",
      delay: "-5s",
      tone: "gradient" as const,
    },
    {
      d: "M 1488 432 L 1584 432 L 1584 576 L 1488 576",
      width: 0.75,
      dash: "30 200",
      offset: -230,
      duration: "5.5s",
      delay: "-1s",
      tone: "ai" as const,
    },
    {
      d: "M 1536 624 L 1536 720 L 1632 720",
      width: 1,
      dash: "35 220",
      offset: -255,
      duration: "5.5s",
      delay: "-2.5s",
      tone: "gradient" as const,
    },

    // Band 2 — 1600-1800 px
    {
      d: "M 1632 96 L 1632 240 L 1776 240 L 1776 384",
      width: 1.25,
      dash: "60 420",
      offset: -480,
      duration: "12s",
      delay: "-2s",
      tone: "gradient" as const,
    },
    {
      d: "M 1680 528 L 1776 528 L 1776 672 L 1632 672",
      width: 1,
      dash: "40 260",
      offset: -300,
      duration: "7s",
      delay: "-3.5s",
      tone: "ai" as const,
    },
    {
      d: "M 1728 96 L 1728 192 L 1872 192",
      width: 1.5,
      dash: "50 320",
      offset: -370,
      duration: "9s",
      delay: "-6s",
      tone: "gradient" as const,
    },

    // Band 3 — 1800-2000 px (ultrawide territory)
    {
      d: "M 1824 288 L 1824 432 L 1968 432",
      width: 1.75,
      dash: "60 420",
      offset: -480,
      duration: "11s",
      delay: "-4s",
      tone: "gradient" as const,
    },
    {
      d: "M 1872 528 L 1872 672 L 1968 672",
      width: 1.75,
      dash: "120 600",
      offset: -720,
      duration: "20s",
      delay: "-9s",
      tone: "gradient" as const,
    },
  ];

  /* The blip's peak opacity hits at this fraction of its animation cycle.
   * Pairs with the 5% pre-glow keyframe stop in `globals.css` to give every
   * blip a small anticipation window before the snake's head arrives. */
  const BLIP_PEAK_FRAC = 0.15;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_top,_black_25%,_transparent_72%)]"
    >
      {/* Brand headline gradient paint server. `gradientUnits=
        * "userSpaceOnUse"` ties the gradient's coordinates to the SVG's
        * coordinate system (not each path's bbox) so snakes on the LEFT
        * come in oranger and snakes on the RIGHT come in more fuchsia,
        * mirroring the page's headline wash. The 2000 px x-span covers
        * the natural 1440 px hero PLUS the extra room on wide screens. */}
      <defs>
        <linearGradient
          id="zyte-snake-gradient"
          x1="0"
          y1="0"
          x2="2000"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            style={{ stopColor: "var(--gradient-headline-from)" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--gradient-headline-to)" }}
          />
        </linearGradient>
      </defs>

      {snakes.map((s, i) => {
        const stroke =
          s.tone === "ai"
            ? "var(--color-zyte-ai-to)"
            : s.tone === "gradient"
              ? "url(#zyte-snake-gradient)"
              : "var(--color-zyte-primary-600)";

        // `drop-shadow` is a CSS filter and CSS can't accept an SVG paint
        // server URL — so gradient snakes need a solid glow colour. A
        // mid-gradient pink reads warm enough next to orange-anchored
        // snakes and cool enough next to fuchsia-anchored ones.
        const glowColor =
          s.tone === "ai"
            ? "var(--color-zyte-ai-to)"
            : s.tone === "gradient"
              ? "#d23c7c"
              : "var(--color-zyte-primary-600)";

        const opacity =
          s.tone === "ai" ? 0.5 : s.tone === "gradient" ? 0.75 : 0.7;

        const corners = getInteriorCorners(s.d);
        const period = Math.abs(s.offset);
        const visibleLen = parseInt(s.dash.split(" ")[0]!, 10);
        const durSec = parseSeconds(s.duration);
        const snakeDelaySec = parseSeconds(s.delay);

        return (
          <g key={i}>
            <path
              d={s.d}
              fill="none"
              stroke={stroke}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`zyte-snake-path zyte-snake-${i + 1}`}
              style={
                {
                  strokeDasharray: s.dash,
                  opacity,
                  "--snake-offset": `${s.offset}px`,
                  "--snake-duration": s.duration,
                  "--snake-delay": s.delay,
                  filter: `drop-shadow(0 0 3px ${glowColor})`,
                } as CSSProperties
              }
            />
            {corners.map((c, j) => {
              const passTime =
                (posMod(c.cumulativeDist - visibleLen / 2, period) / period) *
                  durSec +
                snakeDelaySec;
              const blipDelay = passTime - BLIP_PEAK_FRAC * durSec;
              return (
                <circle
                  key={j}
                  cx={c.x}
                  cy={c.y}
                  r={2}
                  fill={stroke}
                  className="zyte-snake-blip"
                  style={
                    {
                      animationDuration: s.duration,
                      animationDelay: `${blipDelay.toFixed(2)}s`,
                      filter: `drop-shadow(0 0 4px ${glowColor})`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* -----------------------------------------------------------------------------
 * Path helpers
 * --------------------------------------------------------------------------- */

/** Pull interior corners (every L point except the path endpoint) out of an
 * orthogonal `M x y L x y …` path, and tag each with its cumulative arc
 * length from the start of the path. Used to position the corner "blips"
 * and to compute their animation delay. */
function getInteriorCorners(d: string) {
  const nums = d
    .replace(/[ML]/g, " ")
    .trim()
    .split(/\s+/)
    .map(Number);
  const points: Array<{ x: number; y: number; cumulativeDist: number }> = [];
  let cum = 0;
  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i]!;
    const y = nums[i + 1]!;
    if (points.length > 0) {
      const prev = points[points.length - 1]!;
      cum += Math.abs(x - prev.x) + Math.abs(y - prev.y);
    }
    points.push({ x, y, cumulativeDist: cum });
  }
  return points.slice(1, -1);
}

/** "12s" → 12, "-3s" → -3 */
function parseSeconds(s: string) {
  return Number.parseFloat(s);
}

/** JS's `%` keeps the sign of the dividend. We need a real (always-positive)
 * modulo so a blip slightly past the start of a period wraps to the END
 * of the previous one. */
function posMod(a: number, b: number) {
  return ((a % b) + b) % b;
}
