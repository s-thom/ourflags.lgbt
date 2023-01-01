// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Image from "next/image";
import Link from "next/link";
import { getThemedGradients } from "../../../lib/colors";
import { FLAG_ASPECT_RATIO } from "../../../lib/constants";
import { FlagMeta } from "../../../lib/types";

export interface FlagSummaryProps {
  flag: FlagMeta;
}

export async function FlagSummary({ flag }: FlagSummaryProps) {
  const style = getThemedGradients(flag.background);

  return (
    <div
      className="gradient-light dark:gradient-dark flex items-center gap-4 rounded-xl bg-gradient-to-br p-2 transition-transform focus-within:scale-105 hover:scale-105 motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none"
      style={style}
    >
      <div className="shrink-0">
        <Image
          src={`/images/flags/${flag.id}_64.png`}
          alt={flag.name}
          height={64}
          width={64 * FLAG_ASPECT_RATIO}
          className="rounded-lg"
        />
      </div>
      <div>
        <h2 className="font-headings text-3xl">{flag.name}</h2>
        <div className="prose prose-neutral dark:prose-invert">
          <Link
            href={`/flags/${flag.id}`}
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            Read more…
          </Link>
        </div>
      </div>
    </div>
  );
}
