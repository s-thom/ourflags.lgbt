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
