import { PropsWithChildren } from "react";

export function Main({
  className = "",
  children,
  ...rest
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <main
      className={`mb-20 space-y-5 overflow-hidden sm:pt-32 sm:mb-32 sm:space-y-32 md:pt-40 md:mb-40 md:space-y-10 ${className}`}
      {...rest}
    >
      {children}
    </main>
  );
}
