// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { HTMLAttributes } from "react";
import { GradientBackground } from "../client/RainbowBackground";
import { Section } from "./Section";

interface GradientBackgroundSectionProps extends HTMLAttributes<HTMLElement> {
  colors: { light: string[]; dark?: string[] };
  innerClassName?: string;
}

export function GradientBackgroundSection({
  className,
  innerClassName,
  children,
  colors,
  ...rest
}: GradientBackgroundSectionProps) {
  return (
    <GradientBackground
      className={clsx(className, "p-4")}
      colors={colors}
      {...rest}
    >
      <Section className={innerClassName}>{children}</Section>
    </GradientBackground>
  );
}
