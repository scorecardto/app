import { useContext } from "react";
import Color, { Theme } from "../../../lib/Color";
import useIsDarkMode from "./useIsDarkMode";
import { PageThemeContext } from "../context/PageThemeContext";

function useColors(): Theme["colors"] {
  const pageTheme = useContext(PageThemeContext);
  const dark = useIsDarkMode();

  return {
    ...(dark ? Color.DarkTheme : Color.LightTheme).colors,
    ...(dark ? pageTheme?.dark : pageTheme?.default),
  };
}

export default useColors;
