import {
  YELLIX_WEIGHTS,
  FontDownloadLink,
} from "@/components/foundations/font-downloads";

/**
 * Yellix brand typeface as an Assets-page card. Mirrors the shape of
 * {@link AssetCard} (preview area + footer) but the payload is downloadable
 * font files rather than a single image. Files are served from `public/fonts/`.
 */
export function FontAssetCard() {
  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex h-44 items-center justify-center p-6">
        <div className="text-center leading-none" style={{ fontFamily: "Yellix" }}>
          <div className="text-6xl" style={{ fontWeight: 700 }}>
            Ag
          </div>
          <div className="text-muted-foreground mt-3 font-mono text-[10px] tracking-widest uppercase">
            300 · 400 · 600 · 700
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t p-4">
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">Yellix</p>
          <p className="text-muted-foreground truncate font-mono text-xs">
            Brand typeface · woff2 / woff
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {YELLIX_WEIGHTS.map((w) => (
            <FontDownloadLink key={w.file} href={`/fonts/${w.file}.woff2`}>
              {w.label}
            </FontDownloadLink>
          ))}
          <FontDownloadLink href="/fonts/yellix.css">yellix.css</FontDownloadLink>
        </div>
      </div>
    </div>
  );
}
