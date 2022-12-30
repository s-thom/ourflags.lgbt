// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

declare const umami: Umami.umami | undefined;

// Based on https://umami.is/docs/tracker-functions
declare namespace Umami {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface umami {
    (eventValue: string): void;
    trackEvent(
      eventName: string,
      eventData?: unknown,
      url?: string,
      websiteId?: string
    ): void;
    trackView(url: string, referrer?: string, websiteId?: string): void;
  }
}
