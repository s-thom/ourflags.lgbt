import { join } from "path";

export const BASE_PATH = process.cwd();

export const DATA = join(BASE_PATH, "data");

export const CONTENT = join(BASE_PATH, "content");
export const CONTENT_MARKDOWN = join(CONTENT, "markdown");

export const PUBLIC = join(BASE_PATH, "public");
export const PUBLIC_IMAGES = join(PUBLIC, "images");
export const PUBLIC_IMAGES_FLAGS = join(PUBLIC_IMAGES, "flags");
