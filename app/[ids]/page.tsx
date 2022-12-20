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

  return (
    <>
      <Section>
        <PageHeading className="text-center">My flags</PageHeading>
      </Section>
      {await pmap(flags, async (flag) => {
        const data = await getFlagData(flag.id);
        const excerpt = await renderMarkdownToReact(data.excerpt ?? "");
        return (
          <FullWidthSection key={data.meta.id}>
            <FlagExcerptSection flag={data.meta} showReadMore>
              {excerpt}
            </FlagExcerptSection>
          </FullWidthSection>
        );
      })}
    </>
  );
}
