// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { SiteName } from "../../lib/components/client/SiteName";
import { ThemeSelector } from "../../lib/components/client/ThemeSelector";
import { Main } from "../../lib/components/layout/Main";
import { GITHUB_URL } from "../../lib/constants";
import { FLAGS } from "../../lib/data/flags/flags";

export default function NavLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="flex justify-between gap-4 py-2 px-3">
        <SiteName flags={FLAGS} />
        <div className="flex flex-row items-center gap-4">
          <ThemeSelector />
          <div className="group/nav relative">
            <button
              className={clsx(
                "flex items-center sm:hidden",
                "custom-transition-hover focus-within:scale-110 hover:scale-110"
              )}
              title="Navigation"
              aria-label="Navigation"
            >
              <Menu />
            </button>
            <ul
              className={clsx(
                "invisible absolute right-0 z-20 flex min-w-[12rem] flex-col gap-4 rounded-lg border p-4",
                "border-neutral-400 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900",
                "group-focus-within/nav:visible group-hover/nav:visible",
                "sm:visible sm:relative sm:flex-row sm:border-none sm:bg-transparent sm:pl-0 sm:dark:border-none sm:dark:bg-transparent"
              )}
            >
              <li>
                <Link href={"/flags"} className="custom-link">
                  All flags
                </Link>
              </li>
              <li>
                <Link href={"/my-flags"} className="custom-link">
                  Share your flags
                </Link>
              </li>
              <li className="sm:hidden">
                <hr />
              </li>
              <li className="sm:order-[-1]">
                <Link
                  href={`${GITHUB_URL}/#readme`}
                  rel="external"
                  className="custom-link"
                >
                  <span className="inline sm:hidden">Source code</span>
                  <Github
                    className={clsx(
                      "hidden sm:inline",
                      "custom-transition-hover focus-within:scale-110 hover:scale-110"
                    )}
                  >
                    <title>View source code on GitHub</title>
                  </Github>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <Main>{children}</Main>
    </>
  );
}
