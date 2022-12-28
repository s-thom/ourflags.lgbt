import { PropsWithChildren } from "react";
import { useGradientStops } from "../../../colors";
import { CategoryMeta } from "../../../types";
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
      className={`gradient-light dark:gradient-dark bg-gradient-to-br p-4 shadow-inner`}
      style={style}
    >
      <Section className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="flex w-full grow flex-col gap-1">
          {showName && <MajorHeading>{category.name}</MajorHeading>}
          {children && <div>{children}</div>}
        </div>
      </Section>
    </div>
  );
}
