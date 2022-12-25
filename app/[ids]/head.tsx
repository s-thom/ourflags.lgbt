import { CommonHead } from "../../components/head/common";
import { Favicons } from "../../components/head/favicons";
import { buildShareString, parseShareString } from "../../lib/shortcodes";

export default async function FlagsIdHead({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  return (
    <>
      <CommonHead
        path={`/${buildShareString(flags)}`}
        title={`${flags.length} ${flags.length === 1 ? "flag" : "flags"}`}
      />
      <Favicons flags={flags} />
    </>
  );
}
