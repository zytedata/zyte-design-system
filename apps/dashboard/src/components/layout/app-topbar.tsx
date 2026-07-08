"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/lib/auth";
import { useActiveProduct } from "@/hooks/use-active-product";
import { getFoundations } from "@/data/foundations";
import { findSectionBySlug } from "@/lib/foundations";
import { findBrandSectionBySlug } from "@/lib/brand";
import { FeedbackButton } from "@/components/layout/feedback-button";
import { SyncStatus } from "@/components/layout/sync-status";
import { UserMenu } from "@/components/layout/user-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; href?: string };

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function useBreadcrumbs(): Crumb[] {
  const pathname = usePathname() ?? "/";
  const activeProduct = useActiveProduct();

  return React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

    if (segments.length === 0) {
      return crumbs;
    }

    if (segments[0] === "products" && activeProduct) {
      crumbs.push({
        label: activeProduct.label,
        href: `/products/${activeProduct.slug}`,
      });

      const subRoute = segments[2];
      if (subRoute === "foundations") {
        const sectionSlug = segments[3];
        crumbs.push({
          label: "Foundations",
          href: sectionSlug ? `/products/${activeProduct.slug}/foundations` : undefined,
        });
        if (sectionSlug) {
          const foundations = getFoundations(activeProduct.id);
          const match = foundations ? findSectionBySlug(foundations, sectionSlug) : null;
          crumbs.push({
            label: match ? match.label : titleCase(sectionSlug),
          });
        }
      } else if (subRoute === "brand") {
        const sectionSlug = segments[3];
        crumbs.push({
          label: "Brand",
          href: sectionSlug ? `/products/${activeProduct.slug}/brand` : undefined,
        });
        if (sectionSlug) {
          const match = findBrandSectionBySlug(sectionSlug);
          crumbs.push({ label: match ? match.label : titleCase(sectionSlug) });
        }
      } else if (subRoute === "documentation") {
        crumbs.push({ label: "Documentation" });
      } else if (subRoute) {
        crumbs.push({ label: titleCase(subRoute) });
      }

      return crumbs;
    }

    if (segments[0] === "components") {
      crumbs.push({
        label: "Components",
        href: segments[1] ? "/components" : undefined,
      });
      if (segments[1]) {
        crumbs.push({ label: titleCase(segments[1]) });
      }
      return crumbs;
    }

    if (segments[0] === "templates") {
      crumbs.push({
        label: "Templates",
        href: segments[1] ? "/templates" : undefined,
      });
      if (segments[1]) {
        crumbs.push({ label: titleCase(segments[1]) });
      }
      return crumbs;
    }

    if (segments[0] === "prototyping") {
      crumbs.push({ label: "Prototyping" });
      return crumbs;
    }

    crumbs.push({ label: titleCase(segments[0]) });
    return crumbs;
  }, [pathname, activeProduct]);
}

type GithubSync = { status: "synced" | "not_synced"; lastUpdate: string };

export function AppTopbar({
  githubSync,
  user,
}: {
  githubSync: GithubSync;
  user: SessionUser | null;
}) {
  const crumbs = useBreadcrumbs();

  return (
    <header className="bg-background/85 supports-[backdrop-filter]:bg-background/65 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1" />

      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const showOnDesktop = crumbs.length <= 2 || index > 0 || isLast;
            return (
              <React.Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem className={showOnDesktop ? undefined : "hidden md:block"}>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbSeparator className={showOnDesktop ? undefined : "hidden md:block"} />
                ) : null}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1.5">
        <FeedbackButton />
        <Separator orientation="vertical" className="mx-1 hidden md:block" />
        <SyncStatus
          source="github"
          status={githubSync.status}
          lastUpdate={githubSync.lastUpdate}
          href={siteConfig.links.github}
          label="GitHub Sync"
        />
        <SyncStatus
          source="figma"
          status="not_synced"
          lastUpdate="2026-04-23 10:40 UTC (mock)"
          href={siteConfig.links.figma}
          label="Figma Sync"
          downloadHref={siteConfig.links.figmaPlugin}
          downloadLabel="Download plugin"
        />
        {user ? (
          <>
            <Separator orientation="vertical" className="mx-1 hidden md:block" />
            <UserMenu user={user} />
          </>
        ) : null}
      </div>
    </header>
  );
}
