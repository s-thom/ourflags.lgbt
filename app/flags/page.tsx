import { PageHeading } from "../../components/layout/Headings";
import { Section } from "../../components/layout/Section";
import { FLAGS } from "../../data/flags/flags";
import { FlagSummary } from "./components";

export default async function FlagsListPage() {
  return (
    <>
      <Section className="py-8 sm:py-12 md:py-16">
        <PageHeading className="text-center">All flags</PageHeading>
      </Section>
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[masonry] gap-4 md:gap-6 lg:gap-8">
          {FLAGS.map((flag) => (
            <div key={flag.id} className="basis-1/3">
              {/* FlagSummary is an async server component, but
                Typescript doesn't know that. */}
              {/* @ts-expect-error */}
              <FlagSummary flag={flag}></FlagSummary>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
