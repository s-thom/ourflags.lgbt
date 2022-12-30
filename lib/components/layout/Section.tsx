// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { HTMLAttributes } from "react";

export function Section({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`mx-auto max-w-7xl px-4 sm:px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}
