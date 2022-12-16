export interface FlagMeta {
  id: string;
  name: string;
  shortcodes: string[];
  colors: {
    light: string[];
    dark: string[];
  };
}
