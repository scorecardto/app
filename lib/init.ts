import { DataProvider } from "scorecard-types";
import { MobileDataProvider } from "../components/core/context/MobileDataContext";
import { Storage } from "expo-storage";

type NextScreen = "scorecard" | "account";
export default async function initialize(
  dataContext: DataProvider,
  mobileDataContext: MobileDataProvider
): Promise<NextScreen> {
  const loginAsync = Storage.getItem({ key: "login" });
  const dataAsync = Storage.getItem({ key: "data" });

  const [login, data] = await Promise.all([loginAsync, dataAsync]);

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

    return "scorecard";
  } else {
    return "account";
  }
}
