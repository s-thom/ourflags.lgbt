import Link from "next/link";
import { Goose } from "../client/Goose";

export function Footer() {
  return (
    <footer className="flex flex-row items-center justify-between p-2 mx-auto max-w-7xl w-full self-end text-sm">
      <div className="text-sm">
        Created by{" "}
        <Link
          href="https://sthom.kiwi"
          rel="external"
          className="underline decoration-dotted hover:decoration-solid"
        >
          Stuart Thomson
        </Link>
      </div>
      <div>Currently closed source. TODO: </div>
      <Goose />
    </footer>
  );
}
