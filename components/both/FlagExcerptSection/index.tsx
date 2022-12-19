import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useMemo } from "react";
import { COMMON_ASPECT_RATIO } from "../../../lib/flagSvg";
import { FlagMeta } from "../../../types/types";
import { MajorHeading } from "../../layout/Headings";
import { Section } from "../../layout/Section";

function getGradientForColors(colors: string[]): {
  from: string;
  to: string;
  via?: string;
} {
  const clone = Array.from(colors);
  let from: string;
  let to: string;
  let via: string | undefined;

  if (clone.length === 0) {
    from = "transparent";
    to = "transparent";
    via = "transparent";
  }
  if (clone.length === 1) {
    from = clone[0]!;
    to = clone[0]!;
  } else {
    from = clone.shift()!;
    to = clone.pop()!;
    via = clone.shift();
  }

  return { to, from, via };
}

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
  showReadMore?: boolean;
}

export function FlagExcerptSection({
  flag,
  children,
  showReadMore,
}: FlagExcerptSectionProps) {
  const style = useMemo(() => {
    const colors = getGradientForColors(flag.background);

    return {
      "--tw-gradient-from": colors.from,
      "--tw-gradient-to": colors.to,
      "--tw-gradient-via": colors.via,
      "--tw-gradient-stops": colors.via
        ? "var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)"
        : "var(--tw-gradient-from), var(--tw-gradient-to)",
    };
  }, [flag.background]);

  return (
    <div
      className="p-4 bg-gradient-to-br via-transparent text-white"
      style={style as any}
    >
      <Section className="flex gap-1 flex-col lg:flex-row">
        <div className="shrink-0">
          <Image
            src={`/images/flags/${flag.id}_128.png`}
            alt={flag.name}
            height={128}
            width={128 * COMMON_ASPECT_RATIO}
          />
        </div>
        <div className="flex flex-col gap-1">
          <MajorHeading>{flag.name}</MajorHeading>
          {children}
          {showReadMore && (
            <Link href={`/flags/${flag.id}`} className="underline">
              Read more…
            </Link>
          )}
        </div>
      </Section>
    </div>
  );
}
