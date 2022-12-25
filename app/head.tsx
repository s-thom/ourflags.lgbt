import * as site from "../data/site";

export default function Head() {
  return (
    <>
      <title>{site.name}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Share your pride with the world" />
      <link
        href={`/images/favicons/${site.defaultFaviconId}_32.png`}
        rel="shortcut icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href={`/images/favicons/${site.defaultFaviconId}_128.png`}
        rel="shortcut icon"
        sizes="128x128"
        type="image/png"
      />
      <link
        href={`/images/favicons/${site.defaultFaviconId}_192.png`}
        rel="shortcut icon"
        sizes="192x192"
        type="image/png"
      />
    </>
  );
}
