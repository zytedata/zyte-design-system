"use client";

import { Download, GitBranch, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type SyncStatusProps = {
  source: "github" | "figma";
  status: "synced" | "not_synced";
  lastUpdate: string;
  href: string;
  label: string;
  /** Optional file to download (e.g. the Figma plugin bundle). */
  downloadHref?: string;
  downloadLabel?: string;
};

export function SyncStatus({
  source,
  status,
  lastUpdate,
  href,
  label,
  downloadHref,
  downloadLabel = "Download plugin",
}: SyncStatusProps) {
  const Icon = source === "github" ? GitBranch : Palette;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2"
          aria-label={`${label} status`}
          title={`${label} status`}
        >
          <Icon className="size-4" />
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full",
              status === "synced" ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 text-sm">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 size-3 rounded-full",
              status === "synced" ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
          <div className="flex-1">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">
              {status === "synced"
                ? `In sync with ${label.split(" ")[0]}`
                : `Not synced with ${label.split(" ")[0]}`}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">Last update: {lastUpdate}</p>
        <div className="mt-3 flex justify-end gap-2">
          {downloadHref ? (
            <Button asChild size="sm" variant="outline">
              <a href={downloadHref} download>
                <Download className="size-4" />
                {downloadLabel}
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" variant="outline">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Open {label.split(" ")[0]}
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
