import { HTMLAttributes } from "react";

export function FullWidthSection({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <div className={`${className}`} {...rest}>
      {children}
    </div>
  );
}
