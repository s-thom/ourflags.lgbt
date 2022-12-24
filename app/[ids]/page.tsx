import Link from "next/link";
import { notFound } from "next/navigation";
import { FlagExcerptSection } from "../../components/both/FlagExcerptSection";
import { FullWidthSection } from "../../components/layout/FullWidthSection";
import { PageHeading } from "../../components/layout/Headings";
import { Section } from "../../components/layout/Section";
import { getFlagData } from "../../lib/getFlagData";
import { renderMarkdownToReact } from "../../lib/remark";
import { parseShareString } from "../../lib/shortcodes";
import { pmap } from "../../lib/utils";

export default async function FlagsIdPage({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  if (flags.length === 0) {
    notFound();
  }

  return (
    <>
      <Section className="py-8 sm:py-12 md:py-16">
        <PageHeading className="text-center">My flags are</PageHeading>
      </Section>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 pb-2 md:pb-4">
        {await pmap(flags, async (flag) => {
          const data = await getFlagData(flag.id);
          const excerpt = await renderMarkdownToReact(data.excerpt ?? "");
          return (
            <FullWidthSection key={data.meta.id}>
              <FlagExcerptSection
                flag={data.meta}
                showFlag
                showName
                showReadMore
              >
                <article className="prose prose-invert md:prose-lg lg:prose-xl">
                  {excerpt}
                </article>
              </FlagExcerptSection>
            </FullWidthSection>
          );
        })}
      </div>

      <Section>
        <p>
          Like what you see?{" "}
          <Link
            href="/"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            Create your own page
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
