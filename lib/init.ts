import {
  DataProvider,
  GradebookNotification,
  GradebookRecord,
} from "scorecard-types";
import { MobileData } from "../components/core/context/MobileDataContext";
import Storage from "expo-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getNotifications } from "./notifications";
import fetchAndStore from "./fetchAndStore";
import { fetchAllContent } from "./fetcher";
import { Dispatch } from "redux";
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
type NextScreen =
  | "scorecard"
  | "account"
  | "selectDistrict"
  | "reAddPhoneNumber"
  | "addPhoneNumber"
  | "addName";
export default async function initialize(
  dataContext: DataProvider,
  mobileDataContext: MobileData,
  user: FirebaseAuthTypes.User | null | undefined,
  dispatch: AppDispatch
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
    mobileDataContext.setInvitedNumbers(JSON.parse(invitedNumbers));
  } else {
    mobileDataContext.setInvitedNumbers(null);
  }

  dispatch(setAllSettings(JSON.parse(appSettings || "{}")));

  if (login && !!JSON.parse(records ?? "[]")[0]) {
    dataContext.setCourseSettings(JSON.parse(courseSettings ?? "{}"));

    const data = JSON.parse(records ?? "[]")[0] as GradebookRecord;

    dataContext.setData(data);
    dataContext.setGradeCategory(data.gradeCategory);

    // mobileDataContext.setOldCourseStates(JSON.parse(oldCourseStates ?? "{}"));

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
