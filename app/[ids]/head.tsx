import * as site from "../../data/site";
import { buildShareString, parseShareString } from "../../lib/shortcodes";
import { FlagMeta } from "../../types/types";

function getFaviconUrl(flags: FlagMeta[], size: string) {
  switch (flags.length) {
    case 0:
      // Default URL, will 404
      return `/images/favicons/${site.defaultFaviconId}_${size}.png`;
    case 1:
      // Can use the plain URL to avoid function invocations
      return `/images/favicons/${flags[0]!.id}_${size}.png`;
    default:
      // Need to use the API route
      return `/api/favicon.png?flags=${buildShareString(flags)}&size=${size}`;
  }
}

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
        href={getFaviconUrl(flags, "32")}
        rel="shortcut icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href={getFaviconUrl(flags, "128")}
        rel="shortcut icon"
        sizes="128x128"
        type="image/png"
      />
      <link
        href={getFaviconUrl(flags, "192")}
        rel="shortcut icon"
        sizes="192x192"
        type="image/png"
      />
    </>
  );
}
