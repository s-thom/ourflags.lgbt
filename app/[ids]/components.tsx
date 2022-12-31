// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";
import { FlagExcerptSection } from "../../lib/components/layout/FlagExcerptSection";
import { getFlagData } from "../../lib/server/getData";
import { renderMarkdownToReact } from "../../lib/server/remark";
import { FlagMeta } from "../../lib/types";

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
}

export async function FlagSectionWithContent({
  flag,
  children,
}: FlagExcerptSectionProps) {
  const data = await getFlagData(flag.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");

  return (
    <FlagExcerptSection flag={flag} showFlag showName showReadMore>
      <article className="prose prose-neutral dark:prose-invert md:prose-lg lg:prose-xl">
        {excerpt}
      </article>
      {children}
    </FlagExcerptSection>
  );
}
