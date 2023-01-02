// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FlagExcerptSection } from "../../../../lib/components/general/FlagExcerptSection";
import { PageHeading } from "../../../../lib/components/layout/Headings";
import { Section } from "../../../../lib/components/layout/Section";
import { FLAGS } from "../../../../lib/data/flags/flags";
import { getFlagData } from "../../../../lib/server/getData";
import { renderMarkdownToReact } from "../../../../lib/server/remark";

export default async function FlagsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  const pageContent = await renderMarkdownToReact(data.content);

  return (
    <div className="pt-8 sm:pt-12 md:pt-16">
      <FlagExcerptSection flag={data.meta} showFlag>
        <PageHeading className="text-center">{data.meta.name}</PageHeading>
      </FlagExcerptSection>
      <Section className="flex flex-col items-center">
        <article className="custom-prose">{pageContent}</article>
      </Section>
    </div>
  );
}

export async function generateStaticParams() {
  return FLAGS.map((flag) => ({
    id: flag.id,
  }));
}
