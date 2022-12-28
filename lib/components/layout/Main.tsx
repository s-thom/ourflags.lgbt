import { PropsWithChildren } from "react";

export function Main({ children, ...rest }: PropsWithChildren) {
  return (
    <main className="pb-10 md:pb-20 overflow-hidden grow" {...rest}>
      {children}
    </main>
  );
}
