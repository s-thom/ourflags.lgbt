import { FlagExcerptSection } from "../../../components/both/FlagExcerptSection";
import { FullWidthSection } from "../../../components/layout/FullWidthSection";
import { PageHeading } from "../../../components/layout/Headings";
import { Main } from "../../../components/layout/Main";
import { Section } from "../../../components/layout/Section";
import { FLAGS } from "../../../data/meta";
import { getFlagData } from "../../../lib/getFlagData";
import { renderMarkdownToReact } from "../../../lib/remark";

export default async function FlagsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  const pageContent = await renderMarkdownToReact(data.content);

  return (
    <Main>
      <FullWidthSection className="pb-2 md:pb-4">
        <FlagExcerptSection flag={data.meta} showFlag>
          <PageHeading className="text-center">{data.meta.name}</PageHeading>
        </FlagExcerptSection>
      </FullWidthSection>
      <Section>{pageContent}</Section>
    </Main>
  );
}

export async function generateStaticParams() {
  return FLAGS.map((flag) => ({
    id: flag.id,
  }));
}
