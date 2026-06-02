import { getProductBySlug } from "@/data/products";
import { getSkillById } from "@/data/studio/skills";
import { buildSystemPrompt } from "@/data/studio/system-prompt";
import { coerceProviderId } from "@/data/studio/providers";
import { readCanonicalDoc } from "@/data/foundations/docs";
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

  const skill = getSkillById(body.skillId ?? "");
  if (!skill) return jsonError("Unknown skill.", 400);

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) return jsonError("No messages provided.", 400);

  const doc = await readCanonicalDoc(product.id);
  const systemPrompt = buildSystemPrompt({
    productLabel: product.label,
    skill,
    designDoc: doc?.content ?? null,
  });

  return streamChat(coerceProviderId(body.provider), [
    { role: "system", content: systemPrompt },
    ...messages,
  ]);
}
