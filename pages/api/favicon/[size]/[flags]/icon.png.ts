import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import { FAVICON_SIZES } from "../../../../../lib/constants";
import { getFaviconSvg } from "../../../../../lib/flagSvg";
import { parseShareString } from "../../../../../lib/shortcodes";
import { svgToPng } from "../../../../../lib/svgToPng";
import { sizeValidator } from "../../../../../lib/validation";

const queryValidator = z.object({
  size: sizeValidator
    .refine((size) => size.width === size.height, {
      message: "Size must be square",
    })
    .refine(
      (size) => FAVICON_SIZES.includes(size.width),
      (size) => ({
        message: `Size must be one of the allowed sizes (expected one of ${JSON.stringify(
          FAVICON_SIZES
        )}, got ${size.width})`,
      })
    ),
  flags: z.string().transform((str) => parseShareString(str)),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = queryValidator.safeParse(req.query);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(fromZodError(result.error).message);
    return new NextResponse(JSON.stringify({ err: "Invalid parameters" }), {
      status: 400,
    });
  }

  const { flags, size } = result.data;

  const svg = getFaviconSvg(flags);
  const png = svgToPng(svg, size.width);

  return res
    .status(200)
    .setHeader("Content-Type", "image/png")
    .setHeader("Cache-Control", "max-age=0, s-maxage=86400")
    .send(png);
}
