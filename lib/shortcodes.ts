import { FLAGS } from "./data/flags/flags";
import { FlagMeta } from "./types";

export function buildShareString(flags: FlagMeta[]): string {
  // TODO: Use other entries in shortcode array based on certain conditions
  return flags.map((flag) => flag.shortcodes[0]!).join("");
}

export function parseShareString(path: string): FlagMeta[] {
  // Special cases
  switch (path) {
    case "all":
      return FLAGS;
    default:
  }

  const parts = path.match(/[A-Z][a-z0-9]+/g);
  if (!parts) {
    return [];
  }

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
