// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Metadata } from "next";
import Link from "next/link";
import { FlagExcerptSection } from "../../../../lib/components/general/FlagExcerptSection";
import { Card } from "../../../../lib/components/layout/Card";
import { PageHeading } from "../../../../lib/components/layout/Headings";
import { Section } from "../../../../lib/components/layout/Section";
import { GITHUB_URL } from "../../../../lib/constants";
import { FLAGS } from "../../../../lib/data/flags/flags";
import { getFlagData } from "../../../../lib/server/getData";
import { getHeadMetadata } from "../../../../lib/server/head";
import { renderMarkdownToReact } from "../../../../lib/server/remark";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getFlagData(params.id);

  return getHeadMetadata({
    title: data.meta.name,
    description: `Learn about the ${data.meta.name.replace(
      / flag$/i,
      "",
    )} flag, its history, and the people it represents`,
    path: `/flags/${params.id}`,
    flags: [data.meta],
    ogImageStyle: "single",
  });
}

export default async function FlagsIdPage({ params }: Props) {
  const data = await getFlagData(params.id);

  const pageContent = await renderMarkdownToReact(data.content);
  const hasNoContent = data.content.trim().length === 0;

  return (
    <>
      <div className="py-8 sm:py-12 md:py-16">
        <FlagExcerptSection flag={data.meta} showFlag>
          <PageHeading className="text-center">{data.meta.name}</PageHeading>
        </FlagExcerptSection>
      </div>
      {hasNoContent && (
        <Section className="flex flex-col items-center">
          <Card>
            <div className="custom-prose">
              <p>
                This flag is missing its history and other information about the
                people it represents. If you want to write this, then have a
                look at{" "}
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
        </Section>
      )}
      <Section className="flex flex-col items-center">
        <article className="custom-prose">{pageContent}</article>
      </Section>
    </>
  );
}

export async function generateStaticParams() {
  return FLAGS.map((flag) => ({
    id: flag.id,
  }));
}
