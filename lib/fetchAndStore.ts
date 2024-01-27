import Storage from "expo-storage";
import {
  AllContentResponse,
  DataProvider,
  GradebookNotification,
  GradebookRecord,
} from "scorecard-types";
import { MobileDataProvider } from "../components/core/context/MobileDataContext";
import { getNotifications } from "./notifications";

export default async function fetchAndStore(
  data: AllContentResponse,
  mobileData: MobileDataProvider,
  dataContext: DataProvider,
  checkNotifs = true
) {
  const gradeCategory =
    Math.max(
      ...data.courses.map((course) => course.grades.filter((g) => g).length)
    ) - 1;

  mobileData.setReferer(data.referer);
  mobileData.setSessionId(data.sessionId);

  const oldData: GradebookRecord[] = JSON.parse(
    (await Storage.getItem({ key: "records" })) ?? "[]"
  );

  const newData: GradebookRecord = {
    courses: data.courses,
    gradeCategory,
    date: Date.now(),
    gradeCategoryNames: data.gradeCategoryNames,
  };

  dataContext.setData(newData);

  await Storage.setItem({
    key: "records",
    value: JSON.stringify([newData, ...oldData]),
  });
}

function arrayIsEqual(a: any[], b: any[]) {
  return (
    a.length == b.length &&
    a.every((v1) => b.find((v2) => objIsEqual(v1, v2)) != null)
  );
}

function objIsEqual(a: any, b: any) {
  if (typeof a != "object" || typeof b != "object") return a == b;

  for (const key in a) {
    if (
      (Array.isArray(a) && Array.isArray(b) && !arrayIsEqual(a, b)) ||
      a[key] != b[key]
    )
      return false;
  }

  return true;
}
