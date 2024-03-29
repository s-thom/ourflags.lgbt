// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Metadata } from "next";
import {
  FlagFormList,
  FlagFormReorder,
  LinkFormContext,
  LinkFormShare,
} from "../../../lib/components/client-only/link-form";
import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import { CATEGORIES } from "../../../lib/data/categories/categories";
import { FLAGS } from "../../../lib/data/flags/flags";
import { getHeadMetadata } from "../../../lib/server/head";
import { CategorySectionWithContent } from "./components";

export async function generateMetadata(): Promise<Metadata> {
  return getHeadMetadata({
    description: "These are our flags, and we fly them with pride",
    path: "/my-flags",
    flags: [],
    overrideFaviconFlags: "default",
    overrideOgFlags: "all",
    ogImageStyle: "title",
  });
}

export default function LinkFormPage() {
  return (
    <>
      <Section className="py-8 text-center sm:py-12 md:py-16">
        <PageHeading>Select your flags</PageHeading>
        <p className="font-body text-2xl sm:text-3xl md:text-4xl">
          and get a link to share who you are
        </p>
      </Section>
      <LinkFormContext>
        <Section className="text-center">
          <LinkFormShare />
        </Section>
        <Section className="text-center">
          <FlagFormReorder />
        </Section>
        {CATEGORIES.map((category) => (
          <CategorySectionWithContent key={category.id} category={category}>
            <FlagFormList
              flags={FLAGS.filter((flag) =>
                flag.categories.includes(category.id),
              )}
            />
          </CategorySectionWithContent>
        ))}
        <Section className="text-center">
          <LinkFormShare />
        </Section>
      </LinkFormContext>
    </>
  );
}
