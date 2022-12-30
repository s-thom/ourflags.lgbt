// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export function trackEvent(type: string, name: string, data: {}) {
  if (typeof umami === "undefined") {
    // eslint-disable-next-line no-console
    console.debug("analytics event", { type, name, data });
    return;
  }

  umami.trackEvent(name, { type, ...data });
}
