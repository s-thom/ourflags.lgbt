// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { FlagMeta } from "../../../types";
import { GradientBackgroundSection } from "../../layout/GradientBackgroundSection";
import { MajorHeading } from "../../layout/Headings";
import { FlagImage } from "../FlagImage";

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
            <FlagImage
              flag={flag}
              alt={flag.name}
              height={128}
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
        {children && <div className="py-4">{children}</div>}
        {showReadMore && (
          <div className="custom-prose">
            <Link
              href={`/flags/${flag.id}`}
              className="custom-link umami--click--flag-read-more"
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
