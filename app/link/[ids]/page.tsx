// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Link from "next/link";
import { notFound } from "next/navigation";
import { FullWidthSection } from "../../../lib/components/layout/FullWidthSection";
import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import { parseShareString } from "../../../lib/shortcodes";
import { FlagSectionWithContent } from "./components";

export default async function LinkIdsPage({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  if (flags.length === 0) {
    notFound();
  }

  return (
    <>
      <Section className="py-8 sm:py-12 md:py-16">
        <PageHeading className="text-center">
          <Link
            href="/"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            My flags
          </Link>{" "}
          <span className="font-body">are</span>
        </PageHeading>
      </Section>
      <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4 lg:gap-8">
        {flags.map((flag) => {
          return (
            <FullWidthSection key={flag.id}>
              {/* FlagSectionWithContent is an async server component, but
                  Typescript doesn't know that. */}
              {/* @ts-expect-error */}
              <FlagSectionWithContent flag={flag} />
            </FullWidthSection>
          );
        })}
      </div>
    </>
  );
}
