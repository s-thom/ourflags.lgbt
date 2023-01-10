// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Link from "next/link";
import { PropsWithChildren } from "react";
import { FlagExcerptSection } from "../../../lib/components/general/FlagExcerptSection";
import { Card } from "../../../lib/components/layout/Card";
import { GITHUB_URL } from "../../../lib/constants";
import { getFlagData } from "../../../lib/server/getData";
import { renderMarkdownToReact } from "../../../lib/server/remark";
import { FlagMeta } from "../../../lib/types";

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
}

export async function FlagSectionWithContent({
  flag,
  children,
}: FlagExcerptSectionProps) {
  const data = await getFlagData(flag.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");
  const hasNoContent = (data.excerpt ?? "").trim().length === 0;

  return (
    <FlagExcerptSection flag={flag} showFlag showName showReadMore>
      {hasNoContent && (
        <Card>
          <div className="custom-prose">
            <p>
              This flag is missing its history and other information about the
              people it represents. If you want to write this, then have a look
              at{" "}
              <Link
                href={`${GITHUB_URL}/issues`}
                rel="external"
                className="custom-link umami--click--flag-content-missing-github"
              >
                the project on GitHub
              </Link>
              .
            </p>
          </div>
        </Card>
      )}
      <article className="custom-prose">{excerpt}</article>
      {children}
    </FlagExcerptSection>
  );
}
