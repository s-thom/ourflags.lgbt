export interface FlagMeta {
  id: string;
  name: string;
  shortcodes: string[];
  colors: {
    light: string[];
    dark: string[];
  };
}

export interface FlagData {
  content: string;
  excerpt?: string;
  meta: FlagMeta;
}
