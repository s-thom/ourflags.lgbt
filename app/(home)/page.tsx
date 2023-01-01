// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ArrowRight, BookOpen, Github } from "lucide-react";
import Link from "next/link";
import { FlagFan } from "../../lib/components/client/FlagFan";
import { Card } from "../../lib/components/layout/Card";
import {
  MajorHeading,
  PageHeading,
} from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import { GITHUB_URL } from "../../lib/constants";
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
        <Section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card title={<MajorHeading>Find out more</MajorHeading>}>
            <div className="prose prose-neutral py-8 dark:prose-invert">
              <p>Want to know what a particular flag means?</p>
              <p>
                Have a look through a list of widely-used pride flags, and learn
                more about their history and who they represent.
              </p>
            </div>
            <Link
              href="/flags"
              className="group/card-button inline-flex gap-2 rounded-lg border border-green-400 bg-green-100 p-2 transition-transform focus-within:scale-105  hover:scale-105 hover:bg-green-200 focus:bg-green-200 motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none dark:border-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:focus:bg-green-800"
            >
              See all flags{" "}
              <BookOpen className="transition-transform group-focus-within/card-button:translate-y-0.5 group-focus-within/card-button:rotate-3 group-hover/card-button:translate-y-0.5 group-hover/card-button:rotate-3 motion-reduce:transition-none motion-reduce:group-focus-within/card-button:transform-none motion-reduce:group-hover/card-button:transform-none" />
            </Link>
          </Card>
          <Card title={<MajorHeading>Share your flags</MajorHeading>}>
            <div className="prose prose-neutral py-8 dark:prose-invert">
              <p>
                Show the world what makes you <em>you</em> with a link to a list
                of your flags.
              </p>
              <p>
                Share your link wherever you feel is appropriate. This could be
                as a status, or in a profile description where you can&lsquo;t
                use custom emoji.
              </p>
            </div>
            <Link
              href="/my-flags"
              className="group/card-button inline-flex gap-2 rounded-lg border border-green-400 bg-green-100 p-2 transition-transform focus-within:scale-105 hover:scale-105 hover:bg-green-200 focus:bg-green-200 motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none dark:border-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:focus:bg-green-800"
            >
              Get started{" "}
              <ArrowRight className="transition-transform group-focus-within/card-button:translate-x-0.5 group-hover/card-button:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-focus-within/card-button:transform-none motion-reduce:group-hover/card-button:transform-none" />
            </Link>
          </Card>
          <Card title={<MajorHeading>Get involved</MajorHeading>}>
            <div className="prose prose-neutral py-8 dark:prose-invert">
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
              className="group/card-button inline-flex gap-2 rounded-lg border border-green-400 bg-green-100 p-2 transition-transform focus-within:scale-105 hover:scale-105 hover:bg-green-200 focus:bg-green-200 motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none dark:border-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:focus:bg-green-800"
            >
              View on GitHub{" "}
              <Github className="transition-transform group-focus-within/card-button:-rotate-3 group-focus-within/card-button:-skew-x-6 group-hover/card-button:-rotate-3 group-hover/card-button:-skew-x-6 motion-reduce:transition-none motion-reduce:group-focus-within/card-button:transform-none motion-reduce:group-hover/card-button:transform-none" />
            </Link>
          </Card>
        </Section>
      </div>
    </div>
  );
}
