// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FLAG_ASPECT_RATIO, FLAG_SVG_VIEWBOX_HEIGHT } from "../constants";
import { FlagMeta } from "../types";
import { range, template } from "../utils";

export const HEIGHT = FLAG_SVG_VIEWBOX_HEIGHT;
export const WIDTH = HEIGHT * FLAG_ASPECT_RATIO;

function getHeight(index: number, numStripes: number): number {
  return index * Math.floor(HEIGHT / numStripes);
}

function getRectPathData(index: number, numStripes: number) {
  // Due to some weird, the PNGs often had a pixel of dark between stripes.
  // In order to try combat this, I'm instead generating the stripes from the
  // bottom up, using larger rectangles and layering over them with each
  // smaller rectangle.
  // const start = getHeight(index, numStripes);
  const start = 0;
  const end = getHeight(index + 1, numStripes);
  return `M0,${start} L0,${end} ${WIDTH},${end} ${WIDTH},${start}z`;
}

function getEqualPaths(numStripes: number) {
  return range(numStripes, numStripes - 1, -1)
    .map(
      (i) =>
        `<path fill="{{color${i}}}" d="${getRectPathData(i, numStripes)}" />`,
    )
    .join("\n");
}

const flagEntries = range(8, 1).map((n): [number, string] => [
  n,
  getEqualPaths(n),
]);
const STRIPED_FLAG_TEMPLATES = Object.fromEntries(flagEntries);

export function getStripedFlagContent(
  stripeColors: string[],
  additionalPaths = "",
): string {
  const flagTemplate = STRIPED_FLAG_TEMPLATES[stripeColors.length];
  if (!flagTemplate) {
    throw new Error(
      `No template for flags with ${stripeColors.length} stripes`,
    );
  }

  const colorValues = Object.fromEntries(
    Object.entries(stripeColors).map(([index, value]) => [
      `color${index}`,
      value,
    ]),
  );

  const resolvedTemplate = template(flagTemplate, colorValues);

  return resolvedTemplate + additionalPaths;
}

export function getStripedFlagSvg(
  stripeColors: string[],
  additionalPaths = "",
) {
  const content = getStripedFlagContent(stripeColors, additionalPaths);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
${content}
</svg>
  `.trim();
}

export function getFaviconSvg(flags: FlagMeta[]): string {
  if (flags.length === 0) {
    throw new Error("At least one flag is needed to generate the favicon");
  }

  // Use at most three flags in favicon to prevent crowding
  const list = flags.slice(0, Math.min(flags.length, 3));

  const sectionWidth = Math.floor(HEIGHT / list.length);
  const masks = list.map((_, index, arr) => {
    // Can still use the height calculation that's usually used for the stripes, since this is now a square
    const start = getHeight(index, arr.length);

    return `
<mask id="flag${index}">
<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="black" />
<rect x="${start}" y="0" width="${sectionWidth}" height="${HEIGHT}" fill="white" />
</mask>
    `.trim();
  });

  const layers = list.map((meta, index) => {
    return `
<g mask="url(#flag${index})">
${getStripedFlagContent(
  meta.flag.stripes,
  meta.flag.additionalPathsFavicon ?? meta.flag.additionalPaths,
)}
</g>
    `.trim();
  });

  const circleMask = `
<mask id="circle">
<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="black" />
<rect x="0" y="0" width="${HEIGHT}" height="${HEIGHT}" rx="${
    HEIGHT / 6
  }" fill="white" />
</mask>
  `.trim();

  // TODO: shape

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HEIGHT} ${HEIGHT}">
${masks}
${circleMask}
<g mask="url(#circle)">
${layers}
</g>
</svg>
  `.trim();
}
