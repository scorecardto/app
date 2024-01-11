import Storage from "expo-storage";

export async function saveCourseSettings(courseSettings: any) {
  await Storage.setItem({
    key: "settings",
    value: JSON.stringify(courseSettings),
  });
}
