// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { trackEvent } from "../../analytics";
import { FlagMeta } from "../../types";
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
      current.includes(id) ? current : [...current, id]
    );
    trackEvent("click", "Add flag", {
      flagId: id,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {unselected.map((flag) => (
        <FlagFormChip
          key={flag.id}
          flag={flag}
          onFlagClick={() => addFlag(flag.id)}
          after={
            <button
              className={clsx(
                "custom-transition-hover focus-within:scale-110 hover:scale-110"
              )}
              aria-label={`Add ${flag.name}`}
              onClick={() => addFlag(flag.id)}
            >
              <Plus />
            </button>
          }
        />
      ))}
    </div>
  );
}
