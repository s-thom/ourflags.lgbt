import * as site from "../../../data/site";
import { getFlagData } from "../../../lib/getFlagData";

export default async function FlagsIdHead({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  return (
    <>
      <title>{`${data.meta.name} - ${site.name}`}</title>
    </>
  );
}
