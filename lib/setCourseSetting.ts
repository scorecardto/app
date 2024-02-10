import Storage from "expo-storage";
import { CourseSettings, DataProvider } from "scorecard-types";

// this function is split specifically for hiding in CourseCard atm, but can be used
// anywhere we want an animation before the context is updated
// (storage should be updated immediately, but the context should be updated after the animation)
export async function updateContextSettings(
  dataContext: DataProvider,
  settings?: { [c: string]: CourseSettings }
) {
  dataContext.setCourseSettings(
    settings ??
      JSON.parse((await Storage.getItem({ key: "courseSettings" })) ?? "{}")
  );
}

export function setCourseSetting(
  dataContext: DataProvider,
  key: string,
  courseSettings: CourseSettings,
  updateContext?: boolean
) {
  const settings = {
    ...dataContext.courseSettings,
    [key]: {
      ...dataContext.courseSettings[key],
      ...courseSettings,
    },
  };

  Storage.setItem({
    key: "settings",
    value: JSON.stringify(settings),
  });
  if (updateContext ?? true) updateContextSettings(dataContext, settings);
}
