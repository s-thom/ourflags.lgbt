// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Link from "next/link";
import { Goose } from "../client/Goose";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between self-end p-2 text-sm">
      <div className="text-sm">
        Created by{" "}
        <Link
          href="https://sthom.kiwi"
          rel="external"
          className="underline decoration-dotted hover:decoration-solid"
        >
          Stuart Thomson
        </Link>
      </div>
      <div>Currently closed source. TODO: </div>
      <Goose />
    </footer>
  );
}
