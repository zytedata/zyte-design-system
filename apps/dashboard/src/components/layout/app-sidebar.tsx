"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Box,
  ChevronRight,
  ChevronsUpDown,
  ExternalLink,
  FlaskConical,
  History,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
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
import {
  buildFoundationSections,
  type FoundationSection,
  type FoundationSectionGroup,
} from "@/lib/foundations";
import { BRAND_SECTIONS } from "@/lib/brand";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

function navIconFor(item: ProductNavItem): LucideIcon {
  const label = item.label.toLowerCase();
  if (item.externalUrl) return ExternalLink;
  if (label.includes("dashboard")) return LayoutDashboard;
  if (label.includes("changelog")) return History;
  if (label.includes("foundation")) return Layers;
  if (label.includes("agentic")) return Bot;
  if (label.includes("brand")) return Sparkles;
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

type SubNavGroup = {
  /** Optional small label rendered above the items. */
  label?: string;
  items: { href: string; label: string }[];
};

const FOUNDATION_GROUP_LABEL: Record<FoundationSectionGroup, string> = {
  agentic: "Agentic",
  palette: "Color",
  core: "Tokens",
};

function foundationsSubGroups(
  productSlug: string,
  product: Product,
): SubNavGroup[] {
  const bundle = product.capabilities.foundations.bundle;
  const sections = buildFoundationSections(bundle);
  const order: FoundationSectionGroup[] = ["agentic", "palette", "core"];

  return order
    .map((groupId): SubNavGroup | null => {
      const inGroup = sections.filter((s) => s.group === groupId);
      if (inGroup.length === 0) return null;
      return {
        label: FOUNDATION_GROUP_LABEL[groupId],
        items: inGroup.map((section: FoundationSection) => ({
          href: `/products/${productSlug}/foundations/${section.slug}`,
          label: section.label,
        })),
      };
    })
    .filter((g): g is SubNavGroup => g !== null);
}

function brandSubGroups(productSlug: string): SubNavGroup[] {
  return [
    {
      items: BRAND_SECTIONS.map((section) => ({
        href: `/products/${productSlug}/brand/${section.slug}`,
        label: section.label,
      })),
    },
  ];
}

function subGroupsForNavItem(
  item: ProductNavItem,
  product: Product,
): SubNavGroup[] | null {
  if (item.externalUrl) return null;
  const label = item.label.toLowerCase();
  if (label.includes("foundation")) {
    return foundationsSubGroups(product.slug, product);
  }
  if (label.includes("brand")) {
    return brandSubGroups(product.slug);
  }
  return null;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark.svg" alt="" className="size-8 shrink-0" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{siteConfig.name}</span>
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

type NavItemProps = {
  item: ProductNavItem;
  pathname: string;
  product: Product | null;
};

function PlainNavItem({ item, pathname }: NavItemProps) {
  const icon = navIconFor(item);

  if (item.externalUrl) {
    return (
      <SidebarMenuButton asChild tooltip={item.label}>
        <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
          {React.createElement(icon)}
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
        {React.createElement(icon)}
        <span>{item.label}</span>
      </Link>
    </SidebarMenuButton>
  );
}

function CollapsibleNavItem({
  item,
  pathname,
  groups,
}: NavItemProps & { groups: SubNavGroup[] }) {
  const icon = navIconFor(item);
  const sectionActive = isItemActive(pathname, item);

  // Auto-open the section when the user navigates into it; let users manually
  // toggle it otherwise. We don't force-close on leave so the section stays in
  // the state the user last set it to. Syncing during render (React's "adjust
  // state on change" pattern) avoids a setState-in-effect.
  const [open, setOpen] = React.useState(sectionActive);
  const [prevActive, setPrevActive] = React.useState(sectionActive);
  if (sectionActive !== prevActive) {
    setPrevActive(sectionActive);
    if (sectionActive) setOpen(true);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={sectionActive}
            tooltip={item.label}
            aria-expanded={open}
          >
            {React.createElement(icon)}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="gap-2 py-1">
            {groups.map((group, groupIndex) => (
              <React.Fragment key={`${group.label ?? "group"}-${groupIndex}`}>
                {group.label ? (
                  <li
                    aria-hidden="true"
                    className="text-muted-foreground/70 px-2 pt-1.5 pb-0.5 font-mono text-[10px] tracking-[0.16em] uppercase first:pt-0"
                  >
                    {group.label}
                  </li>
                ) : null}
                {group.items.map((sub) => {
                  const isActive = pathname === sub.href;
                  return (
                    <SidebarMenuSubItem key={sub.href}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link href={sub.href}>
                          <span>{sub.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </React.Fragment>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavItem(props: NavItemProps) {
  const { item, product } = props;
  const groups = product ? subGroupsForNavItem(item, product) : null;

  if (groups && groups.length > 0) {
    return <CollapsibleNavItem {...props} groups={groups} />;
  }

  return (
    <SidebarMenuItem>
      <PlainNavItem {...props} />
    </SidebarMenuItem>
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
                  <NavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    product={activeProduct}
                  />
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
