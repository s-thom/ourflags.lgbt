// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* eslint-disable import/no-extraneous-dependencies,no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import ora from "ora";
import PQueue from "p-queue";
import { rimraf } from "rimraf";
import sharp, { Sharp } from "sharp";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  FAVICON_SIZES,
  FLAG_IMAGE_SCALES,
  FLAG_IMAGE_SIZES,
} from "../lib/constants";
import { getFaviconSvg, getStripedFlagSvg } from "../lib/server/flagSvg";
import {
  CONTENT_CATEGORIES,
  CONTENT_FLAGS,
  DATA_CATEGORIES,
  DATA_FLAGS,
  PUBLIC_IMAGES_FAVICONS,
  PUBLIC_IMAGES_FLAGS,
} from "../lib/server/paths";
import { svgToPng } from "../lib/server/svgToPng";
import {
  categoryMetaValidator,
  flagMetaValidator,
} from "../lib/server/validation";
import { CategoryData, CategoryMeta, FlagData, FlagMeta } from "../lib/types";

let numErrors = 0;

function sortMeta<T extends { name: string; order?: number }>(
  a: T,
  z: T
): number {
  if (a.order !== z.order) {
    return (a.order ?? Infinity) - (z.order ?? Infinity);
  }

  return a.name.localeCompare(z.name);
}

/** Includes scaled sizes */
const ALL_FLAG_IMAGE_SIZES = Array.from(
  new Set(
    FLAG_IMAGE_SIZES.flatMap((size) =>
      FLAG_IMAGE_SCALES.map((scale) => scale * size)
    )
  )
);

// Flag processing is limited mostly for aesthetic reasons, but also
// because of the amount of work that needs to be done.
const outerProcessingQueue = new PQueue({ concurrency: 4 });

// Image exports need to be queued to prevent fighting over the CPU.
// It wasn't really running into memory issues (due to CPU fighting),
// but I guess it would solve that if it was a problem.
const imageExportQueue = new PQueue({ concurrency: 4 });

async function exportSvg(filename: string, svg: string) {
  await writeFile(filename, svg);
}

async function exportPng(filename: string, data: Sharp) {
  const buffer = await data.png({ colors: 256 }).toBuffer();
  await writeFile(filename, buffer);
}

async function exportWebP(filename: string, data: Sharp) {
  const buffer = await data.webp({ lossless: true }).toBuffer();
  await writeFile(filename, buffer);
}

async function exportAvif(filename: string, data: Sharp) {
  const buffer = await data.avif({ lossless: true }).toBuffer();
  await writeFile(filename, buffer);
}

type ImageFormat = "svg" | "png" | "webp" | "avif";

interface ImageExportOptions {
  directory: string;
  name: string;
  svg: string;
  heights: number[];
  formats: ImageFormat[];
}

async function exportSvgImageFormatVariants({
  directory,
  name,
  svg,
  heights,
  formats,
}: ImageExportOptions) {
  const promises: Promise<unknown>[] = [];

  const hasFormat: {
    [key in ImageFormat]?: boolean | undefined;
  } = {};
  for (const format of formats) {
    hasFormat[format] = true;
  }

  const addJob = (fn: () => Promise<any>) =>
    promises.push(imageExportQueue.add(fn));

  if (hasFormat.svg) {
    addJob(() => exportSvg(join(directory, `${name}.svg`), svg));
  }

  if (hasFormat.png || hasFormat.webp || hasFormat.avif) {
    for (const height of heights) {
      const png = svgToPng(svg, height);
      const data = sharp(png);

      if (hasFormat.png) {
        addJob(() =>
          exportPng(join(directory, `${name}_${height}.png`), data.clone())
        );
      }
      if (hasFormat.webp) {
        addJob(() =>
          exportWebP(join(directory, `${name}_${height}.webp`), data.clone())
        );
      }
      if (hasFormat.avif) {
        addJob(() =>
          exportAvif(join(directory, `${name}_${height}.avif`), data.clone())
        );
      }
    }
  }

  return Promise.all(promises);
}

// #region Flags
async function parseFlagMeta(path: string): Promise<FlagData> {
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    throw new Error("Failed to read flag file", {
      cause: err,
    });
  }

  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    throw new Error("Failed to parse flag markdown", {
      cause: err,
    });
  }

  let validated: FlagMeta;
  try {
    validated = flagMetaValidator.parse(rawMatter.data);
  } catch (err) {
    throw new Error("Failed to validate flag frontmatter.", {
      cause: err,
    });
  }

  const contentWithoutExcerpt = rawMatter.excerpt
    ? rawMatter.content
        .slice(rawMatter.excerpt.length) // Get rid of excerpt at top
        .replace(/^(?:\r?\n)*-{3,}/, "") // Remove the <hr>
        .trim()
    : rawMatter.content.trim();

  return {
    meta: validated,
    excerpt: rawMatter.excerpt?.trim(),
    content: contentWithoutExcerpt,
  };
}

async function writeFlagContentFile(file: FlagData) {
  try {
    await writeFile(
      join(DATA_FLAGS, `${file.meta.id}.json`),
      JSON.stringify(file)
    );
  } catch (err) {
    throw new Error("Failed to write flag data", {
      cause: err,
    });
  }
}

async function writeFlagMetaCollection(files: FlagData[]) {
  const flagMetaList = files.map((file) => file.meta);
  flagMetaList.sort(sortMeta);

  const flagMap: { [key: string]: FlagMeta } = {};
  flagMetaList.forEach((flag) => {
    flagMap[flag.id] = flag;
  });

  try {
    await writeFile(
      join(DATA_FLAGS, "flags.ts"),
      `import { FlagMeta } from "../../types";\nexport const FLAGS: FlagMeta[] = ${JSON.stringify(
        flagMetaList
      )};\n\nexport const FLAGS_BY_ID: { [key: string]: FlagMeta } = {};\nFLAGS.forEach((flag) => { FLAGS_BY_ID[flag.id] = flag; });`
    );
  } catch (err) {
    throw new Error("Failed to write combined flag data", {
      cause: err,
    });
  }
}

async function writeFlagPublicImage(file: FlagData) {
  if (!file.meta.flag) {
    console.warn("Flag has no flag data, so no image can be generated", {
      flagId: file.meta.id,
    });
    return;
  }

  const svg = getStripedFlagSvg(
    file.meta.flag.stripes,
    file.meta.flag.additionalPaths
  );

  try {
    await exportSvgImageFormatVariants({
      directory: PUBLIC_IMAGES_FLAGS,
      name: file.meta.id,
      svg,
      heights: ALL_FLAG_IMAGE_SIZES,
      // AVIF is actually creating larger images than an unoptimised PNG, so
      // I've disabled it here.
      // What would be preferable to all of this is if Next's built-in image
      // optimisation has a lossless option. Then we could output a single
      // large image and have next take care of it.
      formats: ["svg", "png", "webp" /* , "avif" */],
    });
  } catch (err) {
    throw new Error("Failed to write images", {
      cause: err,
    });
  }
}

async function writeFlagFavicon(file: FlagData) {
  if (!file.meta.flag) {
    console.warn("Flag has no flag data, so no favicon can be generated", {
      flagId: file.meta.id,
    });
    return;
  }

  const svg = getFaviconSvg([file.meta]);

  try {
    await exportSvgImageFormatVariants({
      directory: PUBLIC_IMAGES_FAVICONS,
      name: file.meta.id,
      svg,
      heights: FAVICON_SIZES,
      formats: ["png"],
    });
  } catch (err) {
    throw new Error("Failed to write images", {
      cause: err,
    });
  }
}

async function runFlagTasks() {
  const filenames = await readdir(CONTENT_FLAGS);

  const allFlagData: FlagData[] = [];
  const failedFiles: [string, unknown][] = [];

  const queuePromise = outerProcessingQueue.addAll(
    filenames.map((filename) => async () => {
      let data: FlagData;
      try {
        data = await parseFlagMeta(join(CONTENT_FLAGS, filename));
      } catch (err) {
        const cause = (err as Error)?.cause ?? err;
        if (cause instanceof ZodError) {
          failedFiles.push([filename, fromZodError(cause).message]);
        } else {
          failedFiles.push([filename, (err as Error)?.message]);
        }

        return;
      }

      allFlagData.push(data);

      await writeFlagContentFile(data);
      await writeFlagFavicon(data);
      await writeFlagPublicImage(data);
    })
  );

  if (failedFiles.length > 0) {
    console.warn(
      `${failedFiles.length} flags had metadata errors`,
      Object.fromEntries(failedFiles)
    );
    numErrors += failedFiles.length;
  }

  try {
    await queuePromise;
    await writeFlagMetaCollection(allFlagData);
  } catch (err) {
    throw new Error("Failed to run all tasks", { cause: err });
  }
}
// #endregion

// #region Categories
async function parseCategoryMeta(path: string): Promise<CategoryData> {
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    throw new Error("Failed to read category file", {
      cause: err,
    });
  }

  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    throw new Error("Failed to parse category markdown", {
      cause: err,
    });
  }

  let validated: CategoryMeta;
  try {
    validated = categoryMetaValidator.parse(rawMatter.data);
  } catch (err) {
    throw new Error("Failed to validate category frontmatter.", {
      cause: err,
    });
  }

  const contentWithoutExcerpt = rawMatter.excerpt
    ? rawMatter.content
        .slice(rawMatter.excerpt.length) // Get rid of excerpt at top
        .replace(/^(?:\r?\n)*-{3,}/, "") // Remove the <hr>
        .trim()
    : rawMatter.content.trim();

  return {
    meta: validated,
    excerpt: rawMatter.excerpt?.trim(),
    content: contentWithoutExcerpt,
  };
}

async function writeCategoryContentFile(file: CategoryData) {
  try {
    await writeFile(
      join(DATA_CATEGORIES, `${file.meta.id}.json`),
      JSON.stringify(file)
    );
  } catch (err) {
    throw new Error("Failed to write category data", {
      cause: err,
    });
  }
}

async function writeCategoryMetaCollection(files: CategoryData[]) {
  const categoryMetaList = files.map((file) => file.meta);
  categoryMetaList.sort(sortMeta);

  const categoryMap: { [key: string]: CategoryMeta } = {};
  categoryMetaList.forEach((category) => {
    categoryMap[category.id] = category;
  });

  try {
    await writeFile(
      join(DATA_CATEGORIES, "categories.ts"),
      `import { CategoryMeta } from "../../types";\nexport const CATEGORIES: CategoryMeta[] = ${JSON.stringify(
        categoryMetaList
      )};\n\nexport const CATEGORIES_BY_ID: { [key: string]: CategoryMeta } = {};\nCATEGORIES.forEach((category) => { CATEGORIES_BY_ID[category.id] = category; });`
    );
  } catch (err) {
    throw new Error("Failed to write combined category data", {
      cause: err,
    });
  }
}

async function runCategoryTasks() {
  const filenames = await readdir(CONTENT_CATEGORIES);

  const allCategoryData: CategoryData[] = [];
  const failedFiles: [string, unknown][] = [];

  const queuePromise = outerProcessingQueue.addAll(
    filenames.map((filename) => async () => {
      let data: CategoryData;
      try {
        data = await parseCategoryMeta(join(CONTENT_CATEGORIES, filename));
      } catch (err) {
        const cause = (err as Error)?.cause ?? err;
        if (cause instanceof ZodError) {
          failedFiles.push([filename, fromZodError(cause).message]);
        } else {
          failedFiles.push([filename, (err as Error)?.message]);
        }

        return;
      }

      allCategoryData.push(data);

      await writeCategoryContentFile(data);
    })
  );

  if (failedFiles.length > 0) {
    console.warn(
      `${failedFiles.length} categories had metadata errors`,
      Object.fromEntries(failedFiles)
    );
    numErrors += failedFiles.length;
  }

  try {
    await queuePromise;
    await writeCategoryMetaCollection(allCategoryData);
  } catch (err) {
    throw new Error("Failed to run all tasks", { cause: err });
  }
}
// #endregion

async function formatOutput() {
  await new Promise((res, rej) => {
    const task = exec("npx next lint --dir lib/data --fix");
    task.on("error", rej);
    task.on("close", res);
  });
}

async function run() {
  let currentSpinner = ora("Creating output directories").start();
  try {
    await Promise.all([
      rimraf(DATA_FLAGS),
      rimraf(DATA_CATEGORIES),
      rimraf(PUBLIC_IMAGES_FLAGS),
      rimraf(PUBLIC_IMAGES_FAVICONS),
    ]);

    await Promise.all([
      mkdir(DATA_FLAGS, { recursive: true }),
      mkdir(DATA_CATEGORIES, { recursive: true }),
      mkdir(PUBLIC_IMAGES_FLAGS, { recursive: true }),
      mkdir(PUBLIC_IMAGES_FAVICONS, { recursive: true }),
    ]);
  } catch (err) {
    currentSpinner.fail();
    throw new Error("Failed to run all tasks", { cause: err });
  }
  currentSpinner.succeed();

  currentSpinner = ora("Running generation tasks - categories").start();
  try {
    let countAll = 0;
    let countDone = 0;
    outerProcessingQueue.on("add", () => {
      countAll++;
      currentSpinner.text = `Running generation tasks - categories [${countDone}/${countAll}]`;
    });
    outerProcessingQueue.on("completed", () => {
      countDone++;
      currentSpinner.text = `Running generation tasks - categories [${countDone}/${countAll}]`;
    });
    await runCategoryTasks();
  } catch (err) {
    currentSpinner.fail();
    throw new Error("Failed to run category tasks", { cause: err });
  }
  if (numErrors > 0) {
    currentSpinner.warn(
      `Running generation tasks - categories: ${numErrors} warnings`
    );
  } else {
    currentSpinner.succeed();
  }
  // For better error reporting, remove the category errors until after the flag tasks.
  const tmpCategoryErrors = numErrors;
  numErrors = 0;

  currentSpinner = ora("Running generation tasks - flags").start();
  try {
    let countAll = 0;
    let countDone = 0;
    outerProcessingQueue.on("add", () => {
      countAll++;
      currentSpinner.text = `Running generation tasks - flags [${countDone}/${countAll}]`;
    });
    outerProcessingQueue.on("completed", () => {
      countDone++;
      currentSpinner.text = `Running generation tasks - flags [${countDone}/${countAll}]`;
    });
    await runFlagTasks();
  } catch (err) {
    currentSpinner.fail();
    throw new Error("Failed to run flag tasks", { cause: err });
  }
  if (numErrors > 0) {
    currentSpinner.warn(
      `Running generation tasks - flags: ${numErrors} warnings`
    );
  } else {
    currentSpinner.succeed();
  }
  numErrors += tmpCategoryErrors;

  currentSpinner = ora("Formatting generated files").start();
  try {
    await formatOutput();
  } catch (err) {
    currentSpinner.fail();
    throw new Error("Failed to format files. Check for corruption", {
      cause: err,
    });
  }
  currentSpinner.succeed();
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", { err });
  process.exit(1);
});

run().then(
  () => {
    if (numErrors > 0) {
      console.error(`Done - ${numErrors} errors`);
      process.exit(1);
    }
    console.log("Done");
  },
  (err) => {
    console.error("Error generating data", { err });
    process.exit(1);
  }
);
