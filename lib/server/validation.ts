// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { formatHex } from "culori";
import z from "zod";
import { parseColor } from "../colors";

// Adding fields to these validators automatically updates the types throughout the code,
// so you'll get errors if the code isn't compatible with your change.
// You will need to update all of the Markdown files yourself, as well as
// the template snippets in the `.vscode` folder.

export const colorValidator = z.string().transform((color) => {
  const parsed = parseColor(color);

  const formatted = formatHex(parsed);
  if (!formatted) {
    throw new Error(`Invalid color: ${color}`);
  }
  return formatted;
});

export const flagMetaValidator = z.object({
  id: z
    .string()
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "IDs must only contain lowercase letters, numbers, or dashes, and must start with a letter"
    ),
  name: z.string(),
  shortName: z.string().optional(),
  order: z.number().optional(),
  shortcodes: z
    .array(
      z
        .string()
        .regex(
          /^[A-Z][a-z0-9]+$/,
          "Shortcodes must start with a capital letter, and then have at least one more lowercase alphanumeric character"
        )
    )
    .min(1),
  flag: z.object({
    stripes: z.array(colorValidator).min(1),
    additionalPaths: z.string().optional(),
    additionalPathsFavicon: z.string().optional(),
  }),
  categories: z.array(z.string()).default([]),
  background: z.object({
    light: z.array(colorValidator).min(1),
    dark: z.array(colorValidator).min(1).optional(),
  }),
});

export const flagDataValidator = z.object({
  meta: flagMetaValidator,
  content: z.string(),
  excerpt: z.string().optional(),
});

export const categoryMetaValidator = z.object({
  id: z
    .string()
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "IDs must only contain lowercase letters, numbers, or dashes, and must start with a letter"
    ),
  name: z.string(),
  order: z.number().optional(),
  background: z.object({
    light: z.array(colorValidator).min(1),
    dark: z.array(colorValidator).min(1).optional(),
  }),
});

export const categoryDataValidator = z.object({
  meta: categoryMetaValidator,
  content: z.string(),
  excerpt: z.string().optional(),
});

export const sizeValidator = z
  .string()
  .regex(/^\d+x\d+$/)
  .transform((str) => {
    const [, w, h] = /^(\d+)x(\d+)$/.exec(str)!;

    return {
      width: parseInt(w!, 10),
      height: parseInt(h!, 10),
    };
  });
