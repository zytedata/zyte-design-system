"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DocNavItem = {
  id: string;
  title: string;
};

export type DocNavGroup = {
  label?: string;
  items: DocNavItem[];
};

type DocumentationSidenavProps = {
  groups: DocNavGroup[];
};

/**
 * Sticky left-rail navigation for the per-product documentation page.
 *
 * Anchors to in-page sections rather than routing because each
 * documentation section is short enough that splitting it into separate
 * pages would add navigation friction without information density.
 *
 * Active highlighting uses an IntersectionObserver scroll-spy with a top
 * offset (the app topbar is ~64px tall and the section padding adds ~16px,
 * so we treat the top 80px of the viewport as "above the fold") and a
 * generous bottom rootMargin so the active item only changes once a
 * section is comfortably in view.
 */
export function DocumentationSidenav({ groups }: DocumentationSidenavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Note: we intentionally don't seed `activeId` here — the
    // IntersectionObserver fires synchronously after `observe()` for any
    // element already in the viewport, which gives us a correct initial
    // highlight without an extra synchronous setState in the effect body.

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <nav aria-label="Documentation sections" className="space-y-6">
      {groups.map((group, idx) => (
        <div key={group.label ?? `group-${idx}`}>
          {group.label ? (
            <p className="text-muted-foreground/80 px-2 pb-2 text-[11px] font-semibold tracking-wide uppercase">
              {group.label}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "hover:bg-accent block rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
