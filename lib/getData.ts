import { readFile } from "fs/promises";
import { join } from "path";
import { cache } from "react";
import { FlagData } from "../types/types";
import { DATA_CATEGORIES, DATA_FLAGS } from "./paths";

export const getFlagData = cache(async function getFlagData(
  id: string
): Promise<FlagData> {
  const filePath = join(DATA_FLAGS, `${id}.json`);
  const content = await readFile(filePath, "utf8");
  const data: FlagData = JSON.parse(content);
  return data;
});

export const getCategoryData = cache(async function getCategoryData(
  id: string
): Promise<FlagData> {
  const filePath = join(DATA_CATEGORIES, `${id}.json`);
  const content = await readFile(filePath, "utf8");
  const data: FlagData = JSON.parse(content);
  return data;
});
