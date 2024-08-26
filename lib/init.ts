import { GradebookRecord } from "scorecard-types";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AppDispatch } from "../components/core/state/store";
import {
  setDistrict,
  setDistrictVipProgramDate,
  setGradeLabel,
  setPassword,
  setSchoolName,
  setUsername,
} from "../components/core/state/user/loginSlice";
import * as Contacts from "expo-contacts";
import axios from "redaxios";
import {
  setFirstName,
  setLastName,
} from "../components/core/state/user/nameSlice";
import { setAllSettings } from "../components/core/state/user/settingsSlice";
import {
  setInvitedNumbers,
  setOpenInviteSheetDate,
} from "../components/core/state/user/invitedNumbersSlice";
import { setOldCourseStates } from "../components/core/state/grades/oldCourseStatesSlice";
import { setAllCourseSettings } from "../components/core/state/grades/courseSettingsSlice";
import {
  setGradeRecord,
  setPreviousGradeRecord,
} from "../components/core/state/grades/gradeDataSlice";
import { setGradeCategory } from "../components/core/state/grades/gradeCategorySlice";
import {setCourseOrder} from "../components/core/state/grades/courseOrderSlice";
import parseCourseKey from "./parseCourseKey";
import ScorecardModule from "./expoModuleBridge";
type NextScreen =
  | "start"
  | "scorecard"
  | "account"
  | "selectDistrict"
  | "reAddPhoneNumber"
  | "addPhoneNumber"
  | "addName";

import * as SecureStorage from "expo-secure-store";
import Storage from "expo-storage";
export default async function initialize(
  dispatch: AppDispatch,
  user: FirebaseAuthTypes.User | null | undefined
): Promise<NextScreen> {
  // LEGACY SUPPORT
  {
    const legacyKeys = [
      "courseOrder",
      "invitedNumbers",
      "openInviteSheetDate",
      "courseSettings",
      "oldCourseStates",
      "oldGradebooks",
      "login",
      "vipProgramDate",
      "name",
      "deviceId",
      "records",
      "hasProcessedContacts",
    ];
    for (const key of legacyKeys) {
      const value = await Storage.getItem({ key });

      if (value) {
        ScorecardModule.storeItem(key, value);
        await Storage.removeItem({ key });
      }
    }
    const legacyLogin = SecureStorage.getItem("login");
    if (legacyLogin) {
      ScorecardModule.storeItem("login", legacyLogin);
      await SecureStorage.deleteItemAsync("login");
    }
  }

  const login = ScorecardModule.getItem("login");
  const name = ScorecardModule.getItem("name");
  const records = ScorecardModule.getItem("records");
  const oldCourseStates = ScorecardModule.getItem("oldCourseStates");
  const courseSettings = ScorecardModule.getItem("courseSettings");
  const appSettings = ScorecardModule.getItem("appSettings");
  const courseOrder = ScorecardModule.getItem("courseOrder");
  const openInviteSheetDate = ScorecardModule.getItem("openInviteSheetDate");
  const invitedNumbers = ScorecardModule.getItem("invitedNumbers");
  const vipProgramDate = ScorecardModule.getItem("vipProgramDate");

  Contacts.getPermissionsAsync().then(async (permissions) => {
    if (permissions.status === "granted") {
      const hasProcessedContacts = ScorecardModule.getItem(
        "hasProcessedContacts"
      );

      if (!hasProcessedContacts) {
        const { data } = await Contacts.getContactsAsync({
          sort: "userDefault",
        });

        const result = await axios.post(
          "https://scorecardgrades.com/api/metrics/processContactList",
          {
            contacts: data.map((c: Contacts.Contact) => ({
              ...c,
              rawImage: undefined,
              imageAvailable: undefined,
              image: undefined,
            })),
            token: await user?.getIdToken(),
            graph: true,
          }
        );

        if (result.data.success) {
          ScorecardModule.storeItem("hasProcessedContacts", "true");
        }
      }
    }
  });

  if (vipProgramDate) {
    dispatch(setDistrictVipProgramDate(vipProgramDate));
  }
  if (invitedNumbers) {
    dispatch(setInvitedNumbers(JSON.parse(invitedNumbers)));
  } else {
    dispatch(setInvitedNumbers(null));
  }

  if (openInviteSheetDate) {
    dispatch(setOpenInviteSheetDate(new Date(openInviteSheetDate).getTime()));
  } else {
    dispatch(setOpenInviteSheetDate(null));
  }

  dispatch(setAllSettings(JSON.parse(appSettings || "{}")));

  if (login && !!JSON.parse(records ?? "[]")[0]) {
    dispatch(setAllCourseSettings(JSON.parse(courseSettings ?? "{}")));

    const recordData = JSON.parse(records ?? "[]") as GradebookRecord[];

    const data = recordData[0];
    dispatch(setGradeRecord(data));
    dispatch(setPreviousGradeRecord(recordData[1]));
    dispatch(setGradeCategory(data.gradeCategory));
    dispatch(
      setCourseOrder(
        courseOrder
          ? JSON.parse(courseOrder)
          : data.courses
              .map((c) => c.key)
              .sort((a, b) => {
                const aPrd = parseCourseKey(a)?.dayCodeIndex;
                const bPrd = parseCourseKey(b)?.dayCodeIndex;

                if (aPrd && bPrd) {
                  if (aPrd > bPrd) return 1;
                  if (aPrd < bPrd) return -1;
                } else if (aPrd) {
                  return -1;
                } else if (bPrd) {
                  return 1;
                } else {
                  return a.localeCompare(b);
                }

                return 0;
              })
      )
    );
    dispatch(setOldCourseStates(JSON.parse(oldCourseStates ?? "{}")));

    const {
      username,
      password,
      host,
      school,
      grade,
      realFirstName,
      realLastName,
    } = JSON.parse(login);

    dispatch(setDistrict(host));
    dispatch(setUsername(username));
    dispatch(setPassword(password));
    dispatch(setSchoolName(school));
    dispatch(setGradeLabel(grade));

    if (name) {
      const { firstName, lastName } = JSON.parse(name);

      dispatch(setFirstName(firstName));
      dispatch(setLastName(lastName));
    }

    // if (1 + 1 === 2) {
    //   return "scorecard";
    // }
    if (user && name) {
      return "scorecard";
    } else if (!user && name) {
      return "reAddPhoneNumber";
    } else if (user && !name) {
      return "addName";
    } else {
      return "addPhoneNumber";
    }
  } else {
    // if (1 + 1 === 2) {
    //   return "scorecard";
    // }
    return "start";
  }
}
