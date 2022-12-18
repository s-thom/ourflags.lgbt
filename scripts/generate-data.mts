/* eslint-disable import/no-extraneous-dependencies no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import pkg from "../package.json" assert { type: "json" };
import { FlagData } from "../types/types";

// TODO: Logging and error handling in script

// TODO: Figure out how to make ts-node happy with importing from lib/paths
const CONTENT_MARKDOWN = join(process.cwd(), 'content','markdown')
const DATA = join(process.cwd(), 'data')

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

async function formatOutput() {
  return new Promise((res, rej) => {
    const task = exec("npx next lint --dir data --fix");
    task.on("error", rej);
    task.on("close", res);
  });
}

async function run() {
  const filenames = await readdir(CONTENT_MARKDOWN);

  const readPromises = filenames.map((file) =>
    getMetaForFile(join(CONTENT_MARKDOWN, file))
  );
  const data = await Promise.all(readPromises);

  await mkdir(DATA, { recursive: true });

  const individualWritePromises = data.map((file) =>
    writeFlagContentFile(file)
  );
  const metaWritePromise = writeMetaFile(data);
  const siteWritePromise = writeSiteFile();

  await Promise.all([
    metaWritePromise,
    siteWritePromise,
    ...individualWritePromises,
  ]);

  await formatOutput();
}

run();
