// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import clsx from "clsx";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Card } from "../../lib/components/layout/Card";
import { PageHeading } from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import { GITHUB_URL } from "../../lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const buttonClassNames = clsx(
    "group inline-flex gap-2 rounded-lg border p-2",
    "border-green-400 bg-green-300 focus-within:border-green-500 focus-within:bg-green-400 hover:border-green-500 hover:bg-green-400",
    "dark:border-green-900 dark:bg-green-800 dark:focus-within:border-green-600 dark:focus-within:bg-green-700 dark:hover:border-green-600 dark:hover:bg-green-700",
    "custom-transition-hover focus-within:scale-105 hover:scale-105",
  );

  return (
    <div className="pt-8 sm:pt-12 md:pt-16">
      <Section>
        <PageHeading className="text-center">Error</PageHeading>
      </Section>
      <Section className="flex justify-center pt-8 sm:pt-12 md:pt-16">
        <Card>
          <div className="custom-prose">
            <p>An unknown error occurred and was not handled by the website.</p>
            <p>
              You might be able to recover from this error by clicking the Try
              Again button below. If this does not work, and you are able to
              reliably reproduce this error, then consider filing a bug report.
              Be sure to check the{" "}
              <Link
                href={`${GITHUB_URL}/issues`}
                rel="external"
                className="custom-link"
              >
                existing issues
              </Link>{" "}
              to see if it has already been reported.
            </p>
            {!!(error as any).digest && (
              <pre>{(error as any).digest ?? error.message}</pre>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className={buttonClassNames}>
              <span>Try again</span>
              <RefreshCw />
            </button>{" "}
            <Link href="/" className={buttonClassNames}>
              <span>Home</span>
              <Home />
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
