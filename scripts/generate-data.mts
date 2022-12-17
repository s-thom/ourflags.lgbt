/* eslint-disable import/no-extraneous-dependencies no-console */
import matter from "gray-matter";
import { exec } from "node:child_process";
import { readdir, readFile, writeFile,mkdir } from "node:fs/promises";
import { join } from "node:path";
import { FlagMeta } from "../types/types";

// TODO: Logging and error handling in script

interface ParsedFile {
  meta: FlagMeta;
  markdown: string;
  excerpt?: string;
}

async function getMetaForFile(path: string): Promise<ParsedFile> {
  const fileContent = await readFile(path);

  const parsed = matter(fileContent, { excerpt: true });

  return {
    meta: parsed.data as any,
    excerpt: parsed.excerpt,
    markdown: parsed.content,
  };
}

async function writeFlagContentFile(file: ParsedFile, dir: string) {
  await writeFile(join(dir, `${file.meta.id}.json`), JSON.stringify(file));
}

async function writeMetaFile(files: ParsedFile[], dir: string) {
  await writeFile(
    join(dir, "meta.ts"),
    `import { FlagMeta } from "../types/types";\nconst FLAGS: FlagMeta[] = ${JSON.stringify(files.map((file) => file.meta))};\nexport default FLAGS;`
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
  const mdDir = join(process.cwd(), "content", "markdown");
  const outDir = join(process.cwd(), "data");

  const filenames = await readdir(mdDir);

  const readPromises = filenames.map((file) =>
    getMetaForFile(join(mdDir, file))
  );
  const data = await Promise.all(readPromises);

  await mkdir(outDir, { recursive:true });

  const individualWritePromises = data.map((file) =>
    writeFlagContentFile(file, outDir)
  );
  const metaWritePromise = writeMetaFile(data, outDir);

  await Promise.all([metaWritePromise, ...individualWritePromises]);

  await formatOutput();
}

run();
