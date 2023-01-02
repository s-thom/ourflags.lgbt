// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { FLAG_ASPECT_RATIO } from "../../../constants";
import { FlagMeta } from "../../../types";
import { GradientBackgroundSection } from "../../layout/GradientBackgroundSection";
import { MajorHeading } from "../../layout/Headings";

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
  showName?: boolean;
  showFlag?: boolean;
  showReadMore?: boolean;
}

export function FlagExcerptSection({
  flag,
  children,
  showFlag,
  showName,
  showReadMore,
}: FlagExcerptSectionProps) {
  return (
    <GradientBackgroundSection
      colors={flag.background}
      innerClassName="group flex flex-col items-center justify-center gap-8 lg:flex-row"
    >
      {showFlag && (
        <div className="shrink-0 lg:self-start">
          <Link href={`/flags/${flag.id}`}>
            <Image
              src={`/images/flags/${flag.id}_128.png`}
              alt={flag.name}
              height={128}
              width={128 * FLAG_ASPECT_RATIO}
              className={clsx(
                "rounded-xl",
                "custom-transition-hover-group group-focus-within:scale-105 group-hover:scale-105"
              )}
            />
          </Link>
        </div>
      )}
      <div className="flex w-full grow flex-col gap-1">
        {showName && <MajorHeading>{flag.name}</MajorHeading>}
        {children && <div>{children}</div>}
        {showReadMore && (
          <div className="custom-prose">
            <Link
              href={`/flags/${flag.id}`}
              className="custom-link"
              aria-label={`Read more about the ${flag.name} flag`}
            >
              Read more…
            </Link>
          </div>
        )}
      </div>
    </GradientBackgroundSection>
  );
}
