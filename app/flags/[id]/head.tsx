import { HeadTags } from "../../../components/head";
import { getFlagData } from "../../../lib/getData";

export default async function FlagsIdHead({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  return (
    <HeadTags
      title={data.meta.name}
      description="Share your pride with the world"
      path={`/flags/${params.id}`}
      flags={[data.meta]}
    />
  );
}
