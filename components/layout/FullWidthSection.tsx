import { HTMLAttributes } from "react";

export function FullWidthSection({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`${className}`} {...rest}>
      {children}
    </section>
  );
}
