import type { LucideIcon } from "lucide-react";
import {
  FileText,
  LayoutTemplate,
  Megaphone,
  Newspaper,
  Wrench,
} from "lucide-react";

/**
 * A "skill" is a reusable authoring preset for the Markdown Studio. Each one
 * frames the conversation for a specific deliverable (landing page, pricing
 * page, dev hand-off spec, …) by injecting `instructions` into the system
 * prompt on top of the product's design.md guardrails.
 *
 * `suggestions` seed the empty-state with one-click prompts so non-technical
 * teammates have an obvious starting point.
 */
export type StudioSkill = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  instructions: string;
  suggestions: string[];
};

export const STUDIO_SKILLS: StudioSkill[] = [
  {
    id: "landing-page",
    label: "Landing page",
    description: "Marketing landing page brief: hero, value props, social proof, CTA.",
    icon: LayoutTemplate,
    instructions: [
      "Produce a marketing landing page brief as markdown.",
      "Structure it with clear sections: a hero (headline + subhead + primary CTA), 3-5 value propositions, an optional social-proof / logos band, a features or how-it-works section, and a closing call-to-action.",
      "Use H1 for the page title, H2 for sections, and concise scannable copy. Suggest button labels and link targets as placeholders (e.g. `[Get started](/sign-up)`).",
      "Where the design system implies brand voice or accent usage, reflect it in the copy and note it inline as a short HTML comment for developers.",
    ].join(" "),
    suggestions: [
      "Landing page for a new web-scraping API aimed at data teams",
      "Landing page announcing our managed extraction service",
    ],
  },
  {
    id: "pricing-page",
    label: "Pricing page",
    description: "Pricing tiers, feature comparison table, and FAQ.",
    icon: FileText,
    instructions: [
      "Produce a pricing page brief as markdown.",
      "Include 2-4 pricing tiers with name, price placeholder, short positioning line, and a bulleted feature list per tier; mark one tier as recommended.",
      "Add a feature-comparison table using GitHub-flavoured markdown tables, and a short FAQ section (H2) with 3-5 question/answer pairs.",
      "Keep monetary values as clearly-marked placeholders unless the user provides them.",
    ].join(" "),
    suggestions: [
      "Pricing page with Starter, Team, and Enterprise tiers",
      "Usage-based pricing page for an extraction API",
    ],
  },
  {
    id: "announcement",
    label: "Blog / announcement",
    description: "Product announcement or blog post with intro, body, and CTA.",
    icon: Megaphone,
    instructions: [
      "Produce a blog post or product announcement as markdown.",
      "Open with an H1 title and a one-paragraph hook, then a short 'TL;DR' bullet list, followed by body sections (H2) that explain what changed, why it matters, and how to use it.",
      "Close with a call-to-action and, where relevant, a short list of links.",
      "Write in an engaging but professional voice aligned with the product's brand.",
    ].join(" "),
    suggestions: [
      "Announce a new dashboard for monitoring scraping jobs",
      "Blog post about our migration to a new design system",
    ],
  },
  {
    id: "feature-spec",
    label: "Developer feature spec",
    description: "Hand-off spec devs can turn into a page: goals, layout, components, states.",
    icon: Wrench,
    instructions: [
      "Produce a developer hand-off specification as markdown that an engineer (or a coding agent like Cursor/Claude) can implement directly.",
      "Include: Overview/goal, Page layout (sections in order), Components to use (prefer the product's design system components and tokens), Content/copy, Interaction & states (loading, empty, error), Responsive behaviour, and Acceptance criteria as a checklist.",
      "Reference concrete design tokens (colours, spacing, typography) from the design system where appropriate, and call out accessibility requirements.",
    ].join(" "),
    suggestions: [
      "Spec a settings page with profile, billing, and API key sections",
      "Spec a data-table view with filtering and pagination",
    ],
  },
  {
    id: "page-brief",
    label: "Generic page brief",
    description: "Flexible, structured brief for any page or document.",
    icon: Newspaper,
    instructions: [
      "Produce a clear, well-structured markdown document for whatever page or content the user describes.",
      "Default to a sensible heading hierarchy (single H1, H2 sections), short paragraphs, and bullet lists where they aid scanning.",
      "Ask at most one clarifying question only if the request is too vague to draft anything useful; otherwise make reasonable assumptions and note them.",
    ].join(" "),
    suggestions: [
      "An about-us page brief",
      "A documentation landing page for our API",
    ],
  },
];

export const DEFAULT_SKILL_ID = STUDIO_SKILLS[0].id;

export function getSkillById(id: string): StudioSkill | undefined {
  return STUDIO_SKILLS.find((skill) => skill.id === id);
}
