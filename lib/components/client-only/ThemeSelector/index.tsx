// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";

// If adding themes, remember to update `public/dark.js`

const THEME_KEY = "flags-theme";

export function ThemeSelector() {
  const toggleTheme = useCallback(() => {
    // Remove all theme classes
    const classes = document.documentElement.classList;
    const isCurrentlyDark = classes.contains("dark");
    if (isCurrentlyDark) {
      classes.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    } else {
      classes.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    }
  }, []);

  return (
    <button
      className={clsx(
        "custom-transition-hover focus-within:scale-110 hover:scale-110",
      )}
      onClick={toggleTheme}
      title="Change theme"
      aria-label="Change theme"
    >
      <Moon
        className="hidden dark:inline"
        aria-label="Dark theme"
        data-umami-event="theme-change"
        data-umami-event-theme="dark"
      />
      <Sun
        className="inline dark:hidden"
        aria-label="Light theme"
        data-umami-event="theme-change"
        data-umami-event-theme="light"
      />
    </button>
  );
}
