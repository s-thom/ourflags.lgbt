import * as site from "../../../data/site";
import { getFlagData } from "../../../lib/getData";

export default async function FlagsIdHead({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  return (
    <>
      <title>{`${data.meta.name} - ${site.name}`}</title>
      <link
        href={`/images/favicons/${params.id}_32.png`}
        rel="shortcut icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href={`/images/favicons/${params.id}_128.png`}
        rel="shortcut icon"
        sizes="128x128"
        type="image/png"
      />
      <link
        href={`/images/favicons/${params.id}_192.png`}
        rel="shortcut icon"
        sizes="192x192"
        type="image/png"
      />
    </>
  );
}
