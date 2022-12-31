// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { CSSProperties, useEffect, useState } from "react";
import { useMedia } from "react-use";
import useLatest from "react-use/lib/useLatest";
import { FLAGS_BY_ID } from "../../../data/flags/flags";
import { FlagMeta } from "../../../types";
import { delay } from "../../../utils";
import { FlagFanItem } from "./FlagFanItem";

// I sincerely apologise to whoever needs to read this code.
// This includes my future self.
// I am 100% sure that some form of library code would have saved me here,
// as rolling animations yourself is bad and I definitely feel bad doing it.
// I definitely need to revisit this code later.

const ORDER_MAP = [3, 2, 4, 1, 5, 8, 6, 7, 9];
const FORCED_INITIAL_FLAG_IDS = [
  "rainbow",
  "gay-men",
  "lesbian",
  "transgender",
  "nonbinary",
];

export interface FlagFanProps {
  flags: FlagMeta[];
}

export function FlagFan({ flags }: FlagFanProps) {
  const [{ current, available }, setFlagState] = useState(() => {
    const initialFlags = FORCED_INITIAL_FLAG_IDS.map((id) => FLAGS_BY_ID[id]!);
    const initialAvailableFlags = flags.filter(
      (flag) => FORCED_INITIAL_FLAG_IDS.indexOf(flag.id) === -1
    );

    return { current: initialFlags, available: initialAvailableFlags };
  });
  const [activeIndex, setActiveIndex] = useState(1);
  const [focusIndex, setFocusIndex] = useState<number>();
  const [animIndex, setAnimIndex] = useState<number>();

  // This is being done through refs to try reduce the amount of timer creation/destruction
  const swapFlagRef = useLatest(async () => {
    // If the user is currently focused on the item that's about to change, skip it and
    // instead swap out the next one.
    let indexToSwap = activeIndex;
    if (focusIndex === indexToSwap) {
      indexToSwap = (indexToSwap + 1) % 5;
    }

    // Pick a random flag and remove it from the list of flags available to choose.
    const nextFlagIndex = Math.floor(Math.random() * available.length);
    const [nextFlag] = available.splice(nextFlagIndex, 1);

    // Start fading out the old one.
    // Yes, a proper transition library would be better.
    setAnimIndex(indexToSwap);
    await delay(300);

    // Swap in the new flag in the same position as the old one.
    const nextCurrent = current.slice();
    nextCurrent.splice(indexToSwap, 1, nextFlag!);

    setFlagState({
      current: nextCurrent,
      available:
        // If we've run out of flags to randomly choose from, start again.
        // The extra .findIndex() is to make sure we exclude the one we've
        // just swapped in, so it doesn't get shown twice this cycle.
        available.length > 0
          ? available
          : flags.filter(
              (flag) =>
                nextCurrent.findIndex(
                  (visibleFlag) => visibleFlag.id === flag.id
                ) === -1
            ),
    });
    setActiveIndex((indexToSwap + 1) % 5);

    // Wait a bit of time so the image has a little chance to load,
    // before allowing the flag to slide in.
    await delay(200);
    setAnimIndex(undefined);
  });

  const prefersReducedMotion = useMedia("(prefers-reduced-motion)", false);
  useEffect(() => {
    // Disable the effect if the use has indicated they don't want motion.
    if (prefersReducedMotion) {
      return () => {};
    }

    function onInterval() {
      swapFlagRef.current();
    }

    const handle = setInterval(onInterval, 3000);
    return () => clearInterval(handle);
  }, [prefersReducedMotion, swapFlagRef]);

  return (
    <div className="relative flex pt-8">
      {current.map((flag, index) => {
        const indexFromCentre = ORDER_MAP[index]! - 3;

        return (
          <div
            key={flag.id}
            // Quick explanation here. The `flag-fan-item` class is defined in `globals.css` and
            // Does some maths to build a `transform` value. All of the square brackets here are
            // to put different values in those variables at different breakpoints.
            className="flag-fan-item transition duration-300 [--flagXOffset:-12px] [--flagYOffset:16px] sm:[--flagYOffset:16px] sm:[--flagXOffset:-24px] md:[--flagYOffset:20px] md:[--flagXOffset:-48px] lg:[--flagYOffset:24px] lg:[--flagXOffset:-64px]"
            style={
              {
                order: ORDER_MAP[index],
                zIndex: current.length - index,
                opacity: animIndex === index ? 0 : 1,
                // Variables for the transform
                "--flagRelativeIndex": indexFromCentre,
                "--flagAbsoluteIndex": Math.abs(indexFromCentre),
                "--flagYSlideDown": animIndex === index ? 1 : 0,
              } as CSSProperties
            }
          >
            <FlagFanItem
              flag={flag}
              onFocusIn={() => setFocusIndex(index)}
              onFocusOut={() => setFocusIndex(undefined)}
            />
          </div>
        );
      })}
    </div>
  );
}
