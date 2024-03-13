import { Platform } from "react-native";
import UserRankType from "./types/UserRankType";
import { RootState, store } from "../components/core/state/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";
type FeatureFlag =
  | "GIVE_VIP_FEATURES"
  | "SHOW_CUSTOMIZE_CARD"
  | "ALLOW_COURSE_EDITING"
  | "ALLOW_DARK_MODE";

function getGiveVipFeaturesFlag(userRank: UserRankType): boolean {
  const inDeveloperMode = __DEV__;
  const numInvitedNumbers =
    store.getState().invitedNumbers.numbers?.length ?? 0;

  const vipProgramDate = store.getState().login.districtVipProgramDate;

  const now = new Date();

  now.setMinutes(0, 0, 0);

  const vipProgramEnabled =
    vipProgramDate !== null && now.getTime() < Date.parse(vipProgramDate);

  // console.log(Date.parse(vipProgramDate) - now.getTime());

  if (
    userRank !== "DEFAULT" ||
    Platform.OS === "android" ||
    numInvitedNumbers > 2 ||
    !vipProgramEnabled
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

// function getFeatureFlag(flag: FeatureFlag, userRank: UserRankType): boolean {
//   switch (flag) {
//     case "SHOW_CUSTOMIZE_CARD":
//       return getShowCustomizeCardFlag(userRank);
//     case "GIVE_VIP_FEATURES":
//       return getGiveVipFeaturesFlag(userRank);
//     case "ALLOW_COURSE_EDITING":
//       return getAllowCourseEditingFlag(userRank);
//     case "ALLOW_DARK_MODE":
//       return getAllowDarkModeFlag(userRank);
//     default:
//       return false;
//   }
// }

function useFeatureFlag(flag: FeatureFlag): boolean {
  const now = useMemo(() => new Date(), []);

  now.setMinutes(0, 0, 0);

  const flagValue = useSelector((state: RootState) => {
    if (
      flag === "SHOW_CUSTOMIZE_CARD" ||
      flag === "ALLOW_COURSE_EDITING" ||
      flag === "ALLOW_DARK_MODE" ||
      flag === "GIVE_VIP_FEATURES"
    ) {
      const vipProgramDate = state.login.districtVipProgramDate;
      const numInvitedNumbers = state.invitedNumbers.numbers?.length ?? 0;

      // console.log(numInvitedNumbers, vipProgramDate);

      const vipProgramEnabled =
        vipProgramDate !== null && now.getTime() < Date.parse(vipProgramDate);

      const allowFeatures =
        state.userRank.type !== "DEFAULT" ||
        Platform.OS === "android" ||
        numInvitedNumbers >= 2 ||
        !vipProgramEnabled;

      return flag === "SHOW_CUSTOMIZE_CARD" ? !allowFeatures : allowFeatures;
    } else {
      return false;
    }
  });

  return flagValue;
}

export { useFeatureFlag, FeatureFlag };
