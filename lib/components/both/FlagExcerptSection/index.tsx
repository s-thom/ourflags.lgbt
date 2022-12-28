import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { useGradientStops } from "../../../colors";
import { FLAG_ASPECT_RATIO } from "../../../constants";
import { FlagMeta } from "../../../types";
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
      className={`gradient-light dark:gradient-dark bg-gradient-to-br p-4 shadow-inner`}
      style={style}
    >
      <Section className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        {showFlag && (
          <div className="shrink-0 lg:self-start">
            <Image
              src={`/images/flags/${flag.id}_128.png`}
              alt={flag.name}
              height={128}
              width={128 * FLAG_ASPECT_RATIO}
              className="rounded-xl"
            />
          </div>
        )}
        <div className="flex w-full grow flex-col gap-1">
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
