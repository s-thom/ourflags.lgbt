// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import { getHeadMetadata } from "../../../lib/server/head";
import { buildShareString, parseShareString } from "../../../lib/shortcodes";
import { FlagSectionWithContent } from "./components";

interface Props {
  params: { ids: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const flags = parseShareString(params.ids);

  if (flags.length === 0) {
    return getHeadMetadata({
      title: undefined,
      description: "These are our flags, and we fly them with pride",
      path: `/${buildShareString(flags)}`,
      flags: [],
      overrideFaviconFlags: "default",
      overrideOgFlags: "all",
      ogImageStyle: "title",
      noIndex: true,
    });
  }

  return getHeadMetadata({
    title: `${flags.length} ${flags.length === 1 ? "flag" : "flags"}`,
    description: "These are my flags",
    path: `/${buildShareString(flags)}`,
    flags,
    ogImageStyle: "my-flags",
    noIndex: true,
  });
}

export default async function IdsPage({ params }: Props) {
  const flags = parseShareString(params.ids);

  if (flags.length === 0) {
    notFound();
  }

  return (
    <>
      <Section className="py-8 sm:py-12 md:py-16">
        <PageHeading className="text-center">
          <Link href="/my-flags" className="custom-link">
            My flags
          </Link>{" "}
          <span className="font-body">are</span>
        </PageHeading>
      </Section>
      {flags.map((flag) => (
        <FlagSectionWithContent key={flag.id} flag={flag} />
      ))}
    </>
  );
}
