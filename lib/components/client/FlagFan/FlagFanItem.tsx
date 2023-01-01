// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "../../../analytics";
import { FLAG_ASPECT_RATIO } from "../../../constants";
import { FlagMeta } from "../../../types";

export interface FlagFanItemProps {
  flag: FlagMeta;
  onFocusIn?: () => void;
  onFocusOut?: () => void;
}

export function FlagFanItem({ flag, onFocusIn, onFocusOut }: FlagFanItemProps) {
  return (
    <div
      className="relative transition-transform focus-within:-translate-y-3 hover:-translate-y-3 motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none"
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      onMouseEnter={onFocusIn}
      onMouseLeave={onFocusOut}
    >
      <Link
        href={`/flags/${flag.id}`}
        onClick={() => trackEvent("click", "Flag fan", { flagId: flag.id })}
      >
        <Image
          src={`/images/flags/${flag.id}_128.png`}
          alt={flag.name}
          title={flag.name}
          height={128}
          width={128 * FLAG_ASPECT_RATIO}
          className="rounded shadow-md sm:rounded-lg md:rounded-xl"
        />
      </Link>
    </div>
  );
}
