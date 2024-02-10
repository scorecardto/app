import useAccentLabel from "./useAccentLabel";
import color, { Theme } from "../../../lib/Color";
import useIsDarkMode from "./useIsDarkMode";

function useAccents(): Theme["accents"] {
  const label = useAccentLabel();
  const dark = useIsDarkMode();

  const accents = color.AccentsMatrix[label][dark ? "dark" : "default"];

  return accents;
}

export default useAccents;
