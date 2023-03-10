// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Size } from "./types";

const isDev = process.env.NODE_ENV === "development";

export const SITE_NAME = "Our Flags";

// Get the base URL for this environment. This needs to be accurate for
// absolute URLs, such as those for OpenGraph images.
const environmentUrl = process.env.NEXT_PUBLIC_BASE_URL;
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : undefined;
const fallbackUrl = isDev ? "http://localhost:3000" : "https://ourflags.lgbt";
export const BASE_URL = environmentUrl ?? vercelUrl ?? fallbackUrl;

export const GITHUB_URL = "https://github.com/s-thom/ourflags.lgbt";

export const DEFAULT_FLAG_ID = "progress-intersex";
// Least common multiple of 3, 5, 7, and 8 so we have integers when building paths
export const FLAG_SVG_VIEWBOX_HEIGHT = 840;

/**
 * Notes for each size is used
 * - 24:   Used inline in chips for link form
 * - 64:   Used in all flags list
 * - 128:  Used on shared pages and detail pages
 */
export const FLAG_IMAGE_SIZES = [24, 64, 128];
export const FLAG_IMAGE_SCALES = [1, 1.5, 2];
export const FAVICON_SIZES = [32, 128, 192];
export const OG_IMAGE_SIZES: Size[] = [{ width: 1200, height: 630 }];

export const FLAG_ASPECT_RATIO = 3 / 2;
