// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";
import { CategoryMeta } from "../../../types";
import { GradientBackgroundSection } from "../GradientBackgroundSection";
import { MajorHeading } from "../Headings";

export interface CategoryExcerptSectionProps extends PropsWithChildren {
  category: CategoryMeta;
  showName?: boolean;
}

export function CategoryExcerptSection({
  category,
  children,
  showName,
}: CategoryExcerptSectionProps) {
  return (
    <GradientBackgroundSection
      className="flex flex-col items-center justify-center gap-8 lg:flex-row"
      innerClassName="flex grow flex-col gap-1"
      colors={category.background}
    >
      {showName && <MajorHeading>{category.name}</MajorHeading>}
      {children && <div>{children}</div>}
    </GradientBackgroundSection>
  );
}
