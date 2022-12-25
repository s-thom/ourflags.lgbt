import { PropsWithChildren } from "react";
import { useGradientStops } from "../../../lib/colors";
import { CategoryMeta } from "../../../types/types";
import { MajorHeading } from "../../layout/Headings";
import { Section } from "../../layout/Section";

export interface CategoryExcerptSectionProps extends PropsWithChildren {
  category: CategoryMeta;
  showName?: boolean;
}

export function CategoryExcerptSection({
  category,
  children,
  showName,
}: CategoryExcerptSectionProps) {
  const { style } = useGradientStops(category.background);

  return (
    <div
      className={`p-4 bg-gradient-to-br text-white gradient-light dark:gradient-dark shadow-inner`}
      style={style}
    >
      <Section className="flex gap-8 flex-col lg:flex-row items-center justify-center">
        <div className="w-full flex flex-col grow gap-1">
          {showName && <MajorHeading>{category.name}</MajorHeading>}
          {children && <div>{children}</div>}
        </div>
      </Section>
    </div>
  );
}
