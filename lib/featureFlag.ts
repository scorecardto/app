import { Platform } from "react-native";
import UserRankType from "./types/UserRankType";
import { store } from "../components/core/state/store";

type FeatureFlag =
  | "GIVE_VIP_FEATURES"
  | "SHOW_CUSTOMIZE_CARD"
  | "ALLOW_COURSE_EDITING"
  | "ALLOW_DARK_MODE";

function getGiveVipFeaturesFlag(userRank: UserRankType): boolean {
  const inDeveloperMode = __DEV__;
  const numInvitedNumbers =
    store.getState().invitedNumbers.numbers?.length ?? 0;

  if (
    userRank !== "DEFAULT" ||
    Platform.OS === "android" ||
    numInvitedNumbers >= 2 ||
    !inDeveloperMode
  ) {
    return true;
  }
  return false;
}

const getShowCustomizeCardFlag = (userRank: UserRankType): boolean => {
  return !getGiveVipFeaturesFlag(userRank);
};
const getAllowCourseEditingFlag = getGiveVipFeaturesFlag;
const getAllowDarkModeFlag = getGiveVipFeaturesFlag;

function getFeatureFlag(flag: FeatureFlag, userRank: UserRankType): boolean {
  switch (flag) {
    case "SHOW_CUSTOMIZE_CARD":
      return getShowCustomizeCardFlag(userRank);
    case "GIVE_VIP_FEATURES":
      return getGiveVipFeaturesFlag(userRank);
    case "ALLOW_COURSE_EDITING":
      return getAllowCourseEditingFlag(userRank);
    case "ALLOW_DARK_MODE":
      return getAllowDarkModeFlag(userRank);
    default:
      return false;
  }
}

export { getFeatureFlag, FeatureFlag };
