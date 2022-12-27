import { PropsWithChildren } from "react";
import { FlagExcerptSection } from "../../components/both/FlagExcerptSection";
import { getFlagData } from "../../lib/getData";
import { renderMarkdownToReact } from "../../lib/remark";
import { FlagMeta } from "../../types/types";

export interface FlagExcerptSectionProps extends PropsWithChildren {
  flag: FlagMeta;
}

export async function FlagSectionWithContent({
  flag,
  children,
}: FlagExcerptSectionProps) {
  const data = await getFlagData(flag.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");

  return (
    <FlagExcerptSection flag={flag} showFlag showName showReadMore>
      <article className="prose prose-neutral dark:prose-invert md:prose-lg lg:prose-xl">
        {excerpt}
      </article>
      {children}
    </FlagExcerptSection>
  );
}
