import { Permanent_Marker } from "@next/font/google";
import { HTMLAttributes } from "react";

const headingFont = Permanent_Marker({ subsets: ["latin"], weight: ["400"] });

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
      className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${headingFont.className} ${className}`}
      {...rest}
    >
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
    <h1
      className={`font-bold text-2xl sm:text-4xl md:text-6xl ${headingFont.className} ${className}`}
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
      className={`font-bold text-xl sm:text-2xl md:text-2xl ${headingFont.className} ${className}`}
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
      className={`font-bold text-lg sm:text-xl md:text-xl ${headingFont.className} ${className}`}
      {...rest}
    >
      {children}
    </h3>
  );
}
