import { CommonHead } from "../components/head/common";
import { Favicons } from "../components/head/favicons";
import * as site from "../data/site";

export default function Head() {
  return (
    <>
      <CommonHead path="/" title={undefined} />
      <title>{site.name}</title>
      <meta name="description" content="Share your pride with the world" />
      <Favicons flags={[]} />
    </>
  );
}
