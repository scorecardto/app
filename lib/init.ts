import { DataProvider } from "scorecard-types";
import { MobileDataProvider } from "../components/core/context/MobileDataContext";
import Storage from "expo-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
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
  const loginAsync = Storage.getItem({ key: "login" });
  const dataAsync = Storage.getItem({ key: "data" });
  const nameAsync = Storage.getItem({ key: "name" });

  const [login, data, name] = await Promise.all([
    loginAsync,
    dataAsync,
    nameAsync,
  ]);

  if (login && data) {
    const { courses, gradeCategory, gradeCategoryNames, date, courseSettings } =
      JSON.parse(data);

    const { username, password, host } = JSON.parse(login);

    mobileDataContext.setUsername(username);
    mobileDataContext.setPassword(password);
    mobileDataContext.setDistrict(host);

    dataContext.setData({
      courses,
      gradeCategory,
      gradeCategoryNames,
      date,
    });

    dataContext.setCourseSettings(courseSettings || {});

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
