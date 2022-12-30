// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { HTMLAttributes } from "react";

/**
 * The most important heading on the page. May not appear on every page
 */
export function PageHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h1
      className={`font-headings text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl ${className}`}
      {...rest}
    >
      {children}
    </h1>
  );
}

/**
 * A top-level heading
 */
export function MajorHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h2
      className={`font-headings text-2xl font-bold sm:text-3xl md:text-4xl ${className}`}
      {...rest}
    >
      {children}
    </h2>
  );
}

/**
 * A less important heading
 */
export function MinorHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h3
      className={`font-headings text-lg font-bold sm:text-xl md:text-xl ${className}`}
      {...rest}
    >
      {children}
    </h3>
  );
}
