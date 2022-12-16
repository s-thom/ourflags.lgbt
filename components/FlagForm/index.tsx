"use client";

import { useMemo, useState } from "react";
import { FlagMeta } from "../../types/types";
import { FlagChip } from "../FlagChip";

export interface FlagFormProps {
  flags: FlagMeta[];
}

export function FlagForm({ flags }: FlagFormProps) {
  const [selectedFlagIds, setSelectedFlagIds] = useState<string[]>([]);
  const addFlag = (id: string) =>
    setSelectedFlagIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
  const removeFlag = (id: string) =>
    setSelectedFlagIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : current
    );

  const { selectedFlags, unselectedFlags } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const selectedFlags: FlagMeta[] = [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const unselectedFlags: FlagMeta[] = [];

    // TODO: not O(n^2)
    for (const flag of flags) {
      if (selectedFlagIds.includes(flag.id)) {
        selectedFlags.push(flag);
      } else {
        unselectedFlags.push(flag);
      }
    }

    // TODO: also optimise this thx
    selectedFlags.sort(
      (a, z) => selectedFlagIds.indexOf(a.id) - selectedFlagIds.indexOf(z.id)
    );

    return { selectedFlags, unselectedFlags };
  }, [flags, selectedFlagIds]);

  return (
    <div>
      <div className="m-2 p-2 border rounded border-neutral-400">
        {unselectedFlags.map((flag) => (
          <FlagChip key={flag.id} flag={flag} onAdd={() => addFlag(flag.id)} />
        ))}
      </div>
      <div className="m-2 p-2 border rounded border-green-400">
        {selectedFlags.map((flag) => (
          <FlagChip
            key={flag.id}
            flag={flag}
            onRemove={() => removeFlag(flag.id)}
          />
        ))}
      </div>
    </div>
  );
}
