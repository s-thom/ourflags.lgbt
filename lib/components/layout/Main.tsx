// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PropsWithChildren } from "react";

export function Main({ children, ...rest }: PropsWithChildren) {
  return (
    <main className="grow overflow-hidden pb-10 md:pb-20" {...rest}>
      {children}
    </main>
  );
}
