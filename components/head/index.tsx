import { NextSeo } from "next-seo";
import * as site from "../../data/site";
import { buildShareString } from "../../lib/shortcodes";
import { FlagMeta } from "../../types/types";

function getFaviconUrl(size: number, flags: FlagMeta[], override?: string) {
  switch (flags.length) {
    case 0:
      // Default URL, will 404
      return `/images/favicons/${site.defaultFaviconId}_${size}.png`;
    case 1:
      // Can use the plain URL to avoid function invocations
      return `/images/favicons/${flags[0]!.id}_${size}.png`;
    default:
      // Need to use the API route
      return `/api/favicon/${size}x${size}/${
        override ?? buildShareString(flags)
      }/icon.png`;
  }
}

export interface HeadTagsProps {
  title?: string;
  description?: string;
  path: string;
  flags: FlagMeta[];
  overrideFaviconFlags?: "default";
}

export function HeadTags({
  title,
  description,
  path,
  flags,
  overrideFaviconFlags,
}: HeadTagsProps) {
  const canonicalUrl = new URL(path, site.baseUrl).toString();

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {site.faviconSizes.map((size) => (
        <link
          key={size}
          href={getFaviconUrl(size, flags, overrideFaviconFlags)}
          rel="shortcut icon"
          sizes={`${size}x${size}`}
          type="image/png"
        />
      ))}
      <NextSeo
        useAppDir
        title={title}
        titleTemplate={`%s - ${site.name}`}
        defaultTitle={site.name}
        description={description}
        canonical={canonicalUrl}
        themeColor="#976eaa"
        openGraph={{
          type: "website",
          title: title ? `${title} - ${site.name}` : site.name,
          url: canonicalUrl,
          siteName: site.name,
          locale: "en_US",
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
    </>
  );
}
