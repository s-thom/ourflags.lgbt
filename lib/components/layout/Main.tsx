import { PropsWithChildren } from "react";

export function Main({ children, ...rest }: PropsWithChildren) {
  return (
    <main className="grow overflow-hidden pb-10 md:pb-20" {...rest}>
      {children}
    </main>
  );
}
