// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLatest, useMedia } from "react-use";
import { FLAG_ASPECT_RATIO, SITE_NAME } from "../../../constants";
import { FLAGS_BY_ID } from "../../../data/flags/flags";
import { FlagMeta } from "../../../types";
import { pickRandomOutOfArray } from "../../../utils";
import { MajorHeading } from "../../layout/Headings";

const INITIAL_ICON_ID = "progress-intersex";

export interface SiteNameProps {
  flags: FlagMeta[];
}

export function SiteName({ flags }: SiteNameProps) {
  const [{ current, next, available }, setFlagState] = useState(() => {
    const initialFlag = FLAGS_BY_ID[INITIAL_ICON_ID]!;
    // Remove flags that are currently visible
    const flagsNotVisible = flags.filter((flag) => flag.id !== initialFlag.id);

    const { array: initialAvailable, item: initialNext } =
      pickRandomOutOfArray(flagsNotVisible);

    return {
      current: initialFlag,
      available: initialAvailable,
      next: initialNext,
    };
  });

  const swapFlagRef = useLatest(async () => {
    // Pick a random flag and remove it from the list of flags available to choose.
    const { array: nextAvailable, item: nextNext } =
      pickRandomOutOfArray(available);

    setFlagState({
      current: next,
      available:
        // If we've run out of flags to randomly choose from, start again.
        nextAvailable.length > 0
          ? nextAvailable
          : flags.filter(
              (flag) => flag.id !== next.id && flag.id !== nextNext.id
            ),
      next: nextNext,
    });
  });

  const prefersReducedMotion = useMedia("(prefers-reduced-motion)", false);
  const onHover = useCallback(() => {
    if (!prefersReducedMotion) {
      swapFlagRef.current();
    }
  }, [prefersReducedMotion, swapFlagRef]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <Link
      className="group/sitename flex items-center gap-4"
      href={"/"}
      onMouseEnter={onHover}
    >
      <Image
        src={`/images/flags/${current.id}_64.png`}
        alt=""
        width={64 * FLAG_ASPECT_RATIO}
        height={64}
        className="aspect-[3/2] h-6 w-9 rounded transition-transform group-focus-within/sitename:scale-105 group-hover/sitename:scale-105 sm:h-8 sm:w-12"
      />
      {isMounted && (
        <Image
          src={`/images/flags/${next.id}_64.png`}
          alt=""
          width={64 * FLAG_ASPECT_RATIO}
          height={64}
          aria-hidden
          className="hidden"
          priority={false}
        />
      )}
      <MajorHeading className="underline decoration-dotted hover:decoration-solid focus:decoration-solid">
        {SITE_NAME}
      </MajorHeading>
    </Link>
  );
}
