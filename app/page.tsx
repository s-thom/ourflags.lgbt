import { FlagForm } from "../components/client/FlagForm";
import { FLAGS } from "../data/flags/flags";

export default function Home() {
  return (
    <>
      <FlagForm flags={FLAGS} />
    </>
  );
}
