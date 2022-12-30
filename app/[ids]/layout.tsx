// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Link from "next/link";

export default function IdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <div className="prose prose-neutral mx-auto mt-10 max-w-sm rounded-xl bg-white/30 p-4 px-4 shadow-inner dark:prose-invert sm:max-w-md sm:px-6 md:mt-20 md:max-w-lg md:px-8">
        <p>
          <Link
            href="/"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            Choose your flags
          </Link>{" "}
          to share with the world, or have a look at{" "}
          <Link
            href="/flags"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            all flags
          </Link>{" "}
          to learn more about queer history and representation.
        </p>
      </div>
    </div>
  );
}
