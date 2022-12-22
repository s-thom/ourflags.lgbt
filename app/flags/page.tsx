import { PageHeading } from "../../components/layout/Headings";
import { Main } from "../../components/layout/Main";
import { Section } from "../../components/layout/Section";
import FLAGS from "../../data/meta";

export default async function FlagsListPage() {
  return (
    <Main>
      <Section>
        <PageHeading>TODO:</PageHeading>
      </Section>
      <Section>
        {FLAGS.map((flag) => (
          <div key={flag.id}>{flag.name}</div>
        ))}
      </Section>
    </Main>
  );
}
