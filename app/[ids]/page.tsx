import Link from "next/link";
import { notFound } from "next/navigation";
import { FullWidthSection } from "../../components/layout/FullWidthSection";
import { PageHeading } from "../../components/layout/Headings";
import { Section } from "../../components/layout/Section";
import { FONT_FAMILIES } from "../../lib/fonts";
import { parseShareString } from "../../lib/shortcodes";
import { FlagSectionWithContent } from "./components";

export default async function IdsPage({ params }: { params: { ids: string } }) {
  const flags = parseShareString(params.ids);

  if (flags.length === 0) {
    notFound();
  }

  return (
    <>
      <Section className="py-8 sm:py-12 md:py-16">
        <PageHeading className="text-center">
          <Link
            href="/about"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            My flags
          </Link>{" "}
          <span className={`${FONT_FAMILIES.body.className}`}>are</span>
        </PageHeading>
      </Section>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 pb-2 md:pb-4">
        {flags.map((flag) => {
          return (
            <FullWidthSection key={flag.id}>
              {/* FlagSectionWithContent is an async server component, but
                  Typescript doesn't know that. */}
              {/* @ts-expect-error */}
              <FlagSectionWithContent flag={flag} />
            </FullWidthSection>
          );
        })}
      </div>
    </>
  );
}
