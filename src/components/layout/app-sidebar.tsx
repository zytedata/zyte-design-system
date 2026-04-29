"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  BookOpen,
  Box,
  ChevronsUpDown,
  ExternalLink,
  FlaskConical,
  History,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  NAV_GROUPS,
  PRODUCT_LIST,
  type NavGroupId,
  type Product,
  type ProductNavItem,
} from "@/data/products";
import { useActiveProduct } from "@/hooks/use-active-product";
import { ZyteLogo } from "@/components/common/zyte-logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

function navIconFor(item: ProductNavItem): LucideIcon {
  const label = item.label.toLowerCase();
  if (item.externalUrl) return ExternalLink;
  if (label.includes("dashboard")) return LayoutDashboard;
  if (label.includes("changelog")) return History;
  if (label.includes("foundation")) return Layers;
  if (label.includes("component")) return Box;
  if (label.includes("template")) return LayoutTemplate;
  if (label.includes("prototyp")) return Wand2;
  if (label.includes("document")) return BookOpen;
  if (label.includes("asset")) return ImageIcon;
  if (label.includes("protozyte")) return FlaskConical;
  return Info;
}

function isItemActive(pathname: string, item: ProductNavItem): boolean {
  if (item.externalUrl) return false;
  if (item.matchExact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function groupNavItems(
  items: ProductNavItem[],
): Array<{ id: NavGroupId; label: string; items: ProductNavItem[] }> {
  return NAV_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    items: items.filter((item) => item.group === group.id),
  })).filter((group) => group.items.length > 0);
}

function ProductSwitcherButton({ active }: { active: Product | null }) {
  const router = useRouter();
  const ActiveIcon = active?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          aria-label="Switch active product"
        >
          <span className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <ZyteLogo className="size-4" width={18} height={18} />
          </span>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{siteConfig.shortName}</span>
            <span className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
              {ActiveIcon ? <ActiveIcon className="size-3" /> : null}
              {active ? active.label : "Select product"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={4}
        className="w-(--radix-dropdown-menu-trigger-width) min-w-64"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">Products</DropdownMenuLabel>
        {PRODUCT_LIST.map((product) => {
          const Icon = product.icon;
          return (
            <DropdownMenuItem
              key={product.id}
              onClick={() => router.push(`/products/${product.slug}`)}
              className="gap-2"
            >
              <span className="bg-muted flex size-6 items-center justify-center rounded-md">
                <Icon className="size-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{product.label}</span>
                <span className="text-muted-foreground line-clamp-1 text-xs">
                  {product.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/")}>
          <Info className="size-4" />
          Back to overview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderNavItem(item: ProductNavItem, pathname: string): React.ReactElement {
  const Icon = navIconFor(item);

  if (item.externalUrl) {
    return (
      <SidebarMenuButton asChild tooltip={item.label}>
        <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
          <Icon />
          <span>{item.label}</span>
        </a>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton
      asChild
      isActive={isItemActive(pathname, item)}
      tooltip={item.label}
    >
      <Link href={item.href}>
        <Icon />
        <span>{item.label}</span>
      </Link>
    </SidebarMenuButton>
  );
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const activeProduct = useActiveProduct();
  const groupedNav = activeProduct ? groupNavItems(activeProduct.nav) : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <ProductSwitcherButton active={activeProduct} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        {activeProduct ? (
          groupedNav.map((group, index) => (
            <SidebarGroup
              key={group.id}
              className={index === 0 ? "pb-1" : "py-1"}
            >
              {index === 0 ? null : (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              )}
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    {renderNavItem(item, pathname)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Products</SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {PRODUCT_LIST.map((product) => {
                const Icon = product.icon;
                return (
                  <SidebarMenuItem key={product.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={product.label}
                      isActive={pathname === `/products/${product.slug}`}
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Icon />
                        <span>{product.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div
          className={cn(
            "flex items-center justify-between gap-2 px-2 py-1",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
          )}
        >
          <span className="text-muted-foreground truncate text-xs group-data-[collapsible=icon]:hidden">
            v0.1.0 — built with care
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
