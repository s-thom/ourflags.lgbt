import { PropsWithChildren } from "react";
import { CategoryExcerptSection } from "../../lib/components/both/CategoryExcerptSection";
import { getCategoryData } from "../../lib/server/getData";
import { renderMarkdownToReact } from "../../lib/server/remark";
import { CategoryMeta } from "../../lib/types";

export interface CategoryExcerptSectionProps extends PropsWithChildren {
  category: CategoryMeta;
}

export async function CategorySectionWithContent({
  category,
  children,
}: CategoryExcerptSectionProps) {
  const data = await getCategoryData(category.id);
  const excerpt = await renderMarkdownToReact(data.excerpt ?? "");

  return (
    <CategoryExcerptSection category={category} showName>
      <article className="prose prose-neutral dark:prose-invert md:prose-lg lg:prose-xl pb-4 sm:pb-5 md:pb-6">
        {excerpt}
      </article>
      {children}
    </CategoryExcerptSection>
  );
}
