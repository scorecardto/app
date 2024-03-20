import { GradebookRecord } from "scorecard-types";
import Storage from "expo-storage";
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
import {setGradeRecord, setPreviousGradeRecord} from "../components/core/state/grades/gradeDataSlice";
import { setGradeCategory } from "../components/core/state/grades/gradeCategorySlice";
import { setNotification } from "../components/core/state/user/notificationSettingsSlice";
import { isRegisteredForNotifs } from "./backgroundNotifications";
import * as SecureStorage from "expo-secure-store";
import {setCourseOrder} from "../components/core/state/grades/courseOrderSlice";
import parseCourseKey from "./parseCourseKey";
type NextScreen =
  | "start"
  | "scorecard"
  | "account"
  | "selectDistrict"
  | "reAddPhoneNumber"
  | "addPhoneNumber"
  | "addName";
export default async function initialize(
  dispatch: AppDispatch,
  user: FirebaseAuthTypes.User | null | undefined
): Promise<NextScreen> {
  const login = SecureStorage.getItem("login");
  const name = await Storage.getItem({ key: "name" });
  const records = await Storage.getItem({ key: "records" });
  const oldCourseStates = await Storage.getItem({ key: "oldCourseStates" });
  const courseSettings = await Storage.getItem({ key: "courseSettings" });
  const appSettings = await Storage.getItem({ key: "appSettings" });
  const courseOrder = await Storage.getItem({ key: "courseOrder" });
  const openInviteSheetDate = await Storage.getItem({
    key: "openInviteSheetDate",
  });

  const invitedNumbers = await Storage.getItem({
    key: "invitedNumbers",
  });

  const vipProgramDate = await Storage.getItem({
    key: "vipProgramDate",
  });

  Contacts.getPermissionsAsync().then(async (permissions) => {
    if (permissions.status === "granted") {
      const hasProcessedContacts = await Storage.getItem({
        key: "hasProcessedContacts",
      });

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
          Storage.setItem({
            key: "hasProcessedContacts",
            value: "true",
          });
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
    isRegisteredForNotifs(data.courses.map((c) => c.key)).then((res) => {
      if (res?.data.success) {
        for (const result of res.data.result) {
          dispatch(
            setNotification({
              key: result.key,
              value: result.value,
            })
          );
        }
      }
    });

    dispatch(setGradeRecord(data));
    dispatch(setPreviousGradeRecord(recordData[1]))
    dispatch(setGradeCategory(data.gradeCategory));
    dispatch(setCourseOrder(courseOrder ? JSON.parse(courseOrder) : data.courses.map(c=>c.key).sort((a, b) => {
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
    })));
    dispatch(setOldCourseStates(JSON.parse(oldCourseStates ?? "{}")));

    const { username, password, host, school, grade } = JSON.parse(login);

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
