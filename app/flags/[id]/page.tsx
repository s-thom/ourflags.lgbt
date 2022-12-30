// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FlagExcerptSection } from "../../../lib/components/layout/FlagExcerptSection";
import { FullWidthSection } from "../../../lib/components/layout/FullWidthSection";
import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import { FLAGS } from "../../../lib/data/flags/flags";
import { getFlagData } from "../../../lib/server/getData";
import { renderMarkdownToReact } from "../../../lib/server/remark";

export default async function FlagsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  const pageContent = await renderMarkdownToReact(data.content);

  return (
    <div className="pt-8 sm:pt-12 md:pt-16">
      <FullWidthSection className="pb-6 sm:pb-8 md:pb-12">
        <FlagExcerptSection flag={data.meta} showFlag>
          <PageHeading className="text-center">{data.meta.name}</PageHeading>
        </FlagExcerptSection>
      </FullWidthSection>
      <Section className="flex flex-col items-center">
        <article className="prose prose-neutral dark:prose-invert md:prose-lg lg:prose-xl">
          {pageContent}
        </article>
      </Section>
    </div>
  );
}

export async function generateStaticParams() {
  return FLAGS.map((flag) => ({
    id: flag.id,
  }));
}
