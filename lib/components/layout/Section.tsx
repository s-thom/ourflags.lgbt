import { HTMLAttributes } from "react";

export function Section({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}
