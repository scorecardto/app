import type { Theme } from "./lib/Color";

declare module "@react-navigation/native" {
  export function useTheme(): Theme;

  export const NavigationContainer: <
    RootParamList extends {} = ReactNavigation.RootParamList
  >(
    props: NavigationContainerProps & {
      theme?: Theme | undefined;
      linking?: LinkingOptions<RootParamList>;
      fallback?: React.ReactNode;
      documentTitle?: DocumentTitleOptions | undefined;
      onReady?: (() => void) | undefined;
    } & {}
  ) => React.ReactElement;
}
