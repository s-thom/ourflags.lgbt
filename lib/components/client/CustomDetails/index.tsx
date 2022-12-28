"use client";

import { Triangle } from "lucide-react";
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

const useEffectSafe =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface CustomDetailsProps extends PropsWithChildren {
  initialOpen?: boolean;
  label?: string;
  summary: ReactNode;
}

export function CustomDetails({
  summary,
  label,
  initialOpen,
  children,
}: CustomDetailsProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffectSafe(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const [isOpen, setIsOpen] = useState(initialOpen);
  const toggleOpen = useCallback(() => {
    setIsOpen((s) => !s);
  }, []);

  const open = !isMounted || isOpen;

  return (
    <div className={`group w-full basis-full ${open ? "open" : "closed"}`}>
      <div className="flex w-full basis-full items-center justify-start gap-4">
        <div className="shrink-0">
          {isMounted && (
            <button
              className="rounded-lg bg-neutral-200/50 p-2 dark:bg-neutral-800/50"
              aria-label={
                isOpen ? `Hide ${label ?? ""}` : `Show ${label ?? ""}`
              }
              onClick={toggleOpen}
            >
              <Triangle className="rotate-90	transition-transform group-[.open]:rotate-180" />
            </button>
          )}
        </div>
        {summary}
      </div>
      {open && <div className="pt-4">{children}</div>}
    </div>
  );
}
