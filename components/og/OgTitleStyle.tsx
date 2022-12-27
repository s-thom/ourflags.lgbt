import * as site from "../../data/site";

export function OgTitleStyle() {
  return (
    <div tw="flex flex-col gap-4 text-white items-center">
      <h1 tw="font-bold text-9xl" style={{ fontFamily: "Headings" }}>
        {site.name}
      </h1>
      <p tw="text-3xl">Share your pride with the world</p>
      <p tw="text-xl border-b-2 border-dotted border-white">{site.baseUrl}</p>
    </div>
  );
}
