import { HeadTags } from "../../components/head";

export default async function FlagsHead() {
  return (
    <HeadTags
      title="All flags"
      path="/flags"
      flags={[]}
      overrideFaviconFlags="default"
      overrideOgFlags="all"
      ogImageStyle="title"
    />
  );
}
