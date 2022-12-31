// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FLAG_ASPECT_RATIO } from "../../constants";
import { getStripedFlagSvg } from "../../server/flagSvg";
import { FlagMeta, Size } from "../../types";

// TODO: Figure out how to derive from OG image size
const IMAGE_HEIGHT = 250;

export interface OgSingleStyleProps {
  flag: FlagMeta;
  size: Size;
}

export function OgSingleStyle({ flag }: OgSingleStyleProps) {
  return (
    <div tw="flex flex-col text-white items-center text-center h-full w-full">
      <h1 tw="flex justify-center items-baseline w-full pb-8">
        <span tw="font-bold text-8xl" style={{ fontFamily: "Headings" }}>
          {flag.name}
        </span>
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text */}
      <img
        src={`data:image/svg+xml,${encodeURIComponent(
          getStripedFlagSvg(flag.flag.stripes, flag.flag.additionalPaths)
        )}`}
        tw="shadow-xl"
        width={IMAGE_HEIGHT * FLAG_ASPECT_RATIO}
        height={IMAGE_HEIGHT}
      />
    </div>
  );
}
