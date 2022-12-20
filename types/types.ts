export interface FlagMeta {
  id: string;
  name: string;
  shortcodes: string[];
  flag: {
    stripes: string[];
    additionalPaths?: string;
  };
  background: {
    light: string[];
    dark?: string[];
  };
}

export interface FlagData {
  content: string;
  excerpt?: string;
  meta: FlagMeta;
}

export interface Point2 {
  x: number;
  y: number;
}
