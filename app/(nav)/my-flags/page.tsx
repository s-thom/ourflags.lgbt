// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PageHeading } from "../../../lib/components/layout/Headings";
import { Section } from "../../../lib/components/layout/Section";
import {
  FlagFormList,
  FlagFormReorder,
  LinkFormContext,
  LinkFormShare,
} from "../../../lib/components/link-form";
import { CATEGORIES } from "../../../lib/data/categories/categories";
import { FLAGS } from "../../../lib/data/flags/flags";
import { CategorySectionWithContent } from "./components";

export default function LinkFormPage() {
  return (
    <div>
      <Section className="py-8 text-center sm:py-12 md:py-16">
        <PageHeading>Select your flags</PageHeading>
        <p className="font-body text-2xl sm:text-3xl md:text-4xl">
          and get a link to share who you are
        </p>
      </Section>
      <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4 lg:gap-8">
        <LinkFormContext>
          <Section className="text-center">
            <LinkFormShare />
          </Section>
          <Section className="text-center">
            <FlagFormReorder />
          </Section>
          {CATEGORIES.map((category) => (
            // CategorySectionWithContent is an async server component, but
            // Typescript doesn't know that.
            // @ts-expect-error
            <CategorySectionWithContent key={category.id} category={category}>
              <FlagFormList
                flags={FLAGS.filter((flag) =>
                  flag.categories.includes(category.id)
                )}
              />
            </CategorySectionWithContent>
          ))}
          <Section className="text-center">
            <LinkFormShare />
          </Section>
        </LinkFormContext>
      </div>
    </div>
  );
}