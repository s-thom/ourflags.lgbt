// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { HeadTags } from "../../lib/components/head";
import { buildShareString, parseShareString } from "../../lib/shortcodes";

export default async function FlagsIdHead({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  return (
    <HeadTags
      title={`${flags.length} ${flags.length === 1 ? "flag" : "flags"}`}
      description="Share your pride with the world"
      path={`/${buildShareString(flags)}`}
      flags={flags}
      ogImageStyle="my-flags"
    />
  );
}
