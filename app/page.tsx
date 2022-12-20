import { FlagForm } from "../components/client/FlagForm";
import FLAGS from "../data/meta";

export default function Home() {
  return (
    <>
      <FlagForm flags={FLAGS} />
    </>
  );
}
