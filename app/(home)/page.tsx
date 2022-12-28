import { FullWidthSection } from "../../lib/components/layout/FullWidthSection";
import {
  MajorHeading,
  PageHeading,
} from "../../lib/components/layout/Headings";
import { Section } from "../../lib/components/layout/Section";
import {
  FlagFormList,
  FlagFormReorder,
  LinkFormContext,
  LinkFormShare,
} from "../../lib/components/link-form";
import { CATEGORIES } from "../../lib/data/categories/categories";
import { FLAGS } from "../../lib/data/flags/flags";
import { CategorySectionWithContent } from "./components";

export default function Home() {
  return (
    <div>
      <Section className="text-center py-8 sm:py-12 md:py-16">
        <PageHeading>Select your flags</PageHeading>
        <MajorHeading>and get a link to share with the world</MajorHeading>
      </Section>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 pb-2 md:pb-4">
        <LinkFormContext>
          <Section className="text-center">
            <LinkFormShare />
          </Section>
          <Section>
            <FlagFormReorder />
          </Section>
          {CATEGORIES.map((category) => (
            <FullWidthSection key={category.id}>
              {/* CategorySectionWithContent is an async server component, but
                Typescript doesn't know that. */}
              {/* @ts-expect-error */}
              <CategorySectionWithContent category={category}>
                <FlagFormList
                  flags={FLAGS.filter((flag) =>
                    flag.categories.includes(category.id)
                  )}
                />
              </CategorySectionWithContent>
            </FullWidthSection>
          ))}
          <Section className="text-center">
            <LinkFormShare />
          </Section>
        </LinkFormContext>
      </div>
    </div>
  );
}
