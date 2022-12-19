import * as site from "../../data/site";
import { parseShareString } from "../../lib/shortcodes";

export default async function FlagsIdHead({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  return (
    <>
      <title>{`${flags.length} ${flags.length === 1 ? "flag" : "flags"} - ${
        site.name
      }`}</title>
      <link
        href={`/api/favicon.png?flags=${params.ids}&size=32`}
        rel="shortcut icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href={`/api/favicon.png?flags=${params.ids}&size=128`}
        rel="shortcut icon"
        sizes="128x128"
        type="image/png"
      />
      <link
        href={`/api/favicon.png?flags=${params.ids}&size=128`}
        rel="shortcut icon"
        sizes="192x192"
        type="image/png"
      />
    </>
  );
}
