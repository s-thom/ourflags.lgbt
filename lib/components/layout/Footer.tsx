// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Link from "next/link";
import { GITHUB_URL } from "../../constants";
import { Goose } from "../client/Goose";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 self-end py-2 px-4 text-sm text-neutral-600 dark:text-neutral-300 sm:flex-row">
      <div className="text-sm">
        Created by{" "}
        <Link
          href="https://sthom.kiwi"
          rel="external"
          className="umami--click--sthom custom-link"
        >
          Stuart Thomson
        </Link>{" "}
        and{" "}
        <Link
          href={`${GITHUB_URL}/#contributors`}
          rel="external"
          className="umami--click--contributors custom-link"
        >
          contributors
        </Link>
      </div>
      <Goose />
    </footer>
  );
}
