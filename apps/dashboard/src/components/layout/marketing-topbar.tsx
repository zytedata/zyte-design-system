"use client";

import Link from "next/link";
import { ChevronDown, LogIn } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PRODUCT_LIST } from "@/data/products";
import { ZyteLogo } from "@/components/common/zyte-logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
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
          <ZyteLogo width={56} height={24} />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 md:flex"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Products
                <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-72"
            >
              <DropdownMenuLabel className="text-muted-foreground text-[11px] tracking-wide uppercase">
                Workspaces
              </DropdownMenuLabel>
              {PRODUCT_LIST.map((product) => {
                const Icon = product.icon;
                return (
                  <DropdownMenuItem key={product.id} asChild className="gap-2">
                    <Link href={`/products/${product.slug}`}>
                      <span className="bg-muted flex size-7 items-center justify-center rounded-md">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">
                          {product.label}
                        </span>
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                          {product.description}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/products/web/foundations">
                  Foundations explorer
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/products/web/documentation">Docs</Link>
          </Button>

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
