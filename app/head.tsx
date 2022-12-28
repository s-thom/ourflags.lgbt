import { HeadTags } from "../lib/components/head";

export default function Head() {
  return (
    <HeadTags
      title={undefined}
      description="Share your pride with the world"
      path="/"
      flags={[]}
      overrideFaviconFlags="default"
      overrideOgFlags="all"
      ogImageStyle="title"
    />
  );
}
