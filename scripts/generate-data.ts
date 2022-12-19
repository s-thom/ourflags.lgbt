/* eslint-disable import/no-extraneous-dependencies no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getFaviconSvg, getStripedFlagSvg } from "../lib/flagSvg";
import {
  CONTENT_MARKDOWN,
  DATA,
  PUBLIC_IMAGES_FAVICONS,
  PUBLIC_IMAGES_FLAGS,
} from "../lib/paths";
import { svgToPng } from "../lib/svgToPng";
import { pmap } from "../lib/utils";
import pkg from "../package.json" assert { type: "json" };
import { FlagData } from "../types/types";

const PNG_SIZES = [128, 840, 1080];
const FAVICON_SIZES = [32, 128, 192];

// TODO: Logging and error handling in script

async function getMetaForFile(path: string): Promise<FlagData> {
  const fileContent = await readFile(path);

  const parsed = matter(fileContent, { excerpt: true });

  return {
    meta: parsed.data as any,
    excerpt: parsed.excerpt?.trim(),
    content: parsed.content.trim(),
  };
}

async function writeFlagContentFile(file: FlagData) {
  await writeFile(join(DATA, `${file.meta.id}.json`), JSON.stringify(file));
}

async function writeMetaFile(files: FlagData[]) {
  await writeFile(
    join(DATA, "meta.ts"),
    `import { FlagMeta } from "../types/types";\nconst FLAGS: FlagMeta[] = ${JSON.stringify(
      files.map((file) => file.meta)
    )};\nexport default FLAGS;`
  );
}

async function writeSiteFile() {
  const data = { name: "My Flags", version: pkg.version };

  await writeFile(
    join(DATA, "site.ts"),
    Object.entries(data)
      .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
      .join("")
  );
}

async function writeFlagPublicImage(file: FlagData) {
  if (!file.meta.flag) {
    return;
  }

  const svg = getStripedFlagSvg(
    file.meta.flag.stripes,
    file.meta.flag.additionalPaths
  );

  await pmap(PNG_SIZES, async (height) => {
    const png = svgToPng(svg, height);
    await writeFile(
      join(PUBLIC_IMAGES_FLAGS, `${file.meta.id}_${height}.png`),
      png
    );
  });
}

async function writeFlagFavicon(file: FlagData) {
  if (!file.meta.flag) {
    return;
  }

  const svg = getFaviconSvg([file.meta]);

  await pmap(FAVICON_SIZES, async (height) => {
    const png = svgToPng(svg, height);
    await writeFile(
      join(PUBLIC_IMAGES_FAVICONS, `${file.meta.id}_${height}.png`),
      png
    );
  });
}

async function formatOutput() {
  return new Promise((res, rej) => {
    const task = exec("npx next lint --dir data --fix");
    task.on("error", rej);
    task.on("close", res);
  });
}

async function run() {
  const filenames = await readdir(CONTENT_MARKDOWN);

  const data = await pmap(filenames, (file) =>
    getMetaForFile(join(CONTENT_MARKDOWN, file))
  );

  await Promise.all([
    mkdir(DATA, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FLAGS, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FAVICONS, { recursive: true }),
  ]);

  const individualWritePromises = await pmap(data, (file) =>
    writeFlagContentFile(file)
  );
  const imagePromises = await pmap(data, (file) => writeFlagPublicImage(file));
  const faviconPromises = await pmap(data, (file) => writeFlagFavicon(file));
  const metaWritePromise = writeMetaFile(data);
  const siteWritePromise = writeSiteFile();

  await Promise.all([
    metaWritePromise,
    siteWritePromise,
    ...individualWritePromises,
    ...imagePromises,
    ...faviconPromises,
  ]);

  await formatOutput();
}

run();
