import { Size } from "./types";

export const SITE_NAME = "My Flags";
export const BASE_URL = "https://myflags.lgbt";

export const DEFAULT_FLAG_ID = "test1";

/**
 * Notes for each size is used
 * - 24:   Used inline in chips for link form
 * - 64:   Used in all flags list
 * - 128:  Used on shared pages and detail pages
 * - 840:
 * - 1080: For anyone who wants a larger image and types the URL themselves
 */
export const PNG_SIZES = [24, 64, 128, 840, 1080];
export const FAVICON_SIZES = [32, 128, 192];
export const OG_IMAGE_SIZES: Size[] = [{ width: 1200, height: 630 }];

export const FLAG_ASPECT_RATIO = 3 / 2;
