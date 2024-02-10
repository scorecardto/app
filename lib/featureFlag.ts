import { Platform } from "react-native";
import UserRankType from "./types/UserRankType";

type FeatureFlag = "SHOW_CUSTOMIZE_CARD";

function getShowCustomizeCardFlag(userRank: UserRankType): boolean {
  const inDeveloperMode = __DEV__;
  if (userRank !== "DEFAULT" || Platform.OS === "android" || !inDeveloperMode) {
    return false;
  }
  return true;
}

function getFeatureFlag(flag: FeatureFlag, userRank: UserRankType): boolean {
  switch (flag) {
    case "SHOW_CUSTOMIZE_CARD":
      return getShowCustomizeCardFlag(userRank);
    default:
      return false;
  }
}

export { getFeatureFlag, FeatureFlag };
