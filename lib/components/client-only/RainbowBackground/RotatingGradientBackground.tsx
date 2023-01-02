// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { converter, formatHex } from "culori";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useMedia } from "react-use";
import { getThemedGradients, parseColor } from "../../../colors";
import { GradientBackground } from "./GradientBackground";

const oklch = converter("oklch");

const FULL_CIRCLE = 360;

export interface RotatingGradientBackgroundProps extends PropsWithChildren {
  className?: string;
  /**
   * Note: colours must be valid CSS colours at this point.
   */
  initialColors: { light: string[]; dark: string[] };
  period: number;
}

export function RotatingGradientBackground({
  initialColors,
  className,
  period,
  children,
}: RotatingGradientBackgroundProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  // Not actually a ref, but may as well could be.
  // The reason this doesn't use `useRef` is because of the initialiser.
  const [colorsRef] = useState(() => ({
    light: initialColors.light.map((color) => oklch(parseColor(color))),
    dark: initialColors.dark.map((color) => oklch(parseColor(color))),
  }));

  const prefersReducedMotion = useMedia("(prefers-reduced-motion)", true);
  useEffect(() => {
    // Disable the effect if the use has indicated they don't want motion.
    if (prefersReducedMotion) {
      return () => {};
    }

    let lastTime = Date.now();
    let raf: number;
    function onInterval() {
      const now = Date.now();
      if (elementRef.current) {
        const hueTravelled = ((now - lastTime) / period) * FULL_CIRCLE;

        colorsRef.light.forEach((color) => {
          // eslint-disable-next-line no-param-reassign
          color.h = ((color.h ?? 0) - hueTravelled + FULL_CIRCLE) % FULL_CIRCLE;
        });
        colorsRef.dark.forEach((color) => {
          // eslint-disable-next-line no-param-reassign
          color.h = ((color.h ?? 0) - hueTravelled + FULL_CIRCLE) % FULL_CIRCLE;
        });

        const formatted = {
          light: colorsRef.light.map((color) => formatHex(color)),
          dark: colorsRef.dark.map((color) => formatHex(color)),
        };
        const style = getThemedGradients(formatted);
        for (const [key, value] of Object.entries(style)) {
          elementRef.current.style.setProperty(key, value);
        }
      }
      lastTime = now;
      raf = requestAnimationFrame(onInterval);
    }

    raf = requestAnimationFrame(onInterval);
    return () => cancelAnimationFrame(raf);
  }, [colorsRef, period, prefersReducedMotion]);

  return (
    <GradientBackground
      colors={initialColors}
      className={className}
      ref={elementRef}
    >
      {children}
    </GradientBackground>
  );
}
