// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FlagFan } from "../../lib/components/client/FlagFan";
import { PageHeading } from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import { FLAGS } from "../../lib/data/flags/flags";
import { FlagSummary } from "./components";

export default async function FlagsListPage() {
  // TODO: Some form of simple search
  const sortedByName = FLAGS.slice().sort((a, z) =>
    // eslint-disable-next-line no-nested-ternary
    a.name === z.name ? 0 : a.name > z.name ? 1 : -1
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
        <div className="grid grid-cols-1 grid-rows-[masonry] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedByName.map((flag) => (
            <div key={flag.id}>
              {/* FlagSummary is an async server component, but
                Typescript doesn't know that. */}
              {/* @ts-expect-error */}
              <FlagSummary flag={flag} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
