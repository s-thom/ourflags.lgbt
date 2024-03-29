// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { readFile } from "fs/promises";
import { join } from "path";
import { cache } from "react";
import { FlagData } from "../types";
import { DATA_CATEGORIES, DATA_FLAGS } from "./paths";

export const getFlagData = cache(async function getFlagData(
  id: string,
): Promise<FlagData> {
  const filePath = join(DATA_FLAGS, `${id}.json`);
  const content = await readFile(filePath, "utf8");
  const data: FlagData = JSON.parse(content);
  return data;
});

export const getCategoryData = cache(async function getCategoryData(
  id: string,
): Promise<FlagData> {
  const filePath = join(DATA_CATEGORIES, `${id}.json`);
  const content = await readFile(filePath, "utf8");
  const data: FlagData = JSON.parse(content);
  return data;
});
