// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";
import { useGradientStops } from "../../../colors";
import { CategoryMeta } from "../../../types";
import { MajorHeading } from "../Headings";
import { Section } from "../Section";

export interface CategoryExcerptSectionProps extends PropsWithChildren {
  category: CategoryMeta;
  showName?: boolean;
}

export function CategoryExcerptSection({
  category,
  children,
  showName,
}: CategoryExcerptSectionProps) {
  const { style } = useGradientStops(category.background);

  return (
    <div
      className={`gradient-light dark:gradient-dark bg-gradient-to-br p-4 shadow-inner`}
      style={style}
    >
      <Section className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="flex w-full grow flex-col gap-1">
          {showName && <MajorHeading>{category.name}</MajorHeading>}
          {children && <div>{children}</div>}
        </div>
      </Section>
    </div>
  );
}
