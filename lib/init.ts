import { GradebookRecord } from "scorecard-types";
import Storage from "expo-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AppDispatch } from "../components/core/state/store";
import {
  setDistrict,
  setPassword,
  setUsername,
} from "../components/core/state/user/loginSlice";
import {
  setFirstName,
  setLastName,
} from "../components/core/state/user/nameSlice";
import { setAllSettings } from "../components/core/state/user/settingsSlice";
import { setInvitedNumbers } from "../components/core/state/user/invitedNumbersSlice";
import { setOldCourseStates } from "../components/core/state/grades/oldCourseStatesSlice";
import { setAllCourseSettings } from "../components/core/state/grades/courseSettingsSlice";
import { setGradeRecord } from "../components/core/state/grades/gradeDataSlice";
import { setGradeCategory } from "../components/core/state/grades/gradeCategorySlice";
type NextScreen =
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
  const login = await Storage.getItem({ key: "login" });
  const name = await Storage.getItem({ key: "name" });
  const notifs = await Storage.getItem({ key: "notifs" });
  const records = await Storage.getItem({ key: "records" });
  const oldCourseStates = await Storage.getItem({ key: "oldCourseStates" });
  const courseSettings = await Storage.getItem({ key: "courseSettings" });
  const appSettings = await Storage.getItem({ key: "appSettings" });

  const invitedNumbers = await Storage.getItem({
    key: "invitedNumbers",
  });

  if (invitedNumbers) {
    dispatch(setInvitedNumbers(JSON.parse(invitedNumbers)));
  } else {
    dispatch(setInvitedNumbers(null));
  }

  dispatch(setAllSettings(JSON.parse(appSettings || "{}")));

  if (login && !!JSON.parse(records ?? "[]")[0]) {
    dispatch(setAllCourseSettings(JSON.parse(courseSettings ?? "{}")));

    const data = JSON.parse(records ?? "[]")[0] as GradebookRecord;

    dispatch(setGradeRecord(data));
    dispatch(setGradeCategory(data.gradeCategory));

    dispatch(setOldCourseStates(JSON.parse(oldCourseStates ?? "{}")));

    const { username, password, host } = JSON.parse(login);

    dispatch(setDistrict(host));
    dispatch(setUsername(username));
    dispatch(setPassword(password));

    if (name) {
      const { firstName, lastName } = JSON.parse(name);

      dispatch(setFirstName(firstName));
      dispatch(setLastName(lastName));
    }

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
    return "selectDistrict";
  }
}
