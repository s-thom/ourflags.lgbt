import { CommonHead } from "../../components/head/common";
import { Favicons } from "../../components/head/favicons";

export default async function FlagsHead() {
  return (
    <>
      <CommonHead path="/flags" title="All flags" />
      <Favicons flags={[]} />
    </>
  );
}
