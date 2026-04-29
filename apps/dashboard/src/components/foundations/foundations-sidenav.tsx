"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { FoundationSection, FoundationSectionGroup } from "@/lib/foundations";

type FoundationsSidenavProps = {
  productSlug: string;
  sections: FoundationSection[];
  activeSlug: string;
};

const GROUP_ORDER: FoundationSectionGroup[] = ["agentic", "palette", "core"];

const GROUP_LABEL: Record<FoundationSectionGroup, string> = {
  agentic: "Agentic",
  palette: "Foundations · Color",
  core: "Foundations",
};

export function FoundationsSidenav({ productSlug, sections, activeSlug }: FoundationsSidenavProps) {
  return (
    <nav aria-label="Foundations sections" className="space-y-6">
      {GROUP_ORDER.map((group) => {
        const groupSections = sections.filter((s) => s.group === group);
        if (groupSections.length === 0) return null;

        return (
          <div key={group}>
            <p className="text-muted-foreground/80 px-2 pb-2 text-[11px] font-semibold tracking-wide uppercase">
              {GROUP_LABEL[group]}
            </p>
            <ul className="space-y-0.5">
              {groupSections.map((section) => {
                const href = `/products/${productSlug}/foundations/${section.slug}`;
                const isActive = activeSlug === section.slug;
                return (
                  <li key={section.id}>
                    <Link
                      href={href}
                      className={cn(
                        "hover:bg-accent block rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {section.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
