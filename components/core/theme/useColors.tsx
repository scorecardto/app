import Color, { Theme } from "../../../lib/Color";
import useIsDarkMode from "./useIsDarkMode";

function useColors(): Theme["colors"] {
  const dark = useIsDarkMode();

  return (dark ? Color.DarkTheme : Color.LightTheme).colors;
}

export default useColors;
