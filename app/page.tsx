import { FlagForm } from "../components/FlagForm";
import FLAGS from "../data/flags";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FlagForm flags={FLAGS} />
    </main>
  );
}
