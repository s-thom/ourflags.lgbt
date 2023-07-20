// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import Link from "next/link";
import { FlagMeta } from "../../../types";
import { FlagImage } from "../../general/FlagImage";

export interface FlagFanItemProps {
  flag: FlagMeta;
  onFocusIn?: () => void;
  onFocusOut?: () => void;
}

export function FlagFanItem({ flag, onFocusIn, onFocusOut }: FlagFanItemProps) {
  return (
    <div
      className={clsx(
        "relative",
        "custom-transition-hover focus-within:-translate-y-3 hover:-translate-y-3",
      )}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      onMouseEnter={onFocusIn}
      onMouseLeave={onFocusOut}
    >
      <Link
        href={`/flags/${flag.id}`}
        data-umami-event="flag-fan-item"
        data-umami-event-flagid={flag.id}
      >
        <FlagImage
          flag={flag}
          alt={flag.name}
          title={flag.name}
          height={128}
          className="rounded shadow-md sm:rounded-lg md:rounded-xl"
        />
      </Link>
    </div>
  );
}
