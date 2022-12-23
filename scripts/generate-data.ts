/* eslint-disable import/no-extraneous-dependencies,no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import z, { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { getFaviconSvg, getStripedFlagSvg } from "../lib/flagSvg";
import { getLogger, getMethodLogger, getTracer } from "../lib/logger";
import {
  CONTENT_MARKDOWN,
  DATA,
  PUBLIC_IMAGES_FAVICONS,
  PUBLIC_IMAGES_FLAGS,
} from "../lib/paths";
import { svgToPng } from "../lib/svgToPng";
import { pmap } from "../lib/utils";
import pkg from "../package.json" assert { type: "json" };
import { FlagData, FlagMeta } from "../types/types";

const PNG_SIZES = [128, 840, 1080];
const FAVICON_SIZES = [32, 128, 192];

const colorValidator = z
  .string()
  .regex(/^#[0-9A-Za-z]{6}$/, "Colours must be specified in `#RRGGBB` format");
const metaValidator: z.ZodSchema<FlagMeta> = z.object({
  id: z
    .string()
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "IDs must only contain lowercase letters, numbers, or dashes, and must start with a letter"
    ),
  name: z.string(),
  shortcodes: z.array(
    z
      .string()
      .regex(
        /^[a-z][a-z0-9]+$/,
        "Shortcodes must be at least two lowercase alphanumeric characters, and must start with a letter"
      )
  ),
  flag: z.object({
    stripes: z.array(colorValidator),
    additionalPaths: z.string().optional(),
  }),
  background: z.object({
    light: z.array(colorValidator),
    dark: z.array(colorValidator).optional(),
  }),
});

const baseLogger = getLogger("generate-data");

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
    validated = metaValidator.parse(rawMatter.data);
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

  trace("Finished parsing flag metadata");
  return {
    meta: validated,
    excerpt: rawMatter.excerpt?.trim(),
    content: rawMatter.content.trim(),
  };
}

async function writeFlagContentFile(file: FlagData) {
  const logger = getMethodLogger("writeFlagContentFile", baseLogger);
  const trace = getTracer(logger, { flagId: file.meta.id });

  trace("Writing flag content");
  try {
    await writeFile(join(DATA, `${file.meta.id}.json`), JSON.stringify(file));
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

  const flagMap: { [key: string]: FlagMeta } = {};
  flagMetaList.forEach((flag) => {
    flagMap[flag.id] = flag;
  });

  trace("Writing flag collection");
  try {
    await writeFile(
      join(DATA, "meta.ts"),
      `import { FlagMeta } from "../types/types";\nexport const FLAGS: FlagMeta[] = ${JSON.stringify(
        flagMetaList
      )};export const FLAGS_BY_ID: { [key: string]: FlagMeta } = ${JSON.stringify(
        flagMap
      )};\n`
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

async function writeSiteMetadata() {
  const logger = getMethodLogger("writeSiteMetadata", baseLogger);
  const trace = getTracer(logger);

  const data = { name: "My Flags", version: pkg.version };

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

  logger.info("Reading markdown files");
  trace("Listing files in content directory");
  const filenames = await readdir(CONTENT_MARKDOWN);

  trace("Parsing frontmatter from Markdown files");
  const data = await pmap(filenames, (file) =>
    parseFlagMeta(join(CONTENT_MARKDOWN, file))
  );

  logger.info("Generating output");
  trace("Creating output directories");
  await Promise.all([
    mkdir(DATA, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FLAGS, { recursive: true }),
    mkdir(PUBLIC_IMAGES_FAVICONS, { recursive: true }),
  ]);

  trace("Starting tasks. Prepare for log spam");
  const individualWritePromises = data.map((file) =>
    writeFlagContentFile(file)
  );
  const imagePromises = data.map((file) => writeFlagPublicImage(file));
  const faviconPromises = data.map((file) => writeFlagFavicon(file));
  const metaWritePromise = writeFlagMetaCollection(data);
  const siteWritePromise = writeSiteMetadata();

  try {
    await Promise.all([
      metaWritePromise,
      siteWritePromise,
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
