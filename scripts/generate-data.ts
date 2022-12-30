// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* eslint-disable import/no-extraneous-dependencies,no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import rimrafCb from "rimraf";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { FAVICON_SIZES, PNG_SIZES } from "../lib/constants";
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
import { pmap } from "../lib/utils";

const rimraf = promisify(rimrafCb);

const I_REALLY_LIKE_LOG_SPAM = false;
const trace = (s: string) => I_REALLY_LIKE_LOG_SPAM && console.trace(s);

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

// #region Flags
async function parseFlagMeta(path: string): Promise<FlagData> {
  trace("Parsing flag metadata");

  trace("Reading file");
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    throw new Error("Failed to read flag file", {
      cause: err,
    });
  }

  trace("Extracting frontmatter from markdown");
  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    throw new Error("Failed to parse flag markdown", {
      cause: err,
    });
  }

  trace("Validating frontmatter");
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

  trace("Finished parsing flag metadata");
  return {
    meta: validated,
    excerpt: rawMatter.excerpt?.trim(),
    content: contentWithoutExcerpt,
  };
}

async function writeFlagContentFile(file: FlagData) {
  trace("Writing flag content");
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

  trace("Finished writing flag content");
}

async function writeFlagMetaCollection(files: FlagData[]) {
  const flagMetaList = files.map((file) => file.meta);
  flagMetaList.sort(sortMeta);

  const flagMap: { [key: string]: FlagMeta } = {};
  flagMetaList.forEach((flag) => {
    flagMap[flag.id] = flag;
  });

  trace("Writing flag collection");
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

  trace("Finished writing flag collection");
}

async function writeFlagPublicImage(file: FlagData) {
  trace("Generating images for flag");
  if (!file.meta.flag) {
    console.warn("Flag has no flag data, so no image can be generated", {
      flagId: file.meta.id,
    });
    return;
  }

  trace("About to generate SVG for flag");
  const svg = getStripedFlagSvg(
    file.meta.flag.stripes,
    file.meta.flag.additionalPaths
  );
  await writeFile(join(PUBLIC_IMAGES_FLAGS, `${file.meta.id}.svg`), svg);

  trace("About to write PNGs");
  await pmap(PNG_SIZES, async (height) => {
    let png: Buffer;

    try {
      png = svgToPng(svg, height);
    } catch (err) {
      throw new Error("Failed to convert flag SVG to PNG", {
        cause: err,
      });
    }

    try {
      await writeFile(
        join(PUBLIC_IMAGES_FLAGS, `${file.meta.id}_${height}.png`),
        png
      );
    } catch (err) {
      throw new Error("Failed to write image for flag", {
        cause: err,
      });
    }
  });

  trace("Finished writing images for flag");
}

async function writeFlagFavicon(file: FlagData) {
  trace("Generating favicons for flag");

  if (!file.meta.flag) {
    console.warn("Flag has no flag data, so no favicon can be generated", {
      flagId: file.meta.id,
    });
    return;
  }

  trace("Generating SVG for favicons");
  const svg = getFaviconSvg([file.meta]);

  trace("Writing favicons");
  await pmap(FAVICON_SIZES, async (height) => {
    const png = svgToPng(svg, height);
    await writeFile(
      join(PUBLIC_IMAGES_FAVICONS, `${file.meta.id}_${height}.png`),
      png
    );
  });

  trace("Finished generating favicons for flag");
}

async function runFlagTasks() {
  trace("Listing files in content directory");
  const filenames = await readdir(CONTENT_FLAGS);

  trace("Parsing frontmatter from Markdown files");
  const data: FlagData[] = [];
  const failedFiles: [string, unknown][] = [];
  await pmap(filenames, (file) =>
    parseFlagMeta(join(CONTENT_FLAGS, file)).then(
      (d) => data.push(d),
      (err) => {
        const cause = err?.cause ?? err;
        if (cause instanceof ZodError) {
          failedFiles.push([file, fromZodError(cause).message]);
        } else {
          failedFiles.push([file, err?.message]);
        }
      }
    )
  );

  if (failedFiles.length > 0) {
    console.warn(
      `${failedFiles.length} flags had metadata errors`,
      Object.fromEntries(failedFiles)
    );
    numErrors += failedFiles.length;
  }

  trace("Starting tasks. Prepare for log spam");
  const individualWritePromises = data.map((file) =>
    writeFlagContentFile(file)
  );
  const imagePromises = data.map((file) => writeFlagPublicImage(file));
  const faviconPromises = data.map((file) => writeFlagFavicon(file));
  const metaWritePromise = writeFlagMetaCollection(data);

  try {
    await Promise.all([
      metaWritePromise,
      ...individualWritePromises,
      ...imagePromises,
      ...faviconPromises,
    ]);
  } catch (err) {
    throw new Error("Failed to run all tasks", { cause: err });
  }
  trace("Finished tasks");
}
// #endregion

// #region Categories
async function parseCategoryMeta(path: string): Promise<CategoryData> {
  trace("Parsing category metadata");

  trace("Reading file");
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    throw new Error("Failed to read category file", {
      cause: err,
    });
  }

  trace("Extracting frontmatter from markdown");
  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    throw new Error("Failed to parse category markdown", {
      cause: err,
    });
  }

  trace("Validating frontmatter");
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

  trace("Finished parsing category metadata");
  return {
    meta: validated,
    excerpt: rawMatter.excerpt?.trim(),
    content: contentWithoutExcerpt,
  };
}

async function writeCategoryContentFile(file: CategoryData) {
  trace("Writing category content");
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

  trace("Finished writing category content");
}

async function writeCategoryMetaCollection(files: CategoryData[]) {
  const categoryMetaList = files.map((file) => file.meta);
  categoryMetaList.sort(sortMeta);

  const categoryMap: { [key: string]: CategoryMeta } = {};
  categoryMetaList.forEach((category) => {
    categoryMap[category.id] = category;
  });

  trace("Writing category collection");
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

  trace("Finished writing category collection");
}

async function runCategoryTasks() {
  trace("Listing files in content directory");
  const filenames = await readdir(CONTENT_CATEGORIES);

  trace("Parsing frontmatter from Markdown files");
  const data: CategoryData[] = [];
  const failedFiles: [string, unknown][] = [];
  await pmap(filenames, (file) =>
    parseCategoryMeta(join(CONTENT_CATEGORIES, file)).then(
      (d) => data.push(d),
      (err) => {
        const cause = err?.cause ?? err;
        if (cause instanceof ZodError) {
          failedFiles.push([file, fromZodError(cause).message]);
        } else {
          failedFiles.push([file, err?.message]);
        }
      }
    )
  );

  if (failedFiles.length > 0) {
    console.warn(
      `${failedFiles.length} categories had metadata errors`,
      Object.fromEntries(failedFiles)
    );
    numErrors += failedFiles.length;
  }

  trace("Starting tasks. Prepare for log spam");
  const individualWritePromises = data.map((file) =>
    writeCategoryContentFile(file)
  );
  const metaWritePromise = writeCategoryMetaCollection(data);

  try {
    await Promise.all([metaWritePromise, ...individualWritePromises]);
  } catch (err) {
    throw new Error("Failed to run all tasks", { cause: err });
  }
  trace("Finished tasks");
}
// #endregion

async function formatOutput() {
  trace("Formatting generated files");
  await new Promise((res, rej) => {
    const task = exec("npx next lint --dir lib/data --fix");
    task.on("error", rej);
    task.on("close", res);
  });

  trace("Finished formatting generated files");
}

async function run() {
  console.log("Creating output directories");
  trace("Cleaning directories");
  await Promise.all([
    rimraf(DATA_FLAGS),
    rimraf(DATA_CATEGORIES),
    rimraf(PUBLIC_IMAGES_FLAGS),
    rimraf(PUBLIC_IMAGES_FAVICONS),
  ]);
  trace("Creating output directories");
  await Promise.all([
    mkdir(DATA_FLAGS, { recursive: true }),
    mkdir(DATA_CATEGORIES, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FLAGS, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FAVICONS, { recursive: true }),
  ]);

  console.log("Running generation tasks");
  trace("Starting tasks. Prepare for log spam");
  try {
    await Promise.all([runFlagTasks(), runCategoryTasks()]);
  } catch (err) {
    throw new Error("Failed to run all tasks", { cause: err });
  }

  console.log("Formatting generated files");
  try {
    await formatOutput();
  } catch (err) {
    throw new Error("Failed to format files. Check for corruption", {
      cause: err,
    });
  }
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
