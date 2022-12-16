import { FlagMeta } from "../types/types";

const FLAGS: FlagMeta[] = [
  {
    id: "test1",
    name: "Test One",
    shortcodes: ["t1"],
    colors: {
      light: ["#FF0000"],
      dark: ["#880000"],
    },
  },
  {
    id: "test2",
    name: "Test Two",
    shortcodes: ["t2"],
    colors: {
      light: ["#00FF00"],
      dark: ["#008800"],
    },
  },
  {
    id: "test3",
    name: "Test Three",
    shortcodes: ["t3"],
    colors: {
      light: ["#0000FF"],
      dark: ["#000088"],
    },
  },
];

export default FLAGS;
