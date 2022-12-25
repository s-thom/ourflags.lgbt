import z from "zod";

const colorValidator = z
  .string()
  .regex(/^#[0-9A-Za-z]{6}$/, "Colours must be specified in `#RRGGBB` format");

export const flagMetaValidator = z.object({
  id: z
    .string()
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "IDs must only contain lowercase letters, numbers, or dashes, and must start with a letter"
    ),
  name: z.string(),
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
