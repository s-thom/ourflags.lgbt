import { NextApiRequest, NextApiResponse } from "next/types";
import { getFaviconSvg } from "../../lib/flagSvg";
import { parseShareString } from "../../lib/shortcodes";
import { svgToPng } from "../../lib/svgToPng";

const ALLOWED_FAVICON_SIZES = [32, 128, 192];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const flagsQuery = req.query.flags;
  const sizeQuery = req.query.size;

  if (
    !(flagsQuery && sizeQuery) ||
    Array.isArray(flagsQuery) ||
    Array.isArray(sizeQuery)
  ) {
    res.status(400).json({ err: "Invalid parameters" });
    return;
  }

  const size = parseInt(sizeQuery, 10);
  if (!size || !ALLOWED_FAVICON_SIZES.includes(size)) {
    res.status(400).json({ err: "Invalid parameters" });
    return;
  }

  const flags = parseShareString(flagsQuery);

  const svg = getFaviconSvg(flags);
  const png = svgToPng(svg, size);
  res.status(200).send(png);
}
