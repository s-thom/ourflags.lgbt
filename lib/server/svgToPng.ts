// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Resvg } from "@resvg/resvg-js";

export function svgToPng(svg: string, height: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "height", value: height },
  });

  const data = resvg.render();
  const buffer = data.asPng();

  return buffer;
}
