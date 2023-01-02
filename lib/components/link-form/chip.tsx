// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, forwardRef, ReactNode } from "react";
import { FLAG_ASPECT_RATIO } from "../../constants";
import { FlagMeta } from "../../types";
import { GradientBackground } from "../client/RainbowBackground";

export interface FlagFormChipProps {
  flag: FlagMeta;
  className?: string;
  style?: CSSProperties;
  before?: ReactNode;
  after?: ReactNode;
  onFlagClick?: () => void;
}

export const FlagFormChip = forwardRef<HTMLDivElement, FlagFormChipProps>(
  function FlagFormChip(
    { flag, className, style, before, after, onFlagClick },
    ref
  ) {
    const image = (
      <Image
        src={`/images/flags/${flag.id}_24.png`}
        alt={flag.name}
        title={flag.name}
        height={24}
        width={24 * FLAG_ASPECT_RATIO}
        className="rounded"
      />
    );
    let imageButton: ReactNode;
    if (onFlagClick) {
      imageButton = <button onClick={onFlagClick}>{image}</button>;
    } else {
      imageButton = image;
    }

    return (
      <GradientBackground
        className={clsx(
          className,
          "inline-flex items-center gap-3 rounded-lg border border-neutral-500 p-3 dark:border-neutral-200 md:gap-3 md:p-2"
        )}
        colors={flag.background}
        style={style}
        ref={ref}
      >
        {before}
        <div className={clsx("inline-flex grow items-center gap-2")}>
          {imageButton}
          <Link
            title={flag.name}
            href={`/flags/${flag.id}`}
            className="custom-link"
          >
            {flag.shortName ?? flag.name}
          </Link>
        </div>
        {after}
      </GradientBackground>
    );
  }
);
