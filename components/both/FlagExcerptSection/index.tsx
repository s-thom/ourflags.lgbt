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
  showName?: boolean;
  showFlag?: boolean;
  showReadMore?: boolean;
}

export function FlagExcerptSection({
  flag,
  children,
  showFlag,
  showName,
  showReadMore,
}: FlagExcerptSectionProps) {
  const { style } = useGradientStops(flag.background);

  return (
    <div
      className={`p-4 bg-gradient-to-br text-white gradient-light dark:gradient-dark shadow-inner`}
      style={style}
    >
      <Section className="flex gap-8 flex-col lg:flex-row items-center justify-center">
        {showFlag && (
          <div className="shrink-0 lg:self-start">
            <Image
              src={`/images/flags/${flag.id}_128.png`}
              alt={flag.name}
              height={128}
              width={128 * COMMON_ASPECT_RATIO}
              className="rounded-xl"
            />
          </div>
        )}
        <div className="w-full flex flex-col grow gap-1">
          {showName && <MajorHeading>{flag.name}</MajorHeading>}
          {children && <div>{children}</div>}
          {showReadMore && (
            <div className="prose prose-neutral dark:prose-invert">
              <Link
                href={`/flags/${flag.id}`}
                className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
              >
                Read more…
              </Link>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
