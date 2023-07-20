// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Image, { ImageProps } from "next/image";
import {
  FLAG_ASPECT_RATIO,
  FLAG_IMAGE_SCALES,
  FLAG_IMAGE_SIZES,
} from "../../../constants";
import { FlagMeta } from "../../../types";

function getNextBaseSize(height: number) {
  return (
    FLAG_IMAGE_SIZES.find((size) => size >= height) ??
    FLAG_IMAGE_SIZES[FLAG_IMAGE_SIZES.length - 1]!
  );
}

function getSrcSet(id: string, baseSize: number, extension: string) {
  return FLAG_IMAGE_SCALES.map(
    (scale) => `/images/flags/${id}_${baseSize * scale}.${extension} ${scale}x`,
  ).join(", ");
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
  const baseSize = getNextBaseSize(height);

  return (
    <picture className={pictureClassName}>
      <source srcSet={getSrcSet(flag.id, baseSize, "webp")} />
      <source srcSet={getSrcSet(flag.id, baseSize, "png")} />
      <Image
        src={`/images/flags/${flag.id}_${baseSize}.png`}
        alt={alt}
        height={height}
        width={height * FLAG_ASPECT_RATIO}
        className={className}
        {...rest}
      />
    </picture>
  );
}
