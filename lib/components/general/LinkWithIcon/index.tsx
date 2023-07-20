// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";
import { FLAGS_BY_ID } from "../../../data/flags/flags";
import { FlagImage } from "../FlagImage";

/**
 * In order to make URL parsing work on the server, we need to make sure that
 * the URL constructor actually succeeds. For this is needs a hostname.
 * The hostname chosen here is so that false positives are unlikely.
 */
const FAKE_HOSTNAME = "fake-hostname-for-parsing-purposes.local";

const REGEX_LAST_PATH_SEGMENT = /^.*\/(.*)$/;

function isExternalLink(href: string): false | URL {
  try {
    const url = new URL(href, `https://${FAKE_HOSTNAME}`);
    if (url.hostname === FAKE_HOSTNAME) {
      return false;
    }
    return url;
  } catch (err) {
    return false;
  }
}

function isLikelyFlagLink(href: string) {
  try {
    return (
      // Starts with . (i.e. ./ and ../) or /<foo>, but not // as that indicates protocol relativity.
      (href.startsWith(".") ||
        (href.startsWith("/") && !href.startsWith("//"))) &&
      !isExternalLink(href)
    );
  } catch (err) {
    return false;
  }
}

export interface LinkWithIconProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function LinkWithIcon({
  href,
  className,
  children,
  ...rest
}: LinkWithIconProps) {
  let beforeIcon: ReactNode = null;
  let afterIcon: ReactNode = null;
  let umamiClassName: string | undefined;

  if (isLikelyFlagLink(href)) {
    // This is getting the last segment of any relative path, not just those for flags.
    const match = href.match(REGEX_LAST_PATH_SEGMENT);
    if (match) {
      const flagId = match[1]!;
      const flag = FLAGS_BY_ID[flagId];
      if (flag) {
        afterIcon = (
          <FlagImage
            pictureClassName="not-prose self-center"
            className={clsx(
              "aspect-[3/2] h-4 min-h-[1rem] w-6 min-w-[1.5rem] rounded sm:h-6 sm:min-h-[1.5rem] sm:w-9 sm:min-w-[2.25rem]",
              "custom-transition-hover-group group-focus-within/link-icon:scale-105 group-hover/link-icon:scale-105",
            )}
            flag={flag}
            height={24}
            alt={`${flag.name} flag icon`}
          />
        );
        umamiClassName = "umami--click--flag-link";
      }
    }
  }

  const url = isExternalLink(href);
  if (url) {
    beforeIcon = (
      <span className="not-prose self-center pr-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`}
          height={24}
          width={24}
          className={clsx(
            "aspect-[1/1] h-4 min-h-[1rem] w-4 min-w-[1rem] rounded sm:h-6 sm:min-h-[1.5rem] sm:w-6 sm:min-w-[1.5rem]",
            "custom-transition-hover-group group-focus-within/link-icon:scale-105 group-hover/link-icon:scale-105",
          )}
          alt=""
        />
      </span>
    );
    umamiClassName = "umami--click--external-link";
  }

  return (
    <Link
      href={href}
      className={clsx(
        className,
        umamiClassName,
        "group/link-icon inline-flex items-baseline gap-1",
      )}
      {...rest}
    >
      {beforeIcon}
      {children}
      {afterIcon}
    </Link>
  );
}
