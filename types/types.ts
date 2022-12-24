import z from "zod";
import type { flagDataValidator, flagMetaValidator } from "../lib/validation";

export type FlagMeta = z.infer<typeof flagMetaValidator>;

export type FlagData = z.infer<typeof flagDataValidator>;
