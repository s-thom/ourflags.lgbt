import z from "zod";
import type {
  categoryDataValidator,
  categoryMetaValidator,
  flagDataValidator,
  flagMetaValidator,
  sizeValidator,
} from "./server/validation";

export type FlagMeta = z.infer<typeof flagMetaValidator>;

export type FlagData = z.infer<typeof flagDataValidator>;

export type CategoryMeta = z.infer<typeof categoryMetaValidator>;

export type CategoryData = z.infer<typeof categoryDataValidator>;

export type Size = z.infer<typeof sizeValidator>;
