// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { ArrowRight, BookOpen, Github } from "lucide-react";
import Link from "next/link";
import { FlagFan } from "../../lib/components/client-only/FlagFan";
import { Card } from "../../lib/components/layout/Card";
import {
  MajorHeading,
  PageHeading,
} from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import { GITHUB_URL } from "../../lib/constants";
import { FLAGS } from "../../lib/data/flags/flags";

export default function HomePage() {
  const buttonClassNames = clsx(
    "group inline-flex gap-2 rounded-lg border p-2",
    "border-green-400 bg-green-300 focus-within:border-green-500 focus-within:bg-green-400 hover:border-green-500 hover:bg-green-400",
    "dark:border-green-900 dark:bg-green-800 dark:focus-within:border-green-600 dark:focus-within:bg-green-700 dark:hover:border-green-600 dark:hover:bg-green-700",
    "custom-transition-hover focus-within:scale-105 hover:scale-105"
  );

  return (
    <>
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
      <Section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title={<MajorHeading>Find out more</MajorHeading>}>
          <div className="custom-prose">
            <p>Want to know what a particular flag means?</p>
            <p>
              Have a look through a list of widely-used pride flags, and learn
              more about their history and who they represent.
            </p>
          </div>
          <Link href="/flags" className={buttonClassNames}>
            <span>See all flags</span>
            <BookOpen />
          </Link>
        </Card>
        <Card title={<MajorHeading>Share your flags</MajorHeading>}>
          <div className="custom-prose">
            <p>
              Show the world what makes you <em>you</em> with a link to a list
              of your flags.
            </p>
            <p>
              Share your link wherever you feel is appropriate. This could be as
              a status, or in a profile description where you can&lsquo;t use
              custom emoji.
            </p>
          </div>
          <Link href="/my-flags" className={buttonClassNames}>
            <span>Get started</span>
            <ArrowRight />
          </Link>
        </Card>
        <Card title={<MajorHeading>Get involved</MajorHeading>}>
          <div className="custom-prose">
            <p>
              This website is pretty new, and needs some updating to be a full
              reference for pride flags. That&lsquo;s where you come in.
            </p>
            <p>
              This project is open source, and contributions are welcome. If
              there&lsquo;s a flag that you wish to be added, or text content
              that needs to be updated, you can create an issue in the issue
              tracker. If you&lsquo;re able to, contributing those changes
              yourself is even better!
            </p>
          </div>
          <Link
            href={`${GITHUB_URL}/#readme`}
            rel="external"
            className={buttonClassNames}
          >
            <span>View on GitHub</span>
            <Github />
          </Link>
        </Card>
      </Section>
    </>
  );
}
