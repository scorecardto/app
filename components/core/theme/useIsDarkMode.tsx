import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getFeatureFlag } from "../../../lib/featureFlag";
import { RootState } from "../state/store";

function useIsDarkMode(): boolean {
  const { dark } = useTheme();
  const allowDarkMode = useSelector((r: RootState) =>
    getFeatureFlag("ALLOW_DARK_MODE", r.userRank.type)
  );

  return dark && allowDarkMode;
}

export default useIsDarkMode;
