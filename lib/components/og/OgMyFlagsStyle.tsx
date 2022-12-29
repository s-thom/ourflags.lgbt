import { FLAG_ASPECT_RATIO } from "../../constants";
import { getStripedFlagSvg } from "../../server/flagSvg";
import { FlagMeta, Size } from "../../types";

const MAX_FLAGS_IN_LIST = 4;
// TODO: Figure out how to derive from OG image size
const IMAGE_HEIGHT = 140;

function FlagItem({ flag }: { flag: FlagMeta }) {
  return (
    <div tw="px-2 flex h-full" style={{ flexBasis: "25%" }}>
      <div tw="flex flex-col text-white items-center text-center justify-between bg-neutral-100/10 border-neutral-200/50 rounded-xl border-2 shadow-xl p-4">
        {/* eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text */}
        <img
          src={`data:image/svg+xml,${encodeURIComponent(
            getStripedFlagSvg(flag.flag.stripes, flag.flag.additionalPaths)
          )}`}
          width={IMAGE_HEIGHT * FLAG_ASPECT_RATIO}
          height={IMAGE_HEIGHT}
        />
        <h2 tw="text-3xl">{flag.name}</h2>
      </div>
    </div>
  );
}

export interface OgMyFlagsStyleProps {
  flags: FlagMeta[];
  size: Size;
}

export function OgMyFlagsStyle({ flags }: OgMyFlagsStyleProps) {
  return (
    <div tw="flex flex-col text-white items-center h-full w-full">
      <h1 tw="flex justify-center items-baseline w-full">
        <span tw="font-bold text-8xl" style={{ fontFamily: "Headings" }}>
          My Flags
        </span>
        <span tw="font-bold text-6xl pl-8">are</span>
      </h1>
      <div tw="flex items-center justify-center grow w-full pt-8">
        {flags.length > MAX_FLAGS_IN_LIST
          ? flags
              .slice(0, MAX_FLAGS_IN_LIST - 1)
              .map((flag) => <FlagItem key={flag.id} flag={flag} />)
          : flags.map((flag) => <FlagItem key={flag.id} flag={flag} />)}
        {flags.length > MAX_FLAGS_IN_LIST && (
          <h2 tw="text-4xl pl-6">{`And ${
            flags.length - (MAX_FLAGS_IN_LIST - 1)
          } more...`}</h2>
        )}
      </div>
    </div>
  );
}
