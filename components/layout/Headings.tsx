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
    <h1
      className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headings ${className}`}
      {...rest}
    >
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
    <h2
      className={`font-bold text-2xl sm:text-3xl md:text-4xl font-headings ${className}`}
      {...rest}
    >
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
    <h3
      className={`font-bold text-lg sm:text-xl md:text-xl font-headings ${className}`}
      {...rest}
    >
      {children}
    </h3>
  );
}
