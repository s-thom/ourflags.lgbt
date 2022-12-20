import Link from "next/link";
import { NavigationHeading } from "./Headings";
import { Section } from "./Section";

export function Header() {
  return (
    <header className="w-full relative">
      <div className="bg-white opacity-20 w-full h-full absolute z-0" />
      <Section className="flex justify-between items-center relative z-1">
        <Link href="/">
          <NavigationHeading>MyFlags.lgbt</NavigationHeading>
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/flags">All Flags</Link>
            </li>
            {/* TODO: GitHub link */}
          </ul>
        </nav>
      </Section>
    </header>
  );
}
