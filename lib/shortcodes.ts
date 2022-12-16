import FLAGS from "../data/flags";
import { FlagMeta } from "../types/types";

export function buildShareString(flags: FlagMeta[]): string {
  // TODO: Use other entries in shortcode array based on certain conditions
  return flags.map((flag) => flag.shortcodes[0]!).join("");
}

export function parseShareString(path: string): FlagMeta[] {
  const parts = path.match(/^.{2}/g);
  if (!parts) {
    return [];
  }
  parts.shift();

  const flagsByShortcode = new Map<string, FlagMeta>();
  FLAGS.forEach((flag) => {
    flag.shortcodes.forEach((code) => flagsByShortcode.set(code, flag));
  });

  const flags: FlagMeta[] = [];
  for (const code of parts) {
    const flag = flagsByShortcode.get(code);
    if (!flag || flags.includes(flag)) {
      continue;
    }

    flags.push(flag);
  }

  return flags;
}
