import Storage from "expo-storage";
import { CourseSettings, DataProvider } from "scorecard-types";
import { AppDispatch } from "../components/core/state/store";
import {
  GradeData,
  setCourseSettings,
} from "../components/core/state/grades/gradeDataSlice";
// this function is split specifically for hiding in CourseCard atm, but can be used
// anywhere we want an animation before the context is updated
// (storage should be updated immediately, but the context should be updated after the animation)
export async function updateContextSettings(
  dispatch: AppDispatch,
  settings?: GradeData["courseSettings"]
) {
  dispatch(
    setCourseSettings(
      settings ??
        JSON.parse((await Storage.getItem({ key: "courseSettings" })) ?? "{}")
    )
  );
}

export function setCourseSetting(
  dispatch: AppDispatch,
  allCourseSettings: GradeData["courseSettings"],
  key: string,
  courseSettings: CourseSettings,
  updateContext?: boolean
) {
  const settings = {
    ...allCourseSettings,
    [key]: {
      ...allCourseSettings[key],
      ...courseSettings,
    },
  };

  Storage.setItem({
    key: "settings",
    value: JSON.stringify(settings),
  });
  if (updateContext ?? true) updateContextSettings(dispatch, settings);
}
