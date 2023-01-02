// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";
import { ThemeSelector } from "../../lib/components/client-only/ThemeSelector";
import { Main } from "../../lib/components/layout/Main";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="absolute top-2 right-2">
        <ThemeSelector />
      </header>
      <Main>{children}</Main>
    </>
  );
}
