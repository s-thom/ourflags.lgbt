// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import { OgImage } from "../../../../../../lib/components/og/OgImage";
import { OG_IMAGE_SIZES } from "../../../../../../lib/constants";
import { sizeValidator } from "../../../../../../lib/server/validation";
import { parseShareString } from "../../../../../../lib/shortcodes";

const bodyFontPromise = fetch(
  new URL(
    "@fontsource/inter/files/inter-latin-400-normal.woff",
    import.meta.url,
  ),
).then((res) => res.arrayBuffer());
const headingsFontPromise = fetch(
  new URL(
    "@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff",
    import.meta.url,
  ),
).then((res) => res.arrayBuffer());

const queryValidator = z.object({
  size: sizeValidator.refine(
    (size) =>
      !!OG_IMAGE_SIZES.find(
        (s) => s.width === size.width && s.height === size.height,
      ),
    (size) => ({
      message: `Size must be one of the allowed sizes (expected one of ${JSON.stringify(
        OG_IMAGE_SIZES,
      )}, got ${JSON.stringify(size)})`,
    }),
  ),
  style: z.string(),
  flags: z.string().transform((str) => parseShareString(str)),
});

export default async function handler(req: NextRequest) {
  // Next's edge routes don't have a req.query, so I'm faking it a bit.
  const hackyUrlMatch = req.url.match(
    /\/(?<size>[^/]+)\/(?<style>[^/]+)\/(?<flags>[^/]+)\/image.png/,
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

  return new ImageResponse(
    <OgImage flags={flags} size={size} style={style} />,
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
    },
  );
}

export const config = {
  runtime: "edge",
};
