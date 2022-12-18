import * as site from "../../../data/site";
import { parseShareString } from "../../../lib/shortcodes";

export default async function FlagsIdHead({
  params,
}: {
  params: { ids: string };
}) {
  if (!params.ids) {
    throw new Error("wtf");
  }
  const flags = parseShareString(params.ids ?? "");

  return (
    <>
      <title>{`${flags.length} ${flags.length === 1 ? "flag" : "flags"} - ${
        site.name
      }`}</title>
    </>
  );
}
