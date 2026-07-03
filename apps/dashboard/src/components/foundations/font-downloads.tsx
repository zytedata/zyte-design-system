import { Download } from "lucide-react";

/**
 * Yellix webfont downloads for the Typography page. The files are the canonical
 * hosted copy served from `public/fonts/` (also what the design.md spec links
 * to). Shown only when the product actually uses Yellix (see `usesYellix`).
 */

export type YellixWeight = {
  label: string;
  weight: number;
  /** Basename shared by the `.woff2` / `.woff` files under `/fonts/`. */
  file: string;
};

export const YELLIX_WEIGHTS: YellixWeight[] = [
  { label: "Light", weight: 300, file: "Yellix-Light" },
  { label: "Regular", weight: 400, file: "Yellix-Regular" },
  { label: "SemiBold", weight: 600, file: "Yellix-SemiBold" },
  { label: "Bold", weight: 700, file: "Yellix-Bold" },
];

/** True when a foundations font stack references Yellix (var or family name). */
export function usesYellix(...stacks: (string | undefined)[]): boolean {
  return stacks.some((stack) => stack && /yellix/i.test(stack));
}

export function FontDownloadLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      download
      className="bg-muted hover:bg-muted/70 text-foreground inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors"
    >
      <Download className="size-3" />
      {children}
    </a>
  );
}

export function FontDownloads() {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide uppercase">Download · Yellix webfont</h3>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Zyte’s brand typeface, self-hosted here (weights 300/400/600/700). Bind it to the{" "}
        <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">--font-yellix</code>{" "}
        CSS variable so the <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">sans</code>{" "}
        and <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">display</code>{" "}
        tokens resolve. To embed cross-origin without hosting the files, link the stylesheet:{" "}
        <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
          https://design.zyte.com/fonts/yellix.css
        </code>
        .
      </p>
      <div className="border-border/60 divide-border/60 divide-y overflow-hidden rounded-lg border">
        {YELLIX_WEIGHTS.map((w) => (
          <div key={w.file} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ fontFamily: "Yellix", fontWeight: w.weight }}>
                Yellix {w.label}
              </p>
              <p className="text-muted-foreground font-mono text-xs">font-weight: {w.weight}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <FontDownloadLink href={`/fonts/${w.file}.woff2`}>woff2</FontDownloadLink>
              <FontDownloadLink href={`/fonts/${w.file}.woff`}>woff</FontDownloadLink>
            </div>
          </div>
        ))}
        <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-muted-foreground text-xs">@font-face stylesheet (all weights)</p>
          <FontDownloadLink href="/fonts/yellix.css">yellix.css</FontDownloadLink>
        </div>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Yellix is a licensed typeface — use it only for Zyte properties and don’t redistribute the
        files outside Zyte.
      </p>
    </section>
  );
}
