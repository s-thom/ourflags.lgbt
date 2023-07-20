// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { FLAGS } from "../../../data/flags/flags";
import { FlagMeta } from "../../../types";

export interface LinkFormContextValue {
  selectedFlags: string[];
  setSelectedFlags: Dispatch<SetStateAction<string[]>>;
}

const defaultValue: LinkFormContextValue = {
  selectedFlags: [],
  setSelectedFlags: () => {},
};

const Context = createContext(defaultValue);

export function useLinkFormState(): [
  LinkFormContextValue["selectedFlags"],
  LinkFormContextValue["setSelectedFlags"],
] {
  const { selectedFlags, setSelectedFlags } = useContext(Context);
  return [selectedFlags, setSelectedFlags];
}

export function LinkFormContext({ children }: PropsWithChildren) {
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  return (
    <Context.Provider value={{ selectedFlags, setSelectedFlags }}>
      {children}
    </Context.Provider>
  );
}

export function useSelectedFlags(): {
  selected: FlagMeta[];
  unselected: FlagMeta[];
} {
  const [selectedFlagIds] = useLinkFormState();

  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const selected: FlagMeta[] = [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const unselected: FlagMeta[] = [];

    // TODO: not O(n^2)
    for (const flag of FLAGS) {
      if (selectedFlagIds.includes(flag.id)) {
        selected.push(flag);
      } else {
        unselected.push(flag);
      }
    }

    // TODO: also optimise this thx
    selected.sort(
      (a, z) => selectedFlagIds.indexOf(a.id) - selectedFlagIds.indexOf(z.id),
    );

    return { selected, unselected };
  }, [selectedFlagIds]);
}
