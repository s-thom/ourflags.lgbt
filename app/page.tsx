import { FlagForm } from "../components/client/FlagForm";
import { Main } from "../components/layout/Main";
import FLAGS from "../data/meta";

export default function Home() {
  return (
    <Main>
      <FlagForm flags={FLAGS} />
    </Main>
  );
}
