// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";
import { getThemedGradients } from "../../../colors";

export interface GradientBackgroundProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  /**
   * Note: colours must be valid CSS colours at this point.
   */
  colors: { light: string[]; dark?: string[] };
}

export const GradientBackground = forwardRef<
  HTMLDivElement,
  GradientBackgroundProps
>(function GradientBackground(
  { colors, className, children, style: baseStyle, ...rest },
  ref
) {
  const style = getThemedGradients(colors);
  return (
    <div
      className={clsx(className, "custom-gradient")}
      style={{ ...baseStyle, ...style }}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});
