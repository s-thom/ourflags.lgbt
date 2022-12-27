/* eslint-disable import/no-extraneous-dependencies,no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { getFaviconSvg, getStripedFlagSvg } from "../lib/flagSvg";
import { getLogger, getMethodLogger, getTracer } from "../lib/logger";
import {
  CONTENT_CATEGORIES,
  CONTENT_FLAGS,
  DATA,
  DATA_CATEGORIES,
  DATA_FLAGS,
  PUBLIC_IMAGES_FAVICONS,
  PUBLIC_IMAGES_FLAGS,
} from "../lib/paths";
import { svgToPng } from "../lib/svgToPng";
import { pmap } from "../lib/utils";
import { categoryMetaValidator, flagMetaValidator } from "../lib/validation";
import pkg from "../package.json" assert { type: "json" };
import {
  CategoryData,
  CategoryMeta,
  FlagData,
  FlagMeta,
  Size,
} from "../types/types";

const DEFAULT_FAVICON_ID = "test1";

/**
 * Notes for each size is used
 * - 24:   Used inline in chips for link form
 * - 64:   Used in all flags list
 * - 128:  Used on shared pages and detail pages
 * - 840:
 * - 1080: For anyone who wants a larger image and types the URL themselves
 */
const PNG_SIZES = [24, 64, 128, 840, 1080];
const FAVICON_SIZES = [32, 128, 192];
const OG_IMAGE_SIZES: Size[] = [{ width: 1200, height: 630 }];

const baseLogger = getLogger("generate-data");

// #region Flags
async function parseFlagMeta(path: string): Promise<FlagData> {
  const logger = getMethodLogger("parseFlagMeta", baseLogger);
  const trace = getTracer(logger, { path });

  trace("Parsing flag metadata");

  trace("Reading file");
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    const newError = new Error("Failed to read flag file", {
      cause: err,
    });
    logger.error(newError.message, { err, path });
    throw newError;
  }

  trace("Extracting frontmatter from markdown");
  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    const newError = new Error("Failed to parse flag markdown", {
      cause: err,
    });
    logger.error(newError.message, { err, path });
    throw newError;
  }

  trace("Validating frontmatter");
  let validated: FlagMeta;
  try {
    validated = flagMetaValidator.parse(rawMatter.data);
  } catch (err) {
    const newError = new Error("Failed to validate flag frontmatter.", {
      cause: err,
    });

    if (err instanceof ZodError) {
      logger.error(newError.message, {
        path,
        errors: fromZodError(err).message,
        raw: err.format(),
      });
    } else {
      logger.error(newError.message, { err, path });
    }
    throw newError;
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
  const logger = getMethodLogger("writeFlagContentFile", baseLogger);
  const trace = getTracer(logger, { flagId: file.meta.id });

  trace("Writing flag content");
  try {
    await writeFile(
      join(DATA_FLAGS, `${file.meta.id}.json`),
      JSON.stringify(file)
    );
  } catch (err) {
    const newError = new Error("Failed to write flag data", {
      cause: err,
    });
    logger.error(newError.message, { err, flagId: file.meta.id });
    throw newError;
  }

  trace("Finished writing flag content");
}

async function writeFlagMetaCollection(files: FlagData[]) {
  const logger = getMethodLogger("writeFlagMetaCollection", baseLogger);
  const trace = getTracer(logger);

  const flagMetaList = files.map((file) => file.meta);
  flagMetaList.sort((a, z) => a.order - z.order);

  const flagMap: { [key: string]: FlagMeta } = {};
  flagMetaList.forEach((flag) => {
    flagMap[flag.id] = flag;
  });

  trace("Writing flag collection");
  try {
    await writeFile(
      join(DATA_FLAGS, "flags.ts"),
      `import { FlagMeta } from "../../types/types";\nexport const FLAGS: FlagMeta[] = ${JSON.stringify(
        flagMetaList
      )};\n\nexport const FLAGS_BY_ID: { [key: string]: FlagMeta } = {};\nFLAGS.forEach((flag) => { FLAGS_BY_ID[flag.id] = flag; });`
    );
  } catch (err) {
    const newError = new Error("Failed to write combined flag data", {
      cause: err,
    });
    logger.error(newError.message, { err });
    throw newError;
  }

  trace("Finished writing flag collection");
}

async function writeFlagPublicImage(file: FlagData) {
  const logger = getMethodLogger("writeFlagPublicImage", baseLogger);
  const trace = getTracer(logger, { flagId: file.meta.id });

  trace("Generating images for flag");
  if (!file.meta.flag) {
    logger.warn("Flag has no flag data, so no image can be generated", {
      flagId: file.meta.id,
    });
    return;
  }

  trace("About to generate SVG for flag");
  const svg = getStripedFlagSvg(
    file.meta.flag.stripes,
    file.meta.flag.additionalPaths
  );

  trace("About to write PNGs");
  await pmap(PNG_SIZES, async (height) => {
    let png: Buffer;

    try {
      png = svgToPng(svg, height);
    } catch (err) {
      const newError = new Error("Failed to convert flag SVG to PNG", {
        cause: err,
      });
      logger.error(newError.message, {
        err,
        flagId: file.meta.id,
        height,
      });
      throw newError;
    }

    try {
      await writeFile(
        join(PUBLIC_IMAGES_FLAGS, `${file.meta.id}_${height}.png`),
        png
      );
    } catch (err) {
      const newError = new Error("Failed to write image for flag", {
        cause: err,
      });
      logger.error(newError.message, {
        err,
        flagId: file.meta.id,
        height,
      });
      throw newError;
    }
  });

  trace("Finished writing images for flag");
}

async function writeFlagFavicon(file: FlagData) {
  const logger = getMethodLogger("writeFlagFavicon", baseLogger);
  const trace = getTracer(logger, { flagId: file.meta.id });

  trace("Generating favicons for flag");

  if (!file.meta.flag) {
    logger.warn("Flag has no flag data, so no favicon can be generated", {
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
  const logger = getMethodLogger("runFlagTasks", baseLogger);
  const trace = getTracer(logger);

  trace("Listing files in content directory");
  const filenames = await readdir(CONTENT_FLAGS);

  trace("Parsing frontmatter from Markdown files");
  const data = await pmap(filenames, (file) =>
    parseFlagMeta(join(CONTENT_FLAGS, file))
  );

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
    const newError = new Error("Failed to run all tasks", { cause: err });
    logger.error(newError.message);
    throw newError;
  }
  trace("Finished tasks");
}
// #endregion

// #region Categories
async function parseCategoryMeta(path: string): Promise<CategoryData> {
  const logger = getMethodLogger("parseCategoryMeta", baseLogger);
  const trace = getTracer(logger, { path });

  trace("Parsing category metadata");

  trace("Reading file");
  let fileContent: Buffer;
  try {
    fileContent = await readFile(path);
  } catch (err) {
    const newError = new Error("Failed to read category file", {
      cause: err,
    });
    logger.error(newError.message, { err, path });
    throw newError;
  }

  trace("Extracting frontmatter from markdown");
  let rawMatter: matter.GrayMatterFile<Buffer>;
  try {
    rawMatter = matter(fileContent, { excerpt: true });
  } catch (err) {
    const newError = new Error("Failed to parse category markdown", {
      cause: err,
    });
    logger.error(newError.message, { err, path });
    throw newError;
  }

  trace("Validating frontmatter");
  let validated: CategoryMeta;
  try {
    validated = categoryMetaValidator.parse(rawMatter.data);
  } catch (err) {
    const newError = new Error("Failed to validate category frontmatter.", {
      cause: err,
    });

    if (err instanceof ZodError) {
      logger.error(newError.message, {
        path,
        errors: fromZodError(err).message,
        raw: err.format(),
      });
    } else {
      logger.error(newError.message, { err, path });
    }
    throw newError;
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
  const logger = getMethodLogger("writeCategoryContentFile", baseLogger);
  const trace = getTracer(logger, { categoryId: file.meta.id });

  trace("Writing category content");
  try {
    await writeFile(
      join(DATA_CATEGORIES, `${file.meta.id}.json`),
      JSON.stringify(file)
    );
  } catch (err) {
    const newError = new Error("Failed to write category data", {
      cause: err,
    });
    logger.error(newError.message, { err, categoryId: file.meta.id });
    throw newError;
  }

  trace("Finished writing category content");
}

async function writeCategoryMetaCollection(files: CategoryData[]) {
  const logger = getMethodLogger("writeCategoryMetaCollection", baseLogger);
  const trace = getTracer(logger);

  const categoryMetaList = files.map((file) => file.meta);
  categoryMetaList.sort((a, z) => a.order - z.order);

  const categoryMap: { [key: string]: CategoryMeta } = {};
  categoryMetaList.forEach((category) => {
    categoryMap[category.id] = category;
  });

  trace("Writing category collection");
  try {
    await writeFile(
      join(DATA_CATEGORIES, "categories.ts"),
      `import { CategoryMeta } from "../../types/types";\nexport const CATEGORIES: CategoryMeta[] = ${JSON.stringify(
        categoryMetaList
      )};\n\nexport const CATEGORIES_BY_ID: { [key: string]: CategoryMeta } = {};\nCATEGORIES.forEach((category) => { CATEGORIES_BY_ID[category.id] = category; });`
    );
  } catch (err) {
    const newError = new Error("Failed to write combined category data", {
      cause: err,
    });
    logger.error(newError.message, { err });
    throw newError;
  }

  trace("Finished writing category collection");
}

async function runCategoryTasks() {
  const logger = getMethodLogger("runCategoryTasks", baseLogger);
  const trace = getTracer(logger);

  trace("Listing files in content directory");
  const filenames = await readdir(CONTENT_CATEGORIES);

  trace("Parsing frontmatter from Markdown files");
  const data = await pmap(filenames, (file) =>
    parseCategoryMeta(join(CONTENT_CATEGORIES, file))
  );

  trace("Starting tasks. Prepare for log spam");
  const individualWritePromises = data.map((file) =>
    writeCategoryContentFile(file)
  );
  const metaWritePromise = writeCategoryMetaCollection(data);

  try {
    await Promise.all([metaWritePromise, ...individualWritePromises]);
  } catch (err) {
    const newError = new Error("Failed to run all tasks", { cause: err });
    logger.error(newError.message);
    throw newError;
  }
  trace("Finished tasks");
}
// #endregion

async function writeSiteMetadata() {
  const logger = getMethodLogger("writeSiteMetadata", baseLogger);
  const trace = getTracer(logger);

  const data = {
    name: "My Flags",
    baseUrl: "https://myflags.lgbt",
    version: pkg.version,
    faviconSizes: FAVICON_SIZES,
    defaultFaviconId: DEFAULT_FAVICON_ID,
    ogImageSizes: OG_IMAGE_SIZES,
  };

  trace("Writing site metadata");
  try {
    await writeFile(
      join(DATA, "site.ts"),
      Object.entries(data)
        .map(
          ([key, value]) => `export const ${key} = ${JSON.stringify(value)};`
        )
        .join("")
    );
  } catch (err) {
    const newError = new Error("Failed to write site metadata", {
      cause: err,
    });
    logger.error(newError.message, { err });
    throw newError;
  }

  trace("Finished writing site metadata");
}

async function formatOutput() {
  const logger = getMethodLogger("formatOutput", baseLogger);
  const trace = getTracer(logger);

  trace("Formatting generated files");
  await new Promise((res, rej) => {
    const task = exec("npx next lint --dir data --fix");
    task.on("error", rej);
    task.on("close", res);
  });

  trace("Finished formatting generated files");
}

async function run() {
  const logger = getMethodLogger("run", baseLogger);
  const trace = getTracer(logger);

  logger.info("Generating output");
  trace("Creating output directories");
  await Promise.all([
    mkdir(DATA_FLAGS, { recursive: true }),
    mkdir(DATA_CATEGORIES, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FLAGS, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FAVICONS, { recursive: true }),
  ]);

  logger.info("Running generation tasks");
  trace("Starting tasks. Prepare for log spam");
  try {
    await Promise.all([
      runFlagTasks(),
      runCategoryTasks(),
      writeSiteMetadata(),
    ]);
  } catch (err) {
    const newError = new Error("Failed to run all tasks", { cause: err });
    logger.error(newError.message, { err: newError });
    throw newError;
  }

  logger.info("Formatting generated files");
  try {
    await formatOutput();
  } catch (err) {
    const newError = new Error("Failed to format files. Check for corruption", {
      cause: err,
    });
    logger.error(newError.message);
    throw newError;
  }
  logger.info("Done");
}

process.on("unhandledRejection", (err) => {
  baseLogger.debug("Unhandled rejection", { err });
  process.exit(1);
});

run();
