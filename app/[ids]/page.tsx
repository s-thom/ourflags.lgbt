import { FlagExcerptSection } from "../../components/both/FlagExcerptSection";
import { FullWidthSection } from "../../components/layout/FullWidthSection";
import { Main } from "../../components/layout/Main";
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
    <Main>
      <Section>hello world</Section>
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
    </Main>
  );
}
