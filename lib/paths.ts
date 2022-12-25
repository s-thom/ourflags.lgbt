import { join } from "path";

export const BASE_PATH = process.cwd();

export const DATA = join(BASE_PATH, "data");
export const DATA_FLAGS = join(DATA, "flags");
export const DATA_CATEGORIES = join(DATA, "categories");

export const CONTENT = join(BASE_PATH, "content");
export const CONTENT_FLAGS = join(CONTENT, "flags");
export const CONTENT_CATEGORIES = join(CONTENT, "categories");

export const PUBLIC = join(BASE_PATH, "public");
export const PUBLIC_IMAGES = join(PUBLIC, "images");
export const PUBLIC_IMAGES_FLAGS = join(PUBLIC_IMAGES, "flags");
export const PUBLIC_IMAGES_FAVICONS = join(PUBLIC_IMAGES, "favicons");
