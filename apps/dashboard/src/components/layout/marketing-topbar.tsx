"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, LogIn } from "lucide-react";

import { WEB_FOUNDATIONS } from "@zytedata/ds-web";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { PRODUCT_LIST } from "@/data/products";
import { ZyteLogo } from "@/components/common/zyte-logo";
import { Button } from "@/components/ui/button";

// Brand fuchsia (primary.500) is the default Web logo variant (design.md);
// the wordmark renders solid fuchsia via the logo's `currentColor` fill.
const BRAND_FUCHSIA = WEB_FOUNDATIONS.colors.primary["500"];
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MarketingTopbar() {
  // Transparent over the hero at the top; solid white once the page scrolls.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        // No layout border: the header is exactly h-16 so the hero's `-mt-16`
        // overlay leaves no sliver. The scrolled divider is a shadow hairline.
        "sticky top-0 z-30 transition-[background-color,box-shadow]",
        scrolled
          ? "bg-white text-foreground shadow-[0_1px_0_0_var(--border)]"
          : "text-white",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="inline-flex items-center gap-2"
          style={{ color: BRAND_FUCHSIA }}
        >
          <ZyteLogo width={56} height={24} />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 md:flex"
        >
       
          <Button variant="ghost" size="sm" asChild>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/sign-in" aria-label="Sign in">
              Sign in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/products/web">
              <LogIn className="size-3.5" />
              Get started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
