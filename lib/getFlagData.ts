import { readFile } from "fs/promises";
import { join } from "path";
import { FlagData } from "../types/types";
import { DATA } from "./paths";

export async function getFlagData(id: string): Promise<FlagData> {
  const filePath = join(DATA, `${id}.json`);
  const content = await readFile(filePath, "utf8");
  const data: FlagData = JSON.parse(content);
  return data;
}
