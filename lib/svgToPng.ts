import { Resvg } from "@resvg/resvg-js";

export function svgToPng(svg: string, height: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "height", value: height },
  });

  const data = resvg.render();
  const buffer = data.asPng();

  return buffer;
}
