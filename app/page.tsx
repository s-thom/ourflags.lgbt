import { FlagForm } from "../components/client/FlagForm";
import FLAGS from "../data/meta";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FlagForm flags={FLAGS} />
    </main>
  );
}
