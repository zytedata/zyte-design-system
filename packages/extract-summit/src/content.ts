/**
 * Product-specific narrative content for the Extract Summit package.
 * Mirrors the data hard-coded in the original Angular `ProductOverviewComponent`.
 */
export const EXTRACT_SUMMIT_DIRECTION = {
  direction: "Wolff Olins — Brutalist Power Infrastructure",
  concept:
    "Uncompromising. Blunt. Authoritative. The visual language of a Bloomberg terminal crossed with a Constructivist propaganda poster.",
  audience:
    "Engineers, data scientists, researchers, founders — people who build on public web data.",
  voice: "Direct. No fluff. Commands, not suggestions.",
};

export const EXTRACT_SUMMIT_CORE_PRINCIPLES = [
  "Typography IS the design. Bebas Neue at scale does the visual heavy lifting.",
  "One accent colour only — #FF3D00 red. Use it sparingly so it always hits hard.",
  "Ghost letterforms live behind every hero and content block. Structural, not decorative.",
  "Cards and grids use gap: 2px — the black gap between tiles is part of the aesthetic.",
  "No rounded corners. No gradients. No drop shadows. No border-radius anywhere.",
  "Noise texture overlays everything at opacity 0.035–0.045.",
  "Custom square red cursor — never use the default browser cursor.",
];

export const EXTRACT_SUMMIT_DESIGN_LAYERS = [
  {
    title: "Type System",
    details:
      "Display copy uses Bebas Neue (single weight, all caps for labels). Body, labels and forms use DM Mono (only 400/500). Bebas Neue is for display only — never for body copy.",
  },
  {
    title: "Colour Discipline",
    details:
      "Two surface levels (--black #0A0A0A, --grey #1A1A1A) alternate per section. One accent (--red #FF3D00) for buttons, slashes, ticker, stat slabs. Avoid pure #FFFFFF and #000000 except where the spec calls for #000 on red.",
  },
  {
    title: "Structural Devices",
    details:
      "Red slash (2–3px, skewX(-1deg), opacity 0.4–0.6) flanks heroes and modals. Section eyebrows use 01 — Label format with a 22px red ::before line. Ghost letterforms (#0D0D0D / #1E1E1E) sit behind heroes and inside cards.",
  },
  {
    title: "Animation & Cursor",
    details:
      "Scroll-triggered .reveal opacity + 40px translateY (cubic-bezier(0.16,1,0.3,1)). Stagger via .d1–.d5. Ticker scrolls horizontally on a 30s linear loop. Custom 12px square cursor expands to 48px (opacity 0.4) on interactive elements.",
  },
];

export const EXTRACT_SUMMIT_GUARDRAILS = [
  "No border-radius anywhere — including cursors, checkboxes, inputs, cards.",
  "No box-shadow, drop-shadow, glow effects or gradients (background or text).",
  "No font-weight: 600 or 700. Bebas Neue has no weight variation; DM Mono is 400/500 only.",
  "No gap larger than 2px on card grids. Always 2px.",
  "No font other than Bebas Neue and DM Mono. Never Inter, Roboto, Arial or system stacks.",
  "No text below 9px. No section without an eyebrow number.",
  "No body text in Bebas Neue — Bebas is display only, DM Mono carries every paragraph.",
  "No exclamation marks in copy. Headlines are sentence fragments ending in a full stop.",
];
