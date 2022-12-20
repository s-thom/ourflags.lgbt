import { CSSProperties, useMemo } from "react";
import { FlagMeta } from "../types/types";

function getGradientStops(colors: string[]): string {
  if (colors.length === 0) {
    return "transparent, transparent";
  }
  if (colors.length === 1) {
    colors.push(colors[0]!);
  }

  return colors.join(", ");
}

export function useGradientStops(flag: FlagMeta) {
  return useMemo(() => {
    const style = {
      "--gradient-light": getGradientStops(flag.background.light),
      "--gradient-dark": getGradientStops(
        flag.background.dark ?? flag.background.light
      ),
    } as CSSProperties;

    return {
      style,
    };
  }, [flag.background]);
}
