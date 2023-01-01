// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import DarkModeListener from "../lib/components/client/DarkModeListener";
import { GradientBackground } from "../lib/components/client/RainbowBackground";
import { Footer } from "../lib/components/layout/Footer";
import { colorValidator } from "../lib/server/validation";
import "./globals.css";

const BG_THEMES = {
  light: [
    "oklch(95% 0.024 16)",
    "oklch(95% 0.024 160)",
    "oklch(95% 0.024 305)",
  ].map((c) => colorValidator.parse(c)),
  dark: [
    "oklch(20% 0.033 16)",
    "oklch(20% 0.033 160)",
    "oklch(20% 0.033 305)",
  ].map((c) => colorValidator.parse(c)),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/dark.js" type="text/javascript" />
      </head>
      <body className={`h-full font-body text-neutral-900 dark:text-white`}>
        <GradientBackground colors={BG_THEMES} className="flex h-full flex-col">
          {children}
          <Footer />
          <DarkModeListener />
        </GradientBackground>
      </body>
    </html>
  );
}
