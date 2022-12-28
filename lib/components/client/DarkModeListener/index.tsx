"use client";

// TODO: wrap this up with whatever gets used for toggling themes,
// so all logic is relatively together.

import { useEffect } from "react";

export default function DarkModeListener() {
  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");

    function listener(event: MediaQueryListEvent) {
      // Only update theme if the user hasn't chosen another theme
      if (!("flags-theme" in localStorage)) {
        if (event.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }

    match.addEventListener("change", listener);

    return () => match.removeEventListener("change", listener);
  }, []);

  return null;
}
