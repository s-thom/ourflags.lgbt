// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { Card } from "../../lib/components/layout/Card";
import {
  MajorHeading,
  PageHeading,
} from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";

export default function NotFound() {
  const buttonClassNames = clsx(
    "group inline-flex gap-2 rounded-lg border p-2",
    "border-green-400 bg-green-300 focus-within:border-green-500 focus-within:bg-green-400 hover:border-green-500 hover:bg-green-400",
    "dark:border-green-900 dark:bg-green-800 dark:focus-within:border-green-600 dark:focus-within:bg-green-700 dark:hover:border-green-600 dark:hover:bg-green-700",
    "custom-transition-hover focus-within:scale-105 hover:scale-105"
  );

  return (
    <div className="pt-8 sm:pt-12 md:pt-16">
      <Section>
        <PageHeading className="text-center">404</PageHeading>
        <MajorHeading className="text-center">
          <span className="font-body">Page not found</span>
        </MajorHeading>
      </Section>
      <Section className="flex justify-center pt-8 sm:pt-12 md:pt-16">
        <Card>
          <div className="custom-prose">
            <p>The page you were looking for doesn&lsquo;t seem to exist.</p>
            <p>
              If you came from an external website, the link you followed to get
              here might need to be updated.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className={buttonClassNames}>
              <span>Home</span>
              <Home />
            </Link>
            <Link href="/flags" className={buttonClassNames}>
              <span>See all flags</span>
              <BookOpen />
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
