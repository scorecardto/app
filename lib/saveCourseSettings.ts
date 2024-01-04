import Storage from "expo-storage";

export async function saveCourseSettings(courseSettings: any) {
  const data = await Storage.getItem({ key: "data" });

  await Storage.setItem({
    key: "data",
    value: JSON.stringify({
      ...JSON.parse(data!),
      courseSettings,
    }),
  });
}
