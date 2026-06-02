/**
 * Self-contained share links (no backend): the whole HTML page is deflated and
 * base64url-encoded into the URL fragment (`/p#<token>`). The fragment never
 * leaves the browser, so nothing is stored or sent to the server. Uses the
 * native CompressionStream APIs, so these helpers only run client-side.
 */

const SHARE_PATH = "/p";

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function pipeThrough(
  input: Uint8Array,
  transform: GenericTransformStream,
): Promise<Uint8Array> {
  const writer = (transform.writable as WritableStream<Uint8Array>).getWriter();
  void writer.write(input);
  void writer.close();
  const buffer = await new Response(
    transform.readable as ReadableStream<Uint8Array>,
  ).arrayBuffer();
  return new Uint8Array(buffer);
}

/** Compress an HTML string into a URL-safe token for the `/p#…` fragment. */
export async function encodeShareHtml(html: string): Promise<string> {
  const input = new TextEncoder().encode(html);
  const compressed = await pipeThrough(
    input,
    new CompressionStream("deflate-raw"),
  );
  return bytesToBase64Url(compressed);
}

/** Reverse of {@link encodeShareHtml}. Throws on a malformed token. */
export async function decodeShareHtml(token: string): Promise<string> {
  const bytes = base64UrlToBytes(token);
  const inflated = await pipeThrough(
    bytes,
    new DecompressionStream("deflate-raw"),
  );
  return new TextDecoder().decode(inflated);
}

export function buildShareUrl(origin: string, token: string): string {
  return `${origin}${SHARE_PATH}#${token}`;
}
