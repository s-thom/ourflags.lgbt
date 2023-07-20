// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FLAG_ASPECT_RATIO, FLAG_SVG_VIEWBOX_HEIGHT } from "../../constants";
import { getStripedFlagContent } from "../../server/flagSvg";
import { FlagMeta, Size } from "../../types";

// This component generates the tiled flag background.
// A fixed grid would be too simple, you see, so I have to do
// some loopy (pun absolutely intended) code.
// The goal is to have flags overlap slightly, but not have
// any weird gaps or layering artifacts.
// Flags are organised in diagonal lines, overlapping with flags
// in their line, as well as the line below them.

// Amount to scale flags by relative to the size of the image.
// If the background was a tabular grid, then you would fit
// `1 / <this value>` flags horizontally.
const flagScale = 0.2;

// The amount of the flag that will overlap with the next
// flag in its line. Values over 0.5 will cause overlapping
// serious overlapping with other lines, and will decrease
// the amount of flag actually visible.
const overlapFlagProportionX = 1 / 5;
const overlapLineProportionY = 1 / 5;

// The amount to move the origin point of each line of flags
const lineShiftProportionX = 1 / 1;
const lineShiftProportionY = -2 / 13;

function getTilesSvg(flags: FlagMeta[], size: Size) {
  const flagWidth = size.width * flagScale;
  const flagHeight = flagWidth / FLAG_ASPECT_RATIO;
  const scaleFactor = flagHeight / FLAG_SVG_VIEWBOX_HEIGHT;

  // Amount to move by when advancing by a single flag.
  const shiftX = flagWidth * (1 - overlapFlagProportionX);
  const shiftY = flagHeight * (1 - overlapLineProportionY);

  // Amount to move when advancing to the next diagonal line of flags.
  const shiftColX = flagWidth * lineShiftProportionX;
  const shiftColY = flagHeight * lineShiftProportionY;

  const flagPaths = flags.map((flag) =>
    getStripedFlagContent(flag.flag.stripes, flag.flag.additionalPaths),
  );

  const paths: string[] = [];
  let currentLine: string[] = [];

  // Origin point for the first flag in this line
  let lineStartX = 0;
  let lineStartY = 0;
  // Origin point for the current inner loop
  let currentX = lineStartX;
  let currentY = lineStartY;

  // Index of the current flag in the `flags` array.
  let flagIndex = 0;

  function addFlagToCurrentLine() {
    const flagSvg = flagPaths[flagIndex]!;
    const group = `<g transform="translate(${currentX} ${currentY}) scale(${scaleFactor})">${flagSvg}</g>`;

    // Unshifting so later paths appear under ones added earlier
    currentLine.unshift(group);
  }
  function advanceFlag() {
    currentX += shiftX;
    currentY += shiftY;
    flagIndex = (flagIndex + 1) % flags.length;
  }
  function advanceLine(numLines: number) {
    lineStartX += shiftColX * numLines;
    lineStartY += shiftColY * numLines;

    // If these conditions are met, then the flag would not be visible.
    // Go forward a single flag to try get back in bounds.
    if (lineStartX <= -flagWidth || lineStartY <= -flagHeight) {
      advanceFlag();
    }
  }

  // Main diagonal
  // This is being calculated first so that the top left flag is the first in the list of flags
  const mainDiagonalPaths: string[] = [];
  while (currentX < size.width && currentY < size.height) {
    const flagSvg = flagPaths[flagIndex]!;
    const group = `<g transform="translate(${currentX} ${currentY}) scale(${scaleFactor})">${flagSvg}</g>`;

    mainDiagonalPaths.push(group);
    advanceFlag();
  }

  // Top left corner, starting from the left
  lineStartX = 0;
  lineStartY = 0;
  advanceLine(1);
  while (lineStartX < size.width && lineStartY < size.height) {
    currentX = lineStartX;
    currentY = lineStartY;

    while (currentX < size.width && currentY < size.height) {
      addFlagToCurrentLine();
      advanceFlag();
    }

    // Prepare for next iteration
    // Note: Unshifting as each line should appear under each later one
    paths.unshift(...currentLine);
    currentLine = [];
    advanceLine(1);
  }

  // Add in the main diagonal paths, now that they'd be in the correct location
  paths.push(...mainDiagonalPaths);

  // Bottom right corner, starting from the left
  lineStartX = 0;
  lineStartY = 0;
  advanceLine(-1);
  // eslint-disable-next-line no-unreachable-loop
  while (lineStartX < size.width && lineStartY < size.height) {
    currentX = lineStartX;
    currentY = lineStartY;

    while (currentX < size.width && currentY < size.height) {
      addFlagToCurrentLine();
      advanceFlag();
    }

    // Prepare for next iteration
    paths.push(...currentLine);
    currentLine = [];
    advanceLine(-1);
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${
    size.height
  }">
${paths.join("")}
</svg>
  `.trim();

  return svg;
}

interface TiledBackgroundProps {
  flags: FlagMeta[];
  size: Size;
}

export function TiledBackground({ flags, size }: TiledBackgroundProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text */
    <img
      src={`data:image/svg+xml,${encodeURIComponent(getTilesSvg(flags, size))}`}
      tw="absolute top-0 left-0"
      width={size.width}
      height={size.height}
    />
  );
}
