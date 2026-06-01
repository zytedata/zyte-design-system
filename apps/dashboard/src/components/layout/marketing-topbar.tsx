"use client";

import Link from "next/link";
import { ChevronDown, LogIn } from "lucide-react";

import { WEB_FOUNDATIONS } from "@zyte/ds-web";

import { siteConfig } from "@/config/site";
import { PRODUCT_LIST } from "@/data/products";
import { ZyteLogo } from "@/components/common/zyte-logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";

const LOGO_GRADIENT = {
  from: WEB_FOUNDATIONS.colors.accentSecondary["500"],
  to: WEB_FOUNDATIONS.colors.primary["600"],
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MarketingTopbar() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="text-foreground inline-flex items-center gap-2"
        >
          <ZyteLogo width={56} height={24} gradient={LOGO_GRADIENT} />
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
          <ThemeToggle />
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
