import { Platform } from "react-native";
import UserRank from "./types/UserRank";

type FeatureFlag = "SHOW_CUSTOMIZE_CARD";

function getShowCustomizeCardFlag(userRank: UserRank): boolean {
  const inDeveloperMode = __DEV__;
  if (userRank !== "DEFAULT" || Platform.OS === "android" || !inDeveloperMode) {
    return false;
  }
  return true;
}

function getFeatureFlag(flag: FeatureFlag, userRank: UserRank): boolean {
  switch (flag) {
    case "SHOW_CUSTOMIZE_CARD":
      return getShowCustomizeCardFlag(userRank);
    default:
      return false;
  }
}

export { getFeatureFlag, FeatureFlag };
