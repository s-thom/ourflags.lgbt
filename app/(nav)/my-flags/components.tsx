// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";
import { CategoryExcerptSection } from "../../../lib/components/layout/CategoryExcerptSection";
import { getCategoryData } from "../../../lib/server/getData";
import { renderMarkdownToReact } from "../../../lib/server/remark";
import { CategoryMeta } from "../../../lib/types";

export interface CategoryExcerptSectionProps extends PropsWithChildren {
  category: CategoryMeta;
}

export async function CategorySectionWithContent({
  category,
  children,
}: CategoryExcerptSectionProps) {
  const data = await getCategoryData(category.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");

  return (
    <CategoryExcerptSection category={category} showName>
      <article className="prose prose-neutral pb-4 dark:prose-invert sm:pb-5 md:prose-lg md:pb-6 lg:prose-xl">
        {excerpt}
      </article>
      {children}
    </CategoryExcerptSection>
  );
}
