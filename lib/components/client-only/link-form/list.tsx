// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { FlagMeta } from "../../../types";
import { FlagFormChip } from "./chip";
import { useLinkFormState, useSelectedFlags } from "./context";

export interface FlagFormListProps {
  flags: FlagMeta[];
}

export function FlagFormList({ flags }: FlagFormListProps) {
  const [, setLinkFormState] = useLinkFormState();
  const { unselected: allUnselected } = useSelectedFlags();
  const unselected = useMemo(() => {
    const allowedFlagIds = flags.map((flag) => flag.id);
    return allUnselected.filter((flag) => allowedFlagIds.includes(flag.id));
  }, [allUnselected, flags]);

  const addFlag = (id: string) => {
    setLinkFormState((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  return (
    <div className="flex w-full flex-wrap gap-2">
      {unselected.map((flag) => (
        <FlagFormChip
          key={flag.id}
          className={clsx(
            // The 0.25rem is half of the gap defined above.
            // flex-basis doesn't take the gap into account.
            "basis-full sm:basis-[calc(50%-0.25rem)] md:basis-auto",
          )}
          flag={flag}
          onFlagClick={() => addFlag(flag.id)}
          after={
            <button
              className={clsx(
                "custom-transition-hover focus-within:scale-110 hover:scale-110",
              )}
              aria-label={`Add ${flag.name}`}
              onClick={() => addFlag(flag.id)}
              data-umami-event="add-flag"
              data-umami-event-flagid={flag.id}
            >
              <Plus />
            </button>
          }
        />
      ))}
    </div>
  );
}
