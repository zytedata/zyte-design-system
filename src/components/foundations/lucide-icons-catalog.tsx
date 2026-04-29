"use client";

import * as React from "react";
import { icons as lucideIcons, Search, X, Copy, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconRow = {
  name: string;
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  useCase: string;
};

type GroupSpec = { id: string; label: string; keywords: string[] };

const ICON_GROUPS: GroupSpec[] = [
  {
    id: "navigation",
    label: "Navigation",
    keywords: [
      "arrow",
      "chevron",
      "corner",
      "route",
      "compass",
      "map",
      "locate",
      "navigation",
      "move",
      "sidebar",
    ],
  },
  {
    id: "actions",
    label: "Actions",
    keywords: [
      "plus",
      "minus",
      "x",
      "check",
      "edit",
      "trash",
      "delete",
      "copy",
      "save",
      "download",
      "upload",
      "refresh",
      "undo",
      "redo",
      "share",
    ],
  },
  {
    id: "communication",
    label: "Communication",
    keywords: ["mail", "message", "phone", "bell", "send", "inbox", "contact", "chat"],
  },
  {
    id: "filesData",
    label: "Files & Data",
    keywords: [
      "file",
      "folder",
      "database",
      "server",
      "table",
      "chart",
      "book",
      "clipboard",
      "terminal",
      "code",
    ],
  },
  {
    id: "security",
    label: "Security",
    keywords: ["lock", "unlock", "shield", "key", "fingerprint", "scan", "alert"],
  },
  {
    id: "media",
    label: "Media",
    keywords: ["image", "video", "camera", "play", "pause", "music", "audio", "mic", "volume", "film"],
  },
  {
    id: "commerce",
    label: "Commerce",
    keywords: [
      "cart",
      "bag",
      "credit",
      "wallet",
      "banknote",
      "dollar",
      "receipt",
      "tag",
      "ticket",
      "gift",
    ],
  },
  {
    id: "status",
    label: "Status & Feedback",
    keywords: [
      "info",
      "alert",
      "warning",
      "help",
      "loader",
      "clock",
      "timer",
      "activity",
      "signal",
      "battery",
      "wifi",
    ],
  },
  {
    id: "devices",
    label: "Devices & Tech",
    keywords: [
      "laptop",
      "monitor",
      "smartphone",
      "tablet",
      "cpu",
      "microchip",
      "usb",
      "bluetooth",
      "harddrive",
      "router",
    ],
  },
  {
    id: "nature",
    label: "Nature & Objects",
    keywords: [
      "sun",
      "moon",
      "cloud",
      "rain",
      "snow",
      "wind",
      "tree",
      "flower",
      "leaf",
      "home",
      "house",
      "car",
      "truck",
    ],
  },
];

function resolveUseCase(name: string): string {
  const normalized = name.toLowerCase();
  for (const group of ICON_GROUPS) {
    if (group.keywords.some((keyword) => normalized.includes(keyword))) {
      return group.id;
    }
  }
  return "other";
}

const ALL_ICONS: IconRow[] = Object.entries(lucideIcons).map(
  ([name, Component]) => ({
    name,
    Component: Component as React.ComponentType<React.SVGProps<SVGSVGElement>>,
    useCase: resolveUseCase(name),
  }),
);

const IconCard = React.memo(function IconCard({
  name,
  Component,
}: {
  name: string;
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(name).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  }, [name]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy "${name}"`}
      className={cn(
        "group bg-card hover:bg-accent/40 flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors",
      )}
    >
      <span
        aria-hidden="true"
        className="text-muted-foreground group-hover:text-foreground inline-flex size-8 items-center justify-center transition-colors"
      >
        <Component
          width={20}
          height={20}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>
      <span className="text-muted-foreground line-clamp-1 w-full font-mono text-[10px]">
        {name}
      </span>
      <span className="text-muted-foreground/60 inline-flex items-center gap-1 text-[10px]">
        {copied ? (
          <>
            <Check className="size-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="size-3 opacity-0 group-hover:opacity-100" />
          </>
        )}
      </span>
    </button>
  );
});

export function LucideIconsCatalog() {
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);

  const filtered = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return ALL_ICONS;
    return ALL_ICONS.filter((icon) => icon.name.toLowerCase().includes(q));
  }, [deferredQuery]);

  const groups = React.useMemo(() => {
    const buckets = new Map<string, { id: string; label: string; rows: IconRow[] }>();
    for (const group of ICON_GROUPS) {
      buckets.set(group.id, { id: group.id, label: group.label, rows: [] });
    }
    buckets.set("other", { id: "other", label: "Other", rows: [] });

    for (const row of filtered) {
      const bucket = buckets.get(row.useCase) ?? buckets.get("other")!;
      bucket.rows.push(row);
    }
    return Array.from(buckets.values()).filter((bucket) => bucket.rows.length > 0);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Lucide is the primary icon system. Default size{" "}
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
              20 × 20
            </code>
            , stroke width{" "}
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
              1.75
            </code>
            . Click any icon to copy its name.
          </p>
        </div>
        <div className="text-muted-foreground text-xs">
          {filtered.length.toLocaleString()} of{" "}
          {ALL_ICONS.length.toLocaleString()} icons
        </div>
      </header>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          inputMode="search"
          aria-label="Search Lucide icons"
          placeholder="Search icons (e.g. arrow, mail, lock)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pr-9 pl-9"
        />
        {query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm">
          No icons match{" "}
          <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
            {query}
          </code>
          .{" "}
          <Button
            variant="link"
            size="sm"
            className="px-1"
            onClick={() => setQuery("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.id} className="space-y-3">
              <header className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold tracking-wide uppercase">
                  {group.label}
                </h3>
                <span className="text-muted-foreground text-[11px]">
                  {group.rows.length} icons
                </span>
              </header>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                {group.rows.map((icon) => (
                  <IconCard
                    key={icon.name}
                    name={icon.name}
                    Component={icon.Component}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
