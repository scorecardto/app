export default function parseCourseKey(courseKey: string) {
  const keyValuePairs = courseKey.split(",");

  const parsedData: { [x: string]: string | null } = {};

  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("=");

    if (key != null) {
      parsedData[key] = value === "null" ? null : value;
    }
  });

  return parsedData;
}
