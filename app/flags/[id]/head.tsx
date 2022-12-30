// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { HeadTags } from "../../../lib/components/head";
import { getFlagData } from "../../../lib/server/getData";

export default async function FlagsIdHead({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  return (
    <HeadTags
      title={data.meta.name}
      description="Share your pride with the world"
      path={`/flags/${params.id}`}
      flags={[data.meta]}
      ogImageStyle="single"
    />
  );
}
