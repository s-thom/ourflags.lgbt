// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Metadata } from "next";
import Link from "next/link";
import { FlagFan } from "../../../lib/components/client-only/FlagFan";
import { Card } from "../../../lib/components/layout/Card";
import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import { GITHUB_URL } from "../../../lib/constants";
import { FLAGS } from "../../../lib/data/flags/flags";
import { getHeadMetadata } from "../../../lib/server/head";
import { FlagSummary } from "./components";

export async function generateMetadata(): Promise<Metadata> {
  return getHeadMetadata({
    title: "All flags",
    description: "These are our flags, and we fly them with pride",
    path: "/flags",
    flags: [],
    overrideFaviconFlags: "default",
    overrideOgFlags: "all",
    ogImageStyle: "title",
  });
}

export default async function FlagsListPage() {
  // TODO: Some form of simple search
  const sortedByName = FLAGS.slice().sort((a, z) =>
    // eslint-disable-next-line no-nested-ternary
    a.name === z.name ? 0 : a.name > z.name ? 1 : -1,
  );

  return (
    <>
      <Section className="flex flex-col items-center py-8 text-center sm:py-12 md:py-16">
        <PageHeading className="text-center">All flags</PageHeading>
        <div className="-order-1">
          <FlagFan flags={FLAGS} />
        </div>
      </Section>
      <Section>
        <Card className="mx-auto max-w-lg lg:max-w-3xl">
          <div className="custom-prose">
            <p>
              This website is still in-progress, so there are flags still
              missing from this list. If there&lsquo;s a flag that you want to
              see added, you can{" "}
              <Link
                href={`${GITHUB_URL}/labels/flag request`}
                rel="external"
                className="custom-link umami--click--all-flags-github"
              >
                submit a request on GitHub
              </Link>
              .
            </p>
          </div>
        </Card>
      </Section>
      <Section>
        <div className="grid grid-cols-1 grid-rows-[masonry] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedByName.map((flag) => (
            <div key={flag.id}>
              <FlagSummary flag={flag} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
