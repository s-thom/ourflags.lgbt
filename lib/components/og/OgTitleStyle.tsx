import { BASE_URL, SITE_NAME } from "../../constants";

export function OgTitleStyle() {
  return (
    <div tw="flex flex-col text-white justify-center items-center h-full w-full">
      <h1 tw="font-bold text-9xl" style={{ fontFamily: "Headings" }}>
        {SITE_NAME}
      </h1>
      <p tw="text-3xl">Share your pride with the world</p>
      <p tw="text-xl border-b-2 border-dotted border-white">{BASE_URL}</p>
    </div>
  );
}
