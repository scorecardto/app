import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useFeatureFlag } from "../../../lib/featureFlag";
import { RootState } from "../state/store";

function useIsDarkMode(): boolean {
  const { dark } = useTheme();
  const allowDarkMode = useFeatureFlag("ALLOW_DARK_MODE");

  return dark && allowDarkMode;
}

export default useIsDarkMode;
