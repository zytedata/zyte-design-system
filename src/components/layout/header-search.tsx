"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useActiveProductId } from "@/hooks/use-active-product";
import { DEFAULT_PRODUCT_ID, PRODUCTS, type ProductId } from "@/data/products";

type SearchOption = { value: string; productId: ProductId; slug: string };

const SEARCH_OPTIONS: SearchOption[] = (Object.keys(PRODUCTS) as ProductId[]).flatMap((id) => {
  const product = PRODUCTS[id];
  if (!product.capabilities.components.enabled) return [];
  return product.capabilities.components.categories.flatMap((category) =>
    category.items.map((item) => ({
      value: item.slug,
      productId: id,
      slug: item.slug,
    })),
  );
});

export function HeaderSearch() {
  const router = useRouter();
  const activeProductId = useActiveProductId();
  const [value, setValue] = React.useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = value.trim().toLowerCase();
    if (!query) return;

    if (query.includes("foundation")) {
      const productId = activeProductId ?? DEFAULT_PRODUCT_ID;
      router.push(`/products/${PRODUCTS[productId].slug}/foundations`);
      return;
    }

    const match = SEARCH_OPTIONS.find(
      (option) => option.slug.toLowerCase() === query || option.slug.toLowerCase().includes(query),
    );

    if (match) {
      router.push(`/components/${match.slug}`);
    }
  };

  return (
    <form role="search" onSubmit={onSubmit} className="relative hidden w-full max-w-xs md:block">
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        list="docs-search-options"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search documentation..."
        aria-label="Search documentation"
        className="h-8 pl-8 text-sm"
      />
      <datalist id="docs-search-options">
        <option value="foundations" />
        {SEARCH_OPTIONS.map((option) => (
          <option key={`${option.productId}-${option.slug}`} value={option.slug} />
        ))}
      </datalist>
    </form>
  );
}
