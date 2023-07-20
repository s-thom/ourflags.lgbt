// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { HTMLAttributes } from "react";

export function Section({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={clsx(
        className,
        "mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8",
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
