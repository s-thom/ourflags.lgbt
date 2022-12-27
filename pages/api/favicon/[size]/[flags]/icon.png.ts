import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import * as site from "../../../../../data/site";
import { getFaviconSvg } from "../../../../../lib/flagSvg";
import { getLogger } from "../../../../../lib/logger";
import { parseShareString } from "../../../../../lib/shortcodes";
import { svgToPng } from "../../../../../lib/svgToPng";
import { sizeValidator } from "../../../../../lib/validation";

const queryValidator = z.object({
  size: sizeValidator
    .refine((size) => size.width === size.height, {
      message: "Size must be square",
    })
    .refine(
      (size) => site.faviconSizes.includes(size.width),
      (size) => ({
        message: `Size must be one of the allowed sizes (expected one of ${JSON.stringify(
          site.faviconSizes
        )}, got ${size.width})`,
      })
    ),
  flags: z.string().transform((str) => parseShareString(str)),
});

const logger = getLogger("favicon");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = queryValidator.safeParse(req.query);
  if (!result.success) {
    logger.error(fromZodError(result.error).message);
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
