import {
  DataProvider,
  GradebookNotification,
  GradebookRecord,
} from "scorecard-types";
import { MobileDataProvider } from "../components/core/context/MobileDataContext";
import Storage from "expo-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getNotifications } from "./notifications";
import fetchAndStore from "./fetchAndStore";
import { fetchAllContent } from "./fetcher";
type NextScreen =
  | "scorecard"
  | "account"
  | "selectDistrict"
  | "reAddPhoneNumber"
  | "addPhoneNumber"
  | "addName";
export default async function initialize(
  dataContext: DataProvider,
  mobileDataContext: MobileDataProvider,
  user: FirebaseAuthTypes.User | null | undefined
): Promise<NextScreen> {
  const login = await Storage.getItem({ key: "login" });
  const name = await Storage.getItem({ key: "name" });
  const notifs = await Storage.getItem({ key: "notifs" });
  const records = await Storage.getItem({ key: "records" });
  const oldCourseStates = await Storage.getItem({ key: "oldCourseStates" });
  const settings = await Storage.getItem({ key: "settings" });
  const enableGradebookNotifications = await Storage.getItem({
    key: "enableGradebookNotifications",
  });

  mobileDataContext.setEnableGradebookNotifications(
    enableGradebookNotifications === "true"
  );

  if (login && !!JSON.parse(records ?? "[]")[0]) {
    dataContext.setCourseSettings(JSON.parse(settings ?? "{}"));

    const data = JSON.parse(records ?? "[]")[0] as GradebookRecord;

    dataContext.setData(data);
    dataContext.setGradeCategory(data.gradeCategory);

    mobileDataContext.setNotifications(JSON.parse(notifs ?? "[]"));

    // mobileDataContext.setOldCourseStates(JSON.parse(oldCourseStates ?? "{}"));

    const { username, password, host } = JSON.parse(login);

    mobileDataContext.setUsername(username);
    mobileDataContext.setPassword(password);
    mobileDataContext.setDistrict(host);

    if (name) {
      const { firstName, lastName } = JSON.parse(name);

      mobileDataContext.setFirstName(firstName);
      mobileDataContext.setLastName(lastName);
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
