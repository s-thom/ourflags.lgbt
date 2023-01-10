// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import Link from "next/link";
import { getThemedGradients } from "../../../lib/colors";
import { FlagImage } from "../../../lib/components/general/FlagImage";
import { FlagMeta } from "../../../lib/types";

export interface FlagSummaryProps {
  flag: FlagMeta;
}

export async function FlagSummary({ flag }: FlagSummaryProps) {
  const style = getThemedGradients(flag.background);

  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-xl p-2",
        "custom-gradient",
        "custom-transition-hover focus-within:scale-105 hover:scale-105"
      )}
      style={style}
    >
      <div className="shrink-0">
        <FlagImage
          flag={flag}
          alt={flag.name}
          height={64}
          className="rounded-lg"
        />
      </div>
      <div>
        <h2 className="font-headings text-3xl">{flag.name}</h2>
        <div className="custom-prose">
          <Link
            href={`/flags/${flag.id}`}
            className="custom-link umami--click--flag-read-more"
          >
            Read more…
          </Link>
        </div>
      </div>
    </div>
  );
}
