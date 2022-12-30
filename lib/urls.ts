// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const useEffectSafe =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useBaseUrl() {
  const [url, setUrl] = useState("");

  useEffectSafe(() => {
    setUrl(`${window.location.protocol}//${window.location.host}`);
  }, []);

  return url;
}
