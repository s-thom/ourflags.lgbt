import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { useGradientStops } from "../../../lib/colors";
import { COMMON_ASPECT_RATIO } from "../../../lib/flagSvg";
import { FlagMeta } from "../../../types/types";
import { MajorHeading } from "../../layout/Headings";
import { Section } from "../../layout/Section";

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
  showReadMore?: boolean;
}

export function FlagExcerptSection({
  flag,
  children,
  showReadMore,
}: FlagExcerptSectionProps) {
  const { style } = useGradientStops(flag);

  return (
    <div
      className={`p-4 bg-gradient-to-br from-blue-50 to-red-50 text-white [--tw-gradient-stops:var(--gradient-light)] dark:[--tw-gradient-stops:var(--gradient-dark)]`}
      style={style}
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
