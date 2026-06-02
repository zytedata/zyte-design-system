/**
 * Tailwind class string for rendering markdown prose consistently across the
 * app (Foundations agentic doc + Markdown Studio preview). Apply with `cn()`
 * on the wrapper around a `<ReactMarkdown />`.
 */
export const MARKDOWN_PROSE_CLASSNAME = [
  "max-w-none text-sm leading-relaxed",
  "[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight",
  "[&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold",
  "[&_h4]:mb-1.5 [&_h4]:mt-5 [&_h4]:text-sm [&_h4]:font-semibold",
  "[&_p]:my-3 [&_p]:text-muted-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_em]:italic",
  "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-muted-foreground",
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-muted-foreground",
  "[&_li>p]:my-0",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_hr]:my-6 [&_hr]:border-border",
  "[&_code]:bg-muted [&_code]:text-foreground [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
  "[&_pre]:my-4 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]",
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs",
  "[&_th]:border [&_th]:bg-muted/40 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold",
  "[&_td]:border [&_td]:px-3 [&_td]:py-1.5 [&_td]:align-top",
].join(" ");

type FenceOpen = { ticks: number; bodyStart: number };

/**
 * Finds the LAST opening fence in `text`. When `tagged` is true only fences
 * labelled `markdown`/`md` are considered; otherwise any fence of 3+ backticks
 * counts. Captures the number of backticks so the matching close can respect
 * CommonMark's "close needs at least as many backticks" rule.
 */
function lastFenceOpen(text: string, tagged: boolean): FenceOpen | null {
  const re = tagged
    ? /(`{3,})(?:markdown|md)[^\S\r\n]*\r?\n/gi
    : /(`{3,})[^\S\r\n]*\r?\n/gi;
  let last: FenceOpen | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    last = { ticks: match[1].length, bodyStart: match.index + match[0].length };
  }
  return last;
}

/**
 * Extracts the latest fenced markdown document from an assistant reply.
 * Markdown Studio wraps the document in a four-backtick `````markdown` fence so
 * that normal triple-backtick code blocks inside it (```bash, ```json, …) do
 * not terminate the document early. Extraction is fence-length-aware: a wrapper
 * opened with N backticks is only closed by a line of N-or-more backticks, so
 * inner code blocks are preserved.
 *
 * Prefers a `markdown`/`md`-tagged wrapper, falling back to a bare fence if
 * that is all the model produced. While a reply is still streaming the closing
 * fence may not have arrived yet, so an unterminated block is accepted and the
 * preview updates live as tokens arrive.
 *
 * Returns `null` when no fenced block is present.
 */
export function extractMarkdownBlock(text: string): string | null {
  if (!text) return null;

  const open = lastFenceOpen(text, true) ?? lastFenceOpen(text, false);
  if (!open) return null;

  const rest = text.slice(open.bodyStart);
  // Closing fence: a line consisting only of >= as many backticks as the open.
  const closeRe = new RegExp(
    "^[^\\S\\r\\n]*`{" + open.ticks + ",}[^\\S\\r\\n]*$",
    "m",
  );
  const close = closeRe.exec(rest);
  const body = close ? rest.slice(0, close.index) : rest;
  const trimmed = body.replace(/\s+$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Extracts the latest fenced code block matching one of the given language
 * tags (e.g. ["html"]). Like {@link extractMarkdownBlock}, an unterminated
 * block is accepted so the preview can update while a reply streams in.
 */
export function extractFencedBlock(
  text: string,
  languages: string[],
): string | null {
  if (!text || languages.length === 0) return null;

  const re = new RegExp(
    "```(?:" + languages.join("|") + ")[^\\S\\r\\n]*\\r?\\n",
    "gi",
  );
  let bodyStart: number | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    bodyStart = match.index + match[0].length;
  }
  if (bodyStart === null) return null;

  const rest = text.slice(bodyStart);
  const closeIdx = rest.indexOf("```");
  const body = closeIdx === -1 ? rest : rest.slice(0, closeIdx);
  const trimmed = body.replace(/\s+$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Extracts the latest fenced ```html block from an assistant reply.
 */
export function extractHtmlBlock(text: string): string | null {
  return extractFencedBlock(text, ["html"]);
}

/**
 * Splits a design.md into its YAML front matter (machine-readable tokens) and
 * its prose body. Mirrors the logic used by the Foundations agentic doc.
 */
function splitFrontMatter(markdown: string): {
  frontmatter: string | null;
  body: string;
} {
  const match = markdown.match(
    /^(?:\s*<!--[\s\S]*?-->\s*)*---\r?\n([\s\S]*?)\r?\n---\r?\n?/,
  );
  if (!match) return { frontmatter: null, body: markdown };
  return {
    frontmatter: match[1]?.trim() ?? null,
    body: markdown.slice(match[0].length).replace(/^\r?\n+/, ""),
  };
}

/**
 * Merges a generated document with the product's design.md so the exported
 * markdown is self-contained: pasting it into another tool (Claude, Cursor) or
 * handing it to a developer carries the design system guardrails along, and the
 * result should look and feel like the design system describes.
 *
 * The content stays primary; the design system is appended as a clearly
 * delimited reference. Any leading YAML front matter in the spec is wrapped in
 * a fenced ```yaml block so it renders cleanly and remains machine-readable.
 */
export function composeExportMarkdown({
  content,
  designSystem,
  productLabel,
}: {
  content: string;
  designSystem: string | null;
  productLabel: string;
}): string {
  const body = content.trim();
  if (!designSystem || !designSystem.trim()) return body;

  const { frontmatter, body: specBody } = splitFrontMatter(designSystem);
  const designBlock = frontmatter
    ? ["```yaml", frontmatter, "```", "", specBody.trim()].join("\n")
    : designSystem.trim();

  return [
    body,
    "",
    "---",
    "",
    `# Design system reference — ${productLabel}`,
    "",
    `> The document above should look and feel like the ${productLabel} design system. Follow the foundations below (colours, typography, spacing, components) when building this page in another tool or by hand.`,
    "",
    designBlock,
    "",
  ].join("\n");
}
