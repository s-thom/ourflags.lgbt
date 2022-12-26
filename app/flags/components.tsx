import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { CustomDetails } from "../../components/client/CustomDetails";
import { MajorHeading } from "../../components/layout/Headings";
import { Section } from "../../components/layout/Section";
import { getThemedGradients } from "../../lib/colors";
import { COMMON_ASPECT_RATIO } from "../../lib/flagSvg";
import { getFlagData } from "../../lib/getData";
import { renderMarkdownToReact } from "../../lib/remark";
import { FlagMeta } from "../../types/types";

export interface FlagSummaryProps extends PropsWithChildren {
  flag: FlagMeta;
}

export async function FlagSummary({ flag, children }: FlagSummaryProps) {
  const data = await getFlagData(flag.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");
  const style = getThemedGradients(flag.background);

  return (
    <div
      className={`py-4 rounded-xl bg-gradient-to-br text-white gradient-light dark:gradient-dark shadow-inner`}
      style={style}
    >
      <Section className="flex gap-8 flex-col items-center justify-center">
        <CustomDetails
          summary={
            <>
              <div className="shrink-0">
                <Image
                  src={`/images/flags/${flag.id}_64.png`}
                  alt={flag.name}
                  height={64}
                  width={64 * COMMON_ASPECT_RATIO}
                  className="rounded-xl"
                />
              </div>
              <MajorHeading>{flag.name}</MajorHeading>
            </>
          }
        >
          <article className="prose prose-invert md:prose-lg lg:prose-xl">
            {excerpt}
          </article>
          <div className="prose prose-neutral dark:prose-invert">
            <Link
              href={`/flags/${flag.id}`}
              className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
            >
              Read more…
            </Link>
          </div>
          {children}
        </CustomDetails>
      </Section>
    </div>
  );
}
