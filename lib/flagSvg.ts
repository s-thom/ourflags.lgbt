import { range, template } from "./utils";

export const COMMON_ASPECT_RATIO = 3 / 2;
export const HEIGHT = 840; // Least common multiple of 3, 5, 7, and 8 so we have integers when building paths
export const WIDTH = HEIGHT * COMMON_ASPECT_RATIO;

const WRAPPER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
{{content}}
{{additionalPaths}}
</svg>
`.trim();

function getHeight(index: number, numStripes: number): number {
  return index * (HEIGHT / numStripes);
}

function getRectPathData(index: number, numStripes: number) {
  const start = getHeight(index, numStripes);
  const end = getHeight(index + 1, numStripes);
  return `M0,${start} L0,${end} ${WIDTH},${end} ${WIDTH},${start}z`;
}

function getEqualPaths(numStripes: number) {
  return range(numStripes)
    .map(
      (i) =>
        `<path fill="{{color${i}}}" d="${getRectPathData(i, numStripes)}" />`
    )
    .join("\n");
}

function getStripedFlagTemplate(numStripes: number) {
  return template(WRAPPER, { content: getEqualPaths(numStripes) });
}

const flagEntries = range(8, 1).map((n): [number, string] => [
  n,
  getStripedFlagTemplate(n),
]);
const STRIPED_FLAG_TEMPLATES = Object.fromEntries(flagEntries);

export function getStripedFlagSvg(
  stripeColors: string[],
  additionalPaths = ""
): string {
  const flagTemplate = STRIPED_FLAG_TEMPLATES[stripeColors.length];
  if (!flagTemplate) {
    throw new Error(
      `No template for flags with ${stripeColors.length} stripes`
    );
  }

  const colorValues = Object.fromEntries(
    Object.entries(stripeColors).map(([index, value]) => [
      `color${index}`,
      value,
    ])
  );

  return template(flagTemplate, { additionalPaths, ...colorValues });
}
