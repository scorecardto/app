import {DataProvider, GradebookNotification, GradebookRecord} from "scorecard-types";
import { MobileDataProvider } from "../components/core/context/MobileDataContext";
import Storage from "expo-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {getNotifications} from "./notifications";
import fetchAndStore from "./fetchAndStore";
import {fetchAllContent} from "./fetcher";
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
  const settings = await Storage.getItem({ key: "settings" });

  if (login) {
    dataContext.setCourseSettings(JSON.parse(settings ?? "{}"));

    dataContext.setData(JSON.parse(records ?? "[]")[0]);
    mobileDataContext.setNotifications(JSON.parse(notifs ?? "[]"));

    const { username, password, host } = JSON.parse(login);

    mobileDataContext.setUsername(username);
    mobileDataContext.setPassword(password);
    mobileDataContext.setDistrict(host);

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
