// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { BASE_URL, SITE_NAME } from "../../constants";

export function OgTitleStyle() {
  return (
    <div tw="flex flex-col text-white justify-center items-center h-full w-full">
      <h1 tw="flex flex-col justify-center items-center">
        <span tw="text-7xl">These are</span>
        <span tw="text-9xl -pt-12 -mt-12" style={{ fontFamily: "Headings" }}>
          {SITE_NAME}
        </span>
      </h1>
      <p tw="flex justify-center items-center">
        <span tw="text-4xl pt-4">and we fly them with </span>
        <span tw="text-4xl pl-3" style={{ fontFamily: "Headings" }}>
          pride
        </span>
      </p>
      <p tw="text-xl border-b-2 pt-16 border-dotted border-white">{BASE_URL}</p>
    </div>
  );
}
