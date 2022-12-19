import { HTMLAttributes } from "react";

/**
 * The most important heading on the page. May not appear on every page
 */
export function PageHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h1 className={`font-bold text-2xl ${className}`} {...rest}>
      {children}
    </h1>
  );
}

/**
 * A visually smaller heading to use within navigation
 */
export function NavigationHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h1 className={`${className}`} {...rest}>
      {children}
    </h1>
  );
}

/**
 * A top-level heading
 */
export function MajorHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h2 className={`font-bold text-xl ${className}`} {...rest}>
      {children}
    </h2>
  );
}

/**
 * A less important heading
 */
export function MinorHeading({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <h3 className={`font-bold text-lg ${className}`} {...rest}>
      {children}
    </h3>
  );
}
