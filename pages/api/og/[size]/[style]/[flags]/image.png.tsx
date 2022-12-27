import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { ReactNode } from "react";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import { OgTitleStyle } from "../../../../../../components/og/OgTitleStyle";
import * as site from "../../../../../../data/site";
import { FLAG_ASPECT_RATIO } from "../../../../../../lib/constants";
import { getStripedFlagContent } from "../../../../../../lib/flagSvg";
import { parseShareString } from "../../../../../../lib/shortcodes";
import { sizeValidator } from "../../../../../../lib/validation";
import { FlagMeta, Size } from "../../../../../../types/types";

const NUM_COLUMNS = 5;

const bodyFontPromise = fetch(
  new URL(
    "@fontsource/inter/files/inter-latin-400-normal.woff",
    import.meta.url
  )
).then((res) => res.arrayBuffer());
const headingsFontPromise = fetch(
  new URL(
    "@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const queryValidator = z.object({
  size: sizeValidator.refine(
    (size) =>
      !!site.ogImageSizes.find(
        (s) => s.width === size.width && s.height === size.height
      ),
    (size) => ({
      message: `Size must be one of the allowed sizes (expected one of ${JSON.stringify(
        site.ogImageSizes
      )}, got ${JSON.stringify(size)})`,
    })
  ),
  style: z.string(),
  flags: z.string().transform((str) => parseShareString(str)),
});

function getTilesSvg(flags: FlagMeta[], size: Size) {
  const flagWidth = size.width / NUM_COLUMNS;
  const flagHeight = flagWidth / FLAG_ASPECT_RATIO;
  const numRows = Math.ceil(size.height / flagHeight);

  const bits = flags.map((flag) =>
    getStripedFlagContent(flag.flag.stripes, flag.flag.additionalPaths)
  );

  const groups: string[] = [];
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < NUM_COLUMNS; colIndex++) {
      // TODO: Add some variation to the indexes
      const flagIndex = (rowIndex + colIndex) % bits.length;
      const flagSvg = bits[flagIndex]!;

      const xOffset = colIndex * flagWidth;
      const yOffset = rowIndex * flagHeight;

      groups.push(
        `<g transform="translate(${xOffset} ${yOffset})">${flagSvg}</g>`
      );
    }
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${
    size.height
  }">
${groups.join("")}
</svg>
  `.trim();

  return svg;
}

export default async function handler(req: NextRequest) {
  // Next's edge routes don't have a req.query, so I'm faking it a bit.
  const hackyUrlMatch = req.url.match(
    /\/(?<size>[^/]+)\/(?<style>[^/]+)\/(?<flags>[^/]+)\/image.png/
  );

  const result = queryValidator.safeParse(hackyUrlMatch?.groups);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.log(fromZodError(result.error).message, result.error.issues);
    return new NextResponse(JSON.stringify({ err: "Invalid parameters" }), {
      status: 400,
    });
  }

  const [bodyFont, headingsFont] = await Promise.all([
    bodyFontPromise,
    headingsFontPromise,
  ]);

  const { flags, style, size } = result.data;

  let children: ReactNode;
  switch (style) {
    case "single":
    case "list":
    case "title":
    default:
      children = <OgTitleStyle />;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          position: "relative",
          fontFamily: "Body",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text */}
        <img
          src={`data:image/svg+xml,${encodeURIComponent(
            getTilesSvg(flags, size)
          )}`}
          tw="absolute top-0 left-0"
          width={size.width}
          height={size.height}
        />
        <div tw="absolute top-0 left-0 bg-black/80 w-full h-full" />
        {children}
      </div>
    ),
    {
      fonts: [
        {
          name: "Body",
          data: bodyFont,
          style: "normal",
        },
        {
          name: "Headings",
          data: headingsFont,
          style: "normal",
          weight: 400,
        },
      ],
      width: size.width,
      height: size.height,
      headers: {
        "Cache-Control": "max-age=0, s-maxage=86400",
      },
    }
  );
}

export const config = {
  runtime: "edge",
};
