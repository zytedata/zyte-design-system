import { getProductBySlug } from "@/data/products";
import { getSkillById } from "@/data/studio/skills";
import { buildSystemPrompt } from "@/data/studio/system-prompt";
import { coerceProviderId } from "@/data/studio/providers";
import { readCanonicalDoc } from "@/data/foundations/docs";
import { readTemplate, type Template } from "@/data/templates";
import { jsonError, streamChat } from "@/lib/studio-llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

type ChatRequestBody = {
  productSlug?: string;
  skillId?: string;
  provider?: string;
  messages?: ChatMessage[];
};

/**
 * Ground the assistant in a template: keep its sections and intent as the
 * starting structure, apply the user's requested edits, regenerate the whole
 * document each turn.
 */
function templateInstructions(productLabel: string, template: Template): string {
  return [
    `Help the user iterate on the "${template.title}" page for ${productLabel}.`,
    "The page's current specification — its sections, copy, look & feel and behaviour — is below. Treat it as the starting structure: preserve its sections and intent unless the user explicitly asks to change them, and apply the user's requested edits on top.",
    "Produce the page as a clean markdown document (H1 title, H2 sections) that mirrors this structure.",
    "",
    "<template-spec>",
    template.markdown.trim(),
    "</template-spec>",
  ].join("\n");
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const out: ChatMessage[] = [];
  for (const item of input) {
    if (
      item &&
      typeof item === "object" &&
      (item as ChatMessage).role &&
      typeof (item as ChatMessage).content === "string"
    ) {
      const role = (item as ChatMessage).role;
      if (role === "user" || role === "assistant") {
        out.push({ role, content: (item as ChatMessage).content });
      }
    }
  }
  return out;
}

export async function POST(request: Request): Promise<Response> {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const product = body.productSlug ? getProductBySlug(body.productSlug) : null;
  if (!product) return jsonError("Unknown product.", 400);

  // The authoring option is either a template (skill = template) or one of the
  // generic skills. Template ids never collide with skill ids, so try the
  // template first and fall back to a skill.
  const optionId = body.skillId ?? "";
  const template = await readTemplate(product.id, optionId);
  const skill = template ? null : getSkillById(optionId);
  if (!template && !skill) return jsonError("Unknown authoring option.", 400);

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) return jsonError("No messages provided.", 400);

  const doc = await readCanonicalDoc(product.id);
  const systemPrompt = buildSystemPrompt({
    productLabel: product.label,
    instructions: template
      ? templateInstructions(product.label, template)
      : skill!.instructions,
    designDoc: doc?.content ?? null,
  });

  return streamChat(coerceProviderId(body.provider), [
    { role: "system", content: systemPrompt },
    ...messages,
  ]);
}
