import { Inter, Permanent_Marker } from "@next/font/google";

const body = Inter({ subsets: ["latin"] });
const headings = Permanent_Marker({ subsets: ["latin"], weight: ["400"] });

export const FONT_FAMILIES = {
  body,
  headings,
};
