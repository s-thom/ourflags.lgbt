import { ReactNode } from "react";
import { FlagMeta, Size } from "../../types";
import { OgMyFlagsStyle } from "./OgMyFlagsStyle";
import { OgTitleStyle } from "./OgTitleStyle";
import { TiledBackground } from "./TiledBackground";

export interface OgImageProps {
  flags: FlagMeta[];
  size: Size;
  style: string;
}

export function OgImage({ flags, size, style }: OgImageProps) {
  let children: ReactNode;
  switch (style) {
    case "my-flags":
      children = <OgMyFlagsStyle flags={flags} size={size} />;
      break;
    case "single":
    case "title":
    default:
      children = <OgTitleStyle />;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        position: "relative",
        fontFamily: "Body",
      }}
    >
      <TiledBackground flags={flags} size={size} />
      <div tw="absolute top-0 left-0 bg-black/80 w-full h-full" />
      <div tw="flex w-full h-full py-16 px-24">{children}</div>
    </div>
  );
}
