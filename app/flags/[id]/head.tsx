import { CommonHead } from "../../../components/head/common";
import { Favicons } from "../../../components/head/favicons";
import { getFlagData } from "../../../lib/getData";

export default async function FlagsIdHead({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  return (
    <>
      <CommonHead path={`/flags/${params.id}`} title={data.meta.name} />
      <Favicons flags={[data.meta]} />
    </>
  );
}
