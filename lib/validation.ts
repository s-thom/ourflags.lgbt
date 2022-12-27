import { formatHex, Oklch, parse } from "culori";
import z from "zod";

export const colorValidator = z.string().transform((color) => {
  // Culori doesn't support a parser for OKLch, so I've hacked this together a bit
  const doOklchHack = color.startsWith("oklch(");

  const parsed = parse(doOklchHack ? color.slice(2) : color);
  if (!parsed) {
    throw new Error(`Invalid color: ${color}`);
  }

  if (doOklchHack) {
    parsed.mode = "oklch";
    // For some reason the % sign is ignored if specified that way.
    // I'm too tired to do anything other than hack it together again.
    if (color.match(/\([0-9.]+%/)) {
      (parsed as Oklch).l /= 100;
    }
  }

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
  order: z.number(),
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
  order: z.number(),
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
