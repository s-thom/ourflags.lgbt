import * as site from "../../data/site";
import { buildShareString } from "../../lib/shortcodes";
import { FlagMeta } from "../../types/types";

function getFaviconUrl(flags: FlagMeta[], size: number) {
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

export interface FaviconsProps {
  flags: FlagMeta[];
}

export function Favicons({ flags }: FaviconsProps) {
  return (
    <>
      {site.faviconSizes.map((size) => (
        <link
          key={size}
          href={getFaviconUrl(flags, size)}
          rel="shortcut icon"
          sizes={`${size}x${size}`}
          type="image/png"
        />
      ))}
    </>
  );
}
