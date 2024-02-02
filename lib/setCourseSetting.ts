import Storage from "expo-storage";
import {CourseSettings, DataProvider} from "scorecard-types";

export async function setCourseSetting(dataContext: DataProvider, key: string, courseSettings: CourseSettings) {
  const settings = {
    ...dataContext.courseSettings,
    [key]: {
      ...dataContext.courseSettings[key],
      ...courseSettings
    },
  }

  dataContext.setCourseSettings(settings);
  await Storage.setItem({
    key: "settings",
    value: JSON.stringify(settings),
  });
}
