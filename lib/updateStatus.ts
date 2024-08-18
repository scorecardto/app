import { Course } from "scorecard-types";
import ScorecardModule from "./expoModuleBridge";
import parseCourseKey from "./parseCourseKey";
import axios from "redaxios";
import API_HOST from "./API_HOST";

export async function updateStatus(
  courses: Course[],
  token: string
): Promise<boolean> {
  const login = ScorecardModule.getItem("login");
  const name = ScorecardModule.getItem("name");

  const { host, school, grade, realFirstName, realLastName } =
    JSON.parse(login);

  const { firstName, lastName } = JSON.parse(name);

  const schedule: {
    course_key: string;
    period: string;
    name: string;
    teacher: string;
  }[] = [];

  courses.forEach((course: Course) => {
    const courseKey = course.key;
    const parsed = parseCourseKey(courseKey);
    schedule.push({
      course_key: courseKey,
      period: parsed.dayCodeIndex || "",
      teacher: parsed.teacher || "",
      name: course.name,
    });
  });

  const result = await axios.post(
    `${API_HOST}/v1/school/status`,
    {
      token,
      schoolName: school,
      districtHost: host,
      gradeLevel: grade,
      studentFirstName: firstName,
      studentLastName: lastName,
      realFirstName,
      realLastName,
      schedule: JSON.stringify(schedule),
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return result.data.result === "success";
}
