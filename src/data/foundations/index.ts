import type { FileChangelog, ProductFoundations } from "./types";
import type { ProductId } from "@/data/products";

import { WEB_FOUNDATIONS, WEB_FILE_CHANGELOGS } from "@/data/products/web";
import { CORE_FOUNDATIONS, CORE_FILE_CHANGELOGS } from "@/data/products/core";
import { SCRAPY_FOUNDATIONS, SCRAPY_FILE_CHANGELOGS } from "@/data/products/scrapy";
import {
  EXTRACT_SUMMIT_FOUNDATIONS,
  EXTRACT_SUMMIT_FILE_CHANGELOGS,
} from "@/data/products/extract-summit";

export const PRODUCT_FOUNDATIONS: Record<ProductId, ProductFoundations> = {
  web: WEB_FOUNDATIONS,
  core: CORE_FOUNDATIONS,
  scrapy: SCRAPY_FOUNDATIONS,
  extractSummit: EXTRACT_SUMMIT_FOUNDATIONS,
};

export const PRODUCT_CHANGELOGS: Record<ProductId, FileChangelog[]> = {
  web: WEB_FILE_CHANGELOGS,
  core: CORE_FILE_CHANGELOGS,
  scrapy: SCRAPY_FILE_CHANGELOGS,
  extractSummit: EXTRACT_SUMMIT_FILE_CHANGELOGS,
};

export function getFoundations(id: ProductId): ProductFoundations {
  return PRODUCT_FOUNDATIONS[id];
}

export function getChangelogs(id: ProductId): FileChangelog[] {
  return PRODUCT_CHANGELOGS[id];
}
