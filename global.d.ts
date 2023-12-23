import type { Theme } from "./lib/Color";

declare module "@react-navigation/native" {
  export function useTheme(): Theme;
}
