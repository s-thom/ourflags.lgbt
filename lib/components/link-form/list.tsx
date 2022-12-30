// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { useMemo } from "react";
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

  const addFlag = (id: string) =>
    setLinkFormState((current) =>
      current.includes(id) ? current : [...current, id]
    );

  return (
    <div className="flex flex-wrap gap-2">
      {unselected.map((flag) => (
        <FlagFormChip
          key={flag.id}
          flag={flag}
          onAdd={() => addFlag(flag.id)}
        />
      ))}
    </div>
  );
}
