// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Color, formatHex, Oklch, oklch, parse } from "culori";
import { CSSProperties, useMemo } from "react";

const MAX_ANGLE_PER_STOP = 30;

export function parseColor(color: string): Color {
  const parsed = parse(color);
  if (!parsed) {
    throw new Error(`Invalid color: ${color}`);
  }

  return parsed;
}

function getGradientStops(colors: string[]): string {
  if (colors.length === 0) {
    return "transparent, transparent";
  }
  if (colors.length === 1) {
    return `${colors[0]!}, ${colors[0]!}`;
  }

  // CSS gradients are applied linearly through the RGB colour space.
  // This leads to some unsavoury gradients, especially when they go across the
  // colour spectrum, where they might cross greys or other muddy colours.
  // The rough idea here is that we want to add more stops to make the gradient smoother.
  const percentPerOriginalStop = Math.floor(100 / (colors.length - 1));
  const moreColors: string[] = [colors[0]!];
  // Loop starts at 1, not 0, because we're looking at pairs of colours
  for (let i = 1; i < colors.length; i++) {
    const firstColor = oklch(colors[i - 1]);
    const secondColor = oklch(colors[i]);

    const firstPercent = (i - 1) * percentPerOriginalStop;
    const secondPercent = i * percentPerOriginalStop;

    if (!(firstColor && secondColor)) {
      throw new Error(
        `Invalid colours (one of ${colors[i - 1]}, ${colors[i]})`
      );
    }

    const isFirstGrey = firstColor?.h === undefined || firstColor.c === 0;
    const isSecondGrey = secondColor?.h === undefined || secondColor.c === 0;

    // If both stops are the same hue, or if one of them has no hue (or chroma, for that matter),
    // then no stops need to be added. In this case we let CSS take over and give us
    // something that looks good enough.
    if (firstColor.h === secondColor.h || isFirstGrey || isSecondGrey) {
      moreColors.push(`${formatHex(secondColor)} ${secondPercent}%`);
      continue;
    }

    // Note that because of the check above, both colours must have hue and chroma.
    const lightDifference = secondColor.l - firstColor.l;
    const chromaDifference = secondColor.c - firstColor.c;

    // The hue difference is a bit weird due to hue being a circle.
    // We want the gradient to take the shortest path, so we need
    // the hue difference to be within the range -180 to 180.
    // Behaviour when the hues are exactly opposite is not really defined.
    // You could pick a direction to go around the circle, or take a shortcut through grey.
    // This implementation chooses a direction, probably the negative direction.
    const rawHueDifference = secondColor.h! - firstColor.h!;
    const hueDifference = ((rawHueDifference + 360 + 180) % 360) - 180;

    // Must be greater than 0, since equal hues get caught earlier.
    const numStops = Math.ceil(Math.abs(hueDifference) / MAX_ANGLE_PER_STOP);

    const lightPerNewStop = lightDifference / numStops;
    const chromaPerNewStop = chromaDifference / numStops;
    const huePerNewStop = hueDifference / numStops;
    const percentPerNewStop = Math.floor(percentPerOriginalStop / numStops);

    // 1-indexed to get the correct percentages for the intermediate stops
    for (let j = 1; j <= numStops - 1; j++) {
      const newLight = firstColor.l + j * lightPerNewStop;
      const newChroma = firstColor.c + j * chromaPerNewStop;
      const newHue = (firstColor.h! + j * huePerNewStop + 360) % 360;
      const stopPercentage = firstPercent + j * percentPerNewStop;

      const newStop: Oklch = {
        mode: "oklch",
        l: newLight,
        c: newChroma,
        h: newHue,
      };
      moreColors.push(`${formatHex(newStop)} ${stopPercentage}%`);
    }

    // Add the proper last stop in
    moreColors.push(`${formatHex(secondColor)} ${secondPercent}%`);
  }

  return moreColors.join(", ");
}

/**
 * Server components only
 */
export function getThemedGradients(themes: {
  light: string[];
  dark?: string[];
}) {
  const style = {
    "--gradient-light": getGradientStops(themes.light),
    "--gradient-dark": getGradientStops(themes.dark ?? themes.light),
  } as CSSProperties;

  return style;
}

/**
 * Client components only
 */
export function useGradientStops(themes: { light: string[]; dark?: string[] }) {
  return useMemo(() => {
    const style = getThemedGradients(themes);

    return {
      style,
    };
  }, [themes]);
}
