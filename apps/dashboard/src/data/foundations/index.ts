import type { FileChangelog, ProductFoundations } from "@zyte/ds-types";
import type { ProductId } from "@/data/products";

import { WEB_FOUNDATIONS, WEB_FILE_CHANGELOGS } from "@zyte/ds-web";
import { CORE_FOUNDATIONS, CORE_FILE_CHANGELOGS } from "@zyte/ds-core";
import { SCRAPY_FOUNDATIONS, SCRAPY_FILE_CHANGELOGS } from "@zyte/ds-scrapy";
import {
  EXTRACT_SUMMIT_FOUNDATIONS,
  EXTRACT_SUMMIT_FILE_CHANGELOGS,
} from "@zyte/ds-extract-summit";

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
  const rows = PRODUCT_CHANGELOGS[id];
  return Array.isArray(rows) ? rows : [];
}
