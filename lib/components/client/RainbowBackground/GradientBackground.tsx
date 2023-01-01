// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { forwardRef, PropsWithChildren } from "react";
import { getThemedGradients } from "../../../colors";

export interface GradientBackgroundProps extends PropsWithChildren {
  className?: string;
  /**
   * Note: colours must be valid CSS colours at this point.
   */
  colors: { light: string[]; dark: string[] };
}

export const GradientBackground = forwardRef<
  HTMLDivElement,
  GradientBackgroundProps
>(function GradientBackground({ colors, className, children }, ref) {
  const style = getThemedGradients(colors);
  return (
    <div className={clsx(className, "custom-gradient")} style={style} ref={ref}>
      {children}
    </div>
  );
});
