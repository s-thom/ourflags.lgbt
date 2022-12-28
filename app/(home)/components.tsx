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
      <article className="prose prose-neutral pb-4 dark:prose-invert sm:pb-5 md:prose-lg md:pb-6 lg:prose-xl">
        {excerpt}
      </article>
      {children}
    </CategoryExcerptSection>
  );
}
