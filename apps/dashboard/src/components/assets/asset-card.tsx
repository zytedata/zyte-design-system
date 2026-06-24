"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import type { Asset } from "@/data/assets";
import { cn } from "@/lib/utils";

/**
 * A single brand asset. When the asset has more than one variant
 * (e.g. logo primary / reversed / hero), a switcher lets you flip between
 * them; a sun/moon toggle flips the preview backdrop so light-on-dark marks
 * stay legible. Download always grabs the currently selected variant.
 */
export function AssetCard({ asset }: { asset: Asset }) {
  const [index, setIndex] = useState(0);
  const variant = asset.variants[index] ?? asset.variants[0];
  const [bgOverride, setBgOverride] = useState<"light" | "dark" | null>(null);
  const bg = bgOverride ?? variant.background;

  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl border">
      <div
        className={cn(
          "flex h-44 items-center justify-center p-6 transition-colors",
          bg === "dark" ? "bg-[#0b0d25]" : "bg-muted/40",
        )}
      >
        {variant.kind === "svg" && variant.svg ? (
          <div
            className="[&_svg]:max-h-28 [&_svg]:w-auto"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: variant.svg }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={variant.dataUri} alt={asset.title} className="max-h-28 w-auto" />
        )}
      </div>

      {asset.variants.length > 1 ? (
        <div className="flex flex-wrap gap-1.5 border-t p-3">
          {asset.variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setBgOverride(null); // re-apply the variant's natural backdrop
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                i === index
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t p-4">
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">{asset.title}</p>
          <p className="text-muted-foreground truncate font-mono text-xs">
            {variant.filename}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBgOverride(bg === "dark" ? "light" : "dark")}
            title="Toggle preview background"
            className="bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
          >
            {bg === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
          <a
            href={variant.dataUri}
            download={variant.filename}
            className="bg-muted hover:bg-muted/70 text-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
