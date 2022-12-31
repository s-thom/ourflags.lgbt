// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { FlagFan } from "../../lib/components/client/FlagFan";
import {
  MajorHeading,
  PageHeading,
} from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import { FLAGS } from "../../lib/data/flags/flags";

export default function LinkFormPage() {
  return (
    <div>
      <Section className="flex flex-col items-center py-8 text-center sm:py-12 md:py-16">
        <div>
          <PageHeading>
            <span className="font-body font-normal">These are </span>
            <br />
            <span>Our Flags</span>
          </PageHeading>
          <MajorHeading>
            <span className="font-body font-normal">and we fly them with </span>
            <span>pride</span>
          </MajorHeading>
        </div>
        <div className="-order-1">
          <FlagFan flags={FLAGS} />
        </div>
      </Section>
      <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4 lg:gap-8">
        <Section className="flex flex-col gap-4 sm:flex-row">
          <div className="grow rounded-xl border border-neutral-400 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <MajorHeading>Share your flags</MajorHeading>
            <div className="prose prose-neutral py-8 dark:prose-invert">
              <p>
                Show the world what makes you <em>you</em> with a link to a list
                of your flags.
              </p>
              <p>
                Share your link wherever you feel is appropriate. This could be
                as a status, or in a profile description where you can&apos;t
                use custom emoji.
              </p>
            </div>
            <Link
              href="/my-flags"
              className="inline-flex gap-2 rounded-lg border border-green-400 bg-green-100 p-2 hover:bg-green-200 focus:bg-green-200 dark:border-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:focus:bg-green-800"
            >
              Get started <ArrowRight />
            </Link>
          </div>
          <div className="grow rounded-xl border border-neutral-400 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <MajorHeading>Find out more</MajorHeading>
            <div className="prose prose-neutral py-8 dark:prose-invert">
              <p>Want to what a particular flag means?</p>
              <p>
                Have a look through a list of widely-used pride flags, and learn
                more about their history and who they represent.
              </p>
            </div>
            <Link
              href="/flags"
              className="inline-flex gap-2 rounded-lg border border-neutral-400 bg-neutral-100 p-2 hover:bg-neutral-200 focus:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              See all flags <BookOpen />
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
