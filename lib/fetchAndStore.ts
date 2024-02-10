import Storage from "expo-storage";
import { AllContentResponse, GradebookRecord } from "scorecard-types";
import CourseStateRecord from "./types/CourseStateRecord";
import captureCourseState from "./captureCourseState";
import { AppDispatch } from "../components/core/state/store";
import {
  setReferer,
  setSessionId,
} from "../components/core/state/user/loginSlice";
import { setGradeRecord } from "../components/core/state/grades/gradeDataSlice";
import { setOldCourseStates } from "../components/core/state/grades/oldCourseStatesSlice";

export default async function fetchAndStore(
  data: AllContentResponse,
  dispatch: AppDispatch,
  updateCourseStates: boolean
) {
  const gradeCategory =
    Math.max(
      ...data.courses.map((course) => course.grades.filter((g) => g).length)
    ) - 1;

  dispatch(setReferer(data.referer));
  dispatch(setSessionId(data.sessionId));

  const oldData: GradebookRecord[] = JSON.parse(
    (await Storage.getItem({ key: "records" })) ?? "[]"
  );

  const newData: GradebookRecord = {
    courses: data.courses,
    gradeCategory,
    date: Date.now(),
    gradeCategoryNames: data.gradeCategoryNames,
  };

  dispatch(setGradeRecord(newData));

  if (updateCourseStates) {
    const oldCourseStates: CourseStateRecord = {};

    for (const course of newData.courses) {
      oldCourseStates[course.key] = captureCourseState(course);
    }

    dispatch(setOldCourseStates(oldCourseStates));

    await Storage.setItem({
      key: "oldCourseStates",
      value: JSON.stringify(oldCourseStates),
    });
  }

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
