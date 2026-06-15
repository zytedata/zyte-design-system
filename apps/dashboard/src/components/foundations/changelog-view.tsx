"use client";

import { useMemo, useState } from "react";

import type { FileChangelog } from "@zyte/ds-types";

type ChangeKind = FileChangelog["entries"][number]["kind"];

const KIND_VARIANT: Record<ChangeKind, { label: string; className: string }> = {
  added: {
    label: "Added",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  changed: {
    label: "Changed",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  fixed: {
    label: "Fixed",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  removed: {
    label: "Removed",
    className: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
};

type FlatEntry = FileChangelog["entries"][number] & { file: string };

type ViewMode = "timeline" | "file";

function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

function KindBadge({ kind }: { kind: ChangeKind }) {
  const variant = KIND_VARIANT[kind];
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${variant.className}`}
    >
      {variant.label}
    </span>
  );
}

export function ChangelogView({
  changelogs,
  productSlug,
}: {
  changelogs: FileChangelog[];
  productSlug: string;
}) {
  const [mode, setMode] = useState<ViewMode>("timeline");

  const entries = useMemo<FlatEntry[]>(
    () =>
      changelogs
        .flatMap((changelog) =>
          changelog.entries.map((entry) => ({ ...entry, file: changelog.file })),
        )
        .sort(byDateDesc),
    [changelogs],
  );

  // Group the flat, date-sorted entries by date for the timeline rail.
  const byDate = useMemo(() => {
    const map = new Map<string, FlatEntry[]>();
    for (const entry of entries) {
      const bucket = map.get(entry.date);
      if (bucket) bucket.push(entry);
      else map.set(entry.date, [entry]);
    }
    return [...map.entries()];
  }, [entries]);

  if (changelogs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No changes logged for this product yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {entries.length} change{entries.length === 1 ? "" : "s"} across{" "}
          {changelogs.length} file{changelogs.length === 1 ? "" : "s"}
        </p>
        <div
          role="tablist"
          aria-label="Changelog view"
          className="bg-muted inline-flex rounded-lg p-0.5"
        >
          <ViewTab
            active={mode === "timeline"}
            onClick={() => setMode("timeline")}
          >
            Timeline
          </ViewTab>
          <ViewTab active={mode === "file"} onClick={() => setMode("file")}>
            By file
          </ViewTab>
        </div>
      </div>

      {mode === "timeline" ? (
        <ol className="border-border/60 ml-2 space-y-8 border-l pl-6">
          {byDate.map(([date, dayEntries]) => (
            <li key={date} className="relative">
              <span
                aria-hidden
                className="bg-primary ring-background absolute -left-[1.95rem] top-1 size-3 rounded-full ring-4"
              />
              <p className="font-mono text-xs font-medium tracking-wide">
                {date}
              </p>
              <ul className="mt-3 space-y-3">
                {dayEntries.map((entry) => (
                  <li
                    key={`${entry.file}-${entry.author}-${entry.message}`}
                    className="bg-card flex items-start gap-3 rounded-xl border p-4"
                  >
                    <KindBadge kind={entry.kind} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{entry.message}</p>
                      <p className="text-muted-foreground mt-1 font-mono text-[11px]">
                        {entry.file} · {entry.author}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <div className="space-y-6">
          {changelogs.map((file) => {
            const sorted = [...file.entries].sort(byDateDesc);
            return (
              <article key={file.file} className="bg-card rounded-xl border p-5">
                <header className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm font-medium">{file.file}</h3>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    packages/{productSlug}/src/{file.file}
                  </p>
                </header>
                <ol className="mt-4 space-y-3">
                  {sorted.map((entry) => (
                    <li
                      key={`${entry.date}-${entry.author}-${entry.message}`}
                      className="flex items-start gap-3"
                    >
                      <KindBadge kind={entry.kind} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">{entry.message}</p>
                        <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                          {entry.date} · {entry.author}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
