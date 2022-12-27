import { NextSeo } from "next-seo";
import * as site from "../../data/site";
import { buildShareString } from "../../lib/shortcodes";
import { FlagMeta, Size } from "../../types/types";

function getFaviconUrl(size: number, flags: FlagMeta[], override?: string) {
  // For the trivial cases, we can use the favicon images generated at build time.
  // Honestly, I expect most of them to remain unused. I don't think there'll be
  // many people who choose just a single flag from the list.

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

function getOgUrl(
  size: Size,
  style: string,
  flags: FlagMeta[],
  override?: string
) {
  return `/api/og/${size.width}x${size.height}/${style}/${
    override ?? buildShareString(flags)
  }/image.png`;
}

export interface HeadTagsProps {
  title?: string;
  description?: string;
  path: string;
  flags: FlagMeta[];
  overrideFaviconFlags?: "default";
  overrideOgFlags?: "all";
  ogImageStyle?: string;
}

export function HeadTags({
  title,
  description,
  path,
  flags,
  overrideFaviconFlags,
  overrideOgFlags,
  ogImageStyle,
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
          images: ogImageStyle
            ? site.ogImageSizes.map((size) => {
                const url = new URL(
                  getOgUrl(size, ogImageStyle, flags, overrideOgFlags),
                  site.baseUrl
                ).toString();
                return {
                  url,
                  width: size.width,
                  height: size.height,
                  alt: title ? `${title} - ${site.name}` : site.name,
                  type: "image/png",
                  secureUrl: url,
                };
              })
            : undefined,
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
    </>
  );
}
