import axios, { Options } from "redaxios";
import parse from "node-html-parser";
import qs from "qs";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import RefreshStatus from "./types/RefreshStatus";
import "qs";
import Toast from "react-native-toast-message";

const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    credentials: "omit",
  });
};

async function entryPoint(host: string) {
  const ENTRY_POINT: Options = {
    url: `https://${host}/selfserve/EntryPointHomeAction.do?parent=false`,
    method: "GET",
    fetch: customFetch,
  };

  // @ts-ignore
  const headers = (await axios(ENTRY_POINT)).headers.map[
    "set-cookie"
  ] as string;
  const cookies = headers
    .split(/, (?=[a-z_0-9A-Z]*?=)/)
    .map((s) => s.split(";")[0])
    .join("; ");

  return cookies;
}

async function login(
  host: string,
  cookies: string,
  username: string,
  password: string
) {
  const login = parse(
    (
      await axios({
        url: `https://${host}/selfserve/SignOnLoginAction.do`,
        method: "POST",
        data: qs.stringify({
          userLoginId: username,
          userPassword: password,
        }),
        headers: {
          Cookie: cookies,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        fetch: customFetch,
      })
    ).data as string
  );

  if (
    login.querySelector("span.error")?.innerText ===
    "User ID or Password is incorrect."
  ) {
    throw new Error("INCORRECT_PASSWORD");
  }
  if (
    login.querySelector("span.error")?.innerText ===
      "The username or password you entered is invalid.  Please try again." ||
    login.querySelector("span.error")?.innerText ===
      "Invalid User ID or Password! "
  ) {
    throw new Error("INCORRECT_USERNAME");
  }
}

async function parseHome(
  host: string,
  cookies: string,
  infoCallback?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void
) {
  const scheduleData = parse(
    (
      await axios({
        url: `https://${host}/selfserve/PSSViewScheduleAction.do?x-tab-id=undefined`,
        method: "POST",
        headers: { Cookie: cookies },
        fetch: customFetch,
        data: qs.stringify({
          selectedIndexId: "undefined",
          selectedTable: "table",
          smartFormName: "SmartForm",
          focusElement: "",
          gradeBookKey: "",
          replaceObjectParam1: "",
          selectedCell: "",
          selectedTdId: "",
        }),
      })
    ).data as string
  );

  const homeData = parse(
    (
      await axios({
        url: `https://${host}/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined`,
        method: "POST",
        headers: { Cookie: cookies },
        fetch: customFetch,
      })
    ).data as string
  );

  if (
    homeData.querySelector("#pageMessageDiv .message .info")?.innerText ===
    "Your session has expired.  Please use the Close button and log in again."
  ) {
    throw new Error(`SESSION_EXPIRED`);
  }

  const courseElements = homeData.querySelectorAll(
    ".studentGradingBottomLeft tr"
  );

  const rawName =
    homeData.querySelector("#defaultInfoHeader tr:nth-child(1) td:nth-child(2)")
      ?.innerText || "";

  const lastName = rawName?.split(",")?.[0];

  const legalFirstName = rawName?.split(", ")?.[1]?.split(" ")?.[0];

  const regex = /\(.*\)/g;

  const prefferedFirstName = regex.exec(rawName)?.[0];

  const firstName = prefferedFirstName
    ? prefferedFirstName.replace(/[()]/g, "")
    : legalFirstName;

  const schoolName =
    homeData.querySelector("#defaultInfoHeader tr:nth-child(2) td:nth-child(1)")
      ?.innerText || "";

  const gradeLabel =
    homeData.querySelector("#defaultInfoHeader tr:nth-child(2) td:nth-child(2)")
      ?.innerText || "";
  if (infoCallback) {
    infoCallback({
      firstName: firstName,
      lastName: lastName,
      grade: gradeLabel,
      school: schoolName,
    });
  }

  const columnNames: string[] = [];

  const courses: Course[] = [];

  for (let idx = 0; idx < courseElements.length; idx++) {
    const courseElement = courseElements[idx];

    const cell = courseElement.querySelector("td:nth-child(4)");
    if (cell == null) {
      if (courseElement.firstChild?.textContent === "Dropped") break;

      continue;
    }

    const courseKey: string = cell.getAttribute("cellkey")!;
    const name = cell.textContent;

    const grades: Course["grades"] = [];

    const gradeElements = homeData.querySelectorAll(
        `.studentGradingBottomRight tr:nth-child(${idx + 1}) td`
    );

    gradeElements.forEach((gradeElement) => {
      const key = gradeElement.getAttribute("cellkey")!;
      const parsedKey = qs.parse(key, { delimiter: "," });

      if (idx === 1) {
        columnNames.push(
            parsedKey["gradeTypeIndex"]?.toString() ?? "Grading Period"
        );
      }

      const grade = parsedKey["gradeIndex"];

      if (grade && typeof grade === "string") {
        grades.push({
          key,
          value: grade,
          active: !!gradeElement.querySelector("font"),
        });
      } else {
        grades.push(null);
      }
    });

    courses.push({
      key: courseKey,
      name,
      grades,
    });
  }

  return { courses, gradeCategoryNames: columnNames };
}

async function parseCourse(host: string, cookies: string, courseKey: string) {
  const assignments = parse(
      (
          await axios({
            url: `https://${host}/selfserve/PSSViewGradeBookEntriesAction.do?x-tab-id=undefined`,
            method: "POST",
            data: qs.stringify({
              gradeBookKey: courseKey,
            }),
            headers: {
              // Cookie: cookies,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "text",
            fetch: customFetch,
          })
      ).data as string
  );

  const categoryElements = assignments.querySelectorAll(".tablePanelContainer");

  const gradeCategories: GradeCategory[] = categoryElements.map((c) => {
    const categoryDetailElements = c.querySelector(".sst-title")?.childNodes!;

    let error = false;

    let weight = 0;

    const average = categoryDetailElements[2].textContent.substring(
      "Average:  ".length
    );

    try {
      weight = parseFloat(
        categoryDetailElements[4].textContent.substring("Weight:  ".length)
      );
    } catch (e) {
      error = true;
    }

    const headers = c.querySelector(".frozen-row")!;

    const getHeaderPosition = (name: string): number => {
      return Array.prototype.indexOf.call(
        headers?.querySelectorAll("th"),
        headers.querySelector(`th[columnid="${name}"]`)
      );
    };

    const nameIndex = getHeaderPosition("Assignment Name");
    const gradeIndex = getHeaderPosition("Grade Value");
    const droppedIndex = getHeaderPosition("droppedIndicator");
    const assignIndex = getHeaderPosition("Assign Date");
    const dueDateIndex = getHeaderPosition("Due Date");
    const scaleIndex = getHeaderPosition("Grade Scale");
    const valueIndex = getHeaderPosition("Maximum Value");
    const countIndex = getHeaderPosition("Count");
    const noteIndex = getHeaderPosition("Note");

    const assignments: Assignment[] = [];

    c.querySelectorAll("tbody.tblBody > tr").forEach((a) => {
      const elementList = a.querySelectorAll("*");
      const error: Assignment["error"] = false;

      const name: Assignment["name"] = elementList[nameIndex].textContent;

      const points: Assignment["points"] = parseFloat(
        elementList[gradeIndex].textContent
      );

      const grade: Assignment["grade"] = (
        elementList[gradeIndex].textContent
          .split("(")[1]
          ?.split(")")[0]
          .replace(/\.0?%/g, "%") ?? elementList[gradeIndex].textContent
      ).trim();

      const dropped: Assignment["dropped"] =
        elementList[droppedIndex].textContent.trim().length !== 0;
      const assign: Assignment["assign"] = elementList[assignIndex].textContent;
      const due: Assignment["due"] = elementList[dueDateIndex].textContent;
      const scale: Assignment["scale"] = parseFloat(
        elementList[scaleIndex].textContent
      );
      const max: Assignment["max"] = parseInt(
        elementList[valueIndex].textContent
      );
      const count: Assignment["count"] = parseInt(
        elementList[countIndex].textContent
      );
      const note: Assignment["note"] = elementList[noteIndex].textContent;

      assignments.push({
        name,
        grade,
        points,
        dropped,
        assign,
        due,
        scale,
        max,
        count,
        note,
        error,
      });
    });

    return {
      name: categoryDetailElements[0].innerText,
      id: c.id.substring(0, c.id.length - "panelContainer".length),
      average,
      weight,
      assignments,
      error,
    };
  });

  return gradeCategories;
}

async function fetchCourse(
  host: string,
  username: string,
  password: string,
  courseKeyOrIdx: string | number,
  courseInfoCallback?: (num: number, names: string[]) => void,
  infoCallback?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void,
  gradeCategory?: number
): Promise<Course | undefined> {
  const cookies = await entryPoint(host);
  await login(host, cookies, username, password);

  const { courses, gradeCategoryNames } = await parseHome(
    host,
    cookies,
    infoCallback
  );
  courseInfoCallback && courseInfoCallback(courses.length, gradeCategoryNames);

  const course =
    typeof courseKeyOrIdx == "number"
      ? courses[courseKeyOrIdx]
      : courses.find((c) => c.key == courseKeyOrIdx);
  if (!course) return;

  const key = gradeCategory ? course.grades[gradeCategory]?.key : course.key;
  if (!key) return;

  return {
    ...course,
    gradeCategories: await parseCourse(host, cookies, key),
  };
}

interface AllContent {
  courses: Course[];
  gradeCategoryNames: string[];
}

async function fetchAllContent(
  host: string,
  oldNumCourses: number | undefined,
  username: string,
  password: string,
  infoCallback?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void,
  onStatusUpdate?: (status: RefreshStatus) => void,
  courseCallback?: (course: Course) => void,
  gradeCategory?: number
): Promise<AllContent> {
  let numCourses = oldNumCourses || 8;

  let resolved: number[] = [];
  let courses: Course[] = [];

  let gradeCategoryNames: string[] = [];

  let gottenInfo = false;
  const infoWrapper = (info: any) => {
    if (!gottenInfo && infoCallback) {
      gottenInfo = true;
      infoCallback(info);
    }
  }
  const runCourse = (i: number) => {
    fetchCourse(
      host,
      username,
      password,
      i,
      async (realNum, names) => {
        if (realNum > numCourses) {
          for (let i = numCourses; i < realNum; i++) {
            runCourse(i);
          }
        }

        numCourses = realNum;
        gradeCategoryNames = names;
      },
      infoWrapper,
      gradeCategory
    )
      .then((course) => {
        if (course) {
          courseCallback && courseCallback(course);

          resolved.push(i);
          courses[i] = course;
        }
      })
      .catch((e) => {
        console.error(e.message);
        if (e.message.includes("SESSION_EXPIRED")) {
          Toast.show({
            type: "info",
            text1: "Session Expired",
            text2: "Scorecard has experienced an error. Please try again.",
          });
        }
      });
  };

  for (let i = 0; i < numCourses; i++) {
    runCourse(i);
  }

  const wait = async (resolve: (val: void) => void) => {
    if (resolved.length == numCourses) resolve();

    setTimeout(() => wait(resolve), 50);
  };
  await new Promise((res) => wait(res));

  return {
    courses,
    gradeCategoryNames,
  };
}

export { fetchCourse, fetchAllContent, AllContent };
