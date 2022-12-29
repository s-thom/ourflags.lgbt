import { HeadTags } from "../../lib/components/head";
import { buildShareString, parseShareString } from "../../lib/shortcodes";

export default async function FlagsIdHead({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  return (
    <HeadTags
      title={`${flags.length} ${flags.length === 1 ? "flag" : "flags"}`}
      description="Share your pride with the world"
      path={`/${buildShareString(flags)}`}
      flags={flags}
      ogImageStyle="my-flags"
    />
  );
}
