// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { HeadTags } from "../../../lib/components/head";

export default async function FlagsHead() {
  return (
    <HeadTags
      title="All flags"
      description="These are our flags, and we fly them with pride"
      path="/flags"
      flags={[]}
      overrideFaviconFlags="default"
      overrideOgFlags="all"
      ogImageStyle="title"
    />
  );
}
