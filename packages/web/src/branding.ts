import type { ProductBranding } from "@zytedata/ds-types";

/**
 * Editorial brand guidance for the Web scope. Surfaced by the dashboard's
 * Brand pages (`/products/web/brand/<slug>`). Section `slug`s match the
 * dashboard's Brand sub-navigation so each page can look its content up by URL.
 *
 * The copy below is placeholder proposition-level guidance — refine it as the
 * brand work lands. Keep one entry per section; the order here drives nothing
 * (the sidebar owns ordering), but mirroring it keeps editing intuitive.
 */
export const WEB_BRANDING: ProductBranding = {
  productSlug: "web",
  intro:
    "Zyte turns the messy open web into clean, dependable data. The brand should feel technical but human, confident but never hyped — the calm expert in a noisy market.",
  sections: [
    {
      slug: "overview",
      label: "Overview",
      tagline: "One brand, expressed consistently everywhere.",
      summary:
        "The Brand section is the bridge between our foundations (raw tokens) and the experiences we ship. It defines who Zyte is, how we sound, and how the brand shows up across marketing, product and agentic surfaces.",
      principles: [
        "Trustworthy by default — clarity and accuracy over flash.",
        "Technical, not intimidating — we make hard things feel approachable.",
        "Consistent across surfaces — website, product and docs feel like one company.",
        "Built on tokens — every brand decision traces back to a foundation token.",
      ],
      guidelines: {
        do: [
          "Start from the foundations and layer brand intent on top.",
          "Reuse the same voice and visual rules across every surface.",
        ],
        dont: [
          "Invent one-off brand treatments for a single page.",
          "Treat brand as decoration bolted on at the end.",
        ],
      },
    },
    {
      slug: "logo",
      label: "Logo",
      tagline: "The most recognisable, most protected asset we own.",
      summary:
        "The Zyte logo is our signature. Give it room, keep it legible, and never redraw it. Use the primary lockup wherever possible and fall back to the mark only in tight or square spaces.",
      principles: [
        "Primary (brand fuchsia) is the default — use it for product UI, documents, slides and any light surface. When in doubt, reach for primary.",
        "Reversed (white) is the primary logo's partner for dark or photographic backgrounds — swap to it whenever contrast on the fuchsia wordmark would otherwise fail.",
        "Monochrome (single ink or single white) is for constrained reproduction — one-colour print, embroidery, engraving, faxed/scanned docs or partner placements that only allow a single colour.",
        "One variant per surface — don't mix logo variants in the same view; pick the single variant that fits the background.",
        "The standalone mark is reserved for avatars, favicons and tight UI slots where the full lockup would fall below its minimum size.",
        "Minimum clear space equals the height of the 'Z' on all sides.",
        "Minimum size: 24px tall for the mark, 96px wide for the full lockup on screen.",
      ],
      guidelines: {
        do: [
          "Use the supplied SVGs at their native proportions.",
          "Place the logo on backgrounds that pass contrast requirements.",
        ],
        dont: [
          "Stretch, rotate, recolour or add effects to the logo.",
          "Recreate the wordmark in a different typeface.",
        ],
      },
    },
    {
      slug: "voice-and-tone",
      label: "Voice & Tone",
      tagline: "Plain-spoken expertise — clever, never clever-clever.",
      summary:
        "Our voice is the constant; our tone flexes with context. Marketing can be bold and energetic; product and errors stay calm, precise and reassuring. We write for busy engineers who value their time.",
      principles: [
        "Lead with the value, then the detail — front-load the point.",
        "Short sentences. Active voice. Concrete nouns over buzzwords.",
        "Confident, not boastful — show results instead of claiming greatness.",
        "Helpful in failure — errors explain what happened and what to do next.",
      ],
      guidelines: {
        do: [
          "Say 'extract data from any website' rather than 'leverage synergistic data solutions'.",
          "Use 'you' and 'we'; keep it conversational.",
        ],
        dont: [
          "Use hype words: revolutionary, game-changing, next-gen.",
          "Hide meaning behind jargon or acronyms.",
        ],
      },
    },
    {
      slug: "visual-language",
      label: "Visual Language",
      tagline: "Fuchsia energy on a sober, content-first canvas.",
      summary:
        "Our visual language pairs a restrained neutral base with confident fuchsia and orange accents, generous typography and breathing room. It is built to make dense technical content feel calm and scannable.",
      principles: [
        "Neutral surfaces do the heavy lifting; accent colour is a spotlight, not a flood.",
        "Headline gradient (orange → fuchsia) is reserved for hero moments.",
        "Generous spacing and large type create rhythm and scannability.",
        "Imagery favours real product, data and abstract gradients over stock photography.",
      ],
      guidelines: {
        do: [
          "Use accent colour to guide the eye to the single most important action.",
          "Lean on the spacing scale to create clear visual hierarchy.",
        ],
        dont: [
          "Fill large areas with saturated brand colour.",
          "Mix more than one accent gradient in a single view.",
        ],
      },
    },
    {
      slug: "product-expression",
      label: "Product Expression",
      tagline: "The brand, dialled down for daily work.",
      summary:
        "Inside the product the brand turns down the volume: utility comes first. Tokens carry the brand quietly through colour, type and spacing so the UI feels unmistakably Zyte without ever shouting.",
      principles: [
        "Function over flourish — never let brand styling slow a workflow.",
        "Accent colour signals interaction and state, not decoration.",
        "Density is allowed here; product surfaces can be tighter than marketing.",
        "Every brand expression maps to a foundation token, never an ad-hoc value.",
      ],
      guidelines: {
        do: [
          "Use semantic tokens for primary actions and focus states.",
          "Keep long-form data views neutral and high-contrast.",
        ],
        dont: [
          "Apply marketing-scale gradients or hero treatments to dense UI.",
          "Introduce brand colours outside the token set.",
        ],
      },
    },
    {
      slug: "ai-agentic-expression",
      label: "AI / Agentic Expression",
      tagline: "A capable assistant that earns trust by being transparent.",
      summary:
        "As Zyte becomes more agentic, the brand extends to how AI speaks and behaves. The assistant is competent and candid — it shows its reasoning, flags uncertainty, and never pretends to be human.",
      principles: [
        "Be transparent — distinguish generated output from verified data.",
        "Show confidence levels and sources; admit when unsure.",
        "Keep the assistant voice consistent with Voice & Tone — calm and precise.",
        "Use a consistent visual signal (e.g. accent shimmer) for AI-generated content.",
      ],
      guidelines: {
        do: [
          "Surface citations and let users verify agent output.",
          "Offer a clear way to undo or correct agent actions.",
        ],
        dont: [
          "Imply certainty the model does not have.",
          "Anthropomorphise the assistant or give it a fake persona.",
        ],
      },
    },
    {
      slug: "asset-usage",
      label: "Asset Usage",
      tagline: "Right asset, right place, every time.",
      summary:
        "Brand assets — logos, icons, illustrations, templates — live in one place and ship in approved formats. This section covers where to find them, how to use them, and the rules for partners and co-branding.",
      principles: [
        "Pull assets from the central brand library, not from screenshots or old decks.",
        "Prefer SVG for logos and icons; use optimised raster only when required.",
        "Co-branding keeps equal clear space between Zyte and partner marks.",
        "Partner and press usage follows the published brand guidelines and licence.",
      ],
      guidelines: {
        do: [
          "Check the asset's intended surface (light/dark) before placing it.",
          "Request new assets through the brand team rather than improvising.",
        ],
        dont: [
          "Re-export or recolour assets to fit a one-off need.",
          "Distribute brand assets externally without approval.",
        ],
      },
    },
  ],
};
