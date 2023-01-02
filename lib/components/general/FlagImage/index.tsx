// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Image, { ImageProps } from "next/image";
import { FLAG_ASPECT_RATIO, PNG_SIZES } from "../../../constants";
import { FlagMeta } from "../../../types";

function getNextSize(height: number) {
  return (
    PNG_SIZES.find((size) => size >= height) ?? PNG_SIZES[PNG_SIZES.length - 1]
  );
}

export interface FlagImageProps extends Omit<ImageProps, "src" | "width"> {
  flag: FlagMeta;
  height: number;
  alt: string;
  pictureClassName?: string;
}

export function FlagImage({
  flag,
  height,
  alt,
  className,
  pictureClassName,
  ...rest
}: FlagImageProps) {
  return (
    <picture className={pictureClassName}>
      <source srcSet={`/images/flags/${flag.id}_${getNextSize(height)}.webp`} />
      <Image
        src={`/images/flags/${flag.id}_${getNextSize(height)}.png`}
        alt={alt}
        height={height}
        width={height * FLAG_ASPECT_RATIO}
        className={className}
        {...rest}
      />
    </picture>
  );
}
