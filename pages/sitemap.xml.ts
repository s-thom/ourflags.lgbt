// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { stripIndent } from "common-tags";
import type { GetServerSidePropsContext } from "next";
import { BASE_URL } from "../lib/constants";
import { FLAGS } from "../lib/data/flags/flags";

function generateUrl(url: string): string {
  return stripIndent`
    <url>
      <loc>${url}</loc>
    </url>
  `;
}

function generateSitemap(): string {
  const urls = ([] as string[]).concat(
    [BASE_URL, `${BASE_URL}/flags`, `${BASE_URL}/my-flags`],
    FLAGS.map((flag) => `${BASE_URL}/flags/${flag.id}`)
  );

  return stripIndent`
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${urls.map((url) => generateUrl(url)).join("\n")}
    </urlset>
    </xml>
  `;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const sitemap = generateSitemap();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  // Empty, as response is sent in `getServerSideProps`
}
