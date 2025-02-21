import axios, { Options } from "redaxios";
import parse from "node-html-parser";
import qs from "qs";
import { Assignment, Course, GradeCategory } from "scorecard-types";
import RefreshStatus from "./types/RefreshStatus";
import "qs";
import { fetchGradeCategoriesForCourse, fetchReportCard } from "./oldFetcher";
import ScorecardModule from "./expoModuleBridge";
import Toast from "react-native-toast-message";

type ErrorCode = 'INCORRECT_PASSWORD' | 'INCORRECT_USERNAME' | 'SESSION_EXPIRED';

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

async function parseHomeInfo(host: string, cookies: string) {
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

  ScorecardModule.storeItem("school", schoolName);

  const gradeLabel =
    homeData.querySelector("#defaultInfoHeader tr:nth-child(2) td:nth-child(2)")
      ?.innerText || "";

  return {
    firstName,
    lastName,
    grade: gradeLabel,
    school: schoolName,
  };
}

async function parseHome(host: string, cookies: string) {
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

  const columnNames: string[] = [];

  const courses: Course[] = [];
  const periodKeys: {[course: string]: string[]} = {};

  for (let idx = 0; idx < courseElements.length; idx++) {
    const courseElement = courseElements[idx];

    const cell = courseElement.querySelector("td:nth-child(4)");
    if (cell == null) {
      if (courseElement.firstChild?.textContent === "Dropped") break;

      continue;
    }

    const teacherName = courseElement.querySelector("td:nth-child(3)")?.textContent;
    const room = courseElement.querySelector("td:nth-child(6)")?.textContent;

    const courseKey: string = cell.getAttribute("cellkey")!;
    const name = cell.textContent;

    const grades: Course["grades"] = [];
    const keys: string[] = [];

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
      keys.push(key);
    });

    courses.push({
      key: courseKey,
      teacher: teacherName ? {name: teacherName} : undefined,
      room: room,
      name,
      grades,
    });
    periodKeys[courseKey] = keys;
  }

  return { courses, periodKeys, gradeCategoryNames: columnNames };
}

async function parseCourse(host: string, cookies: string, courseKey: string) {
  let response = await axios({
    url: `https://${host}/selfserve/PSSViewGradeBookEntriesAction.do?x-tab-id=undefined`,
    method: "POST",
    data: qs.stringify({
      gradeBookKey: courseKey,
    }),
    headers: {
      Cookie: cookies,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // responseType: "text",
    fetch: customFetch,
  });

  if (!response.data) return null;

  const assignments = parse(response.data as string);

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

async function parseEmail(host: string, cookies: string): Promise<{[code: string]: {name: string, email: string}}> {
  const response = (await axios({
        url: `https://${host}/selfserve/PSSEmailTeacherAction.do?x-tab-id=undefined`,
        method: "GET",
        headers: {
          Cookie: cookies,
        },
        fetch: customFetch,
      })).data as string


  return Array.from(response.matchAll(/ComboBoxItem.*?","(.*?)\|(.*?)\|(.*?)\//g))
      .reduce((acc, match) => {acc[match[3]] = {name: match[1], email: match[2]}; return acc;}, {} as {[code: string]: {name: string, email: string}});
}

async function fetchCourse(
  host: string,
  username: string,
  password: string,
  courseKeyOrIdx: string | number,
  gradeCategory?: number,
  emailsCallback?: (emails: {[code: string]: {name: string, email: string}}) => void,
  courseInfoCallback?: (num: number, names: string[]) => void,
): Promise<Course> {
  const cookies = await entryPoint(host);
  await login(host, cookies, username, password);

  emailsCallback && parseEmail(host, cookies).then(emailsCallback);

  const { courses, periodKeys, gradeCategoryNames } = await parseHome(host, cookies);
  courseInfoCallback && courseInfoCallback(courses.length, gradeCategoryNames);

  const course =
    typeof courseKeyOrIdx == "number"
      ? courses[courseKeyOrIdx]
      : courses.find((c) => c.key == courseKeyOrIdx)!;

  const key = (gradeCategory != undefined && periodKeys[course.key][gradeCategory]) || course.key;
  if (!key) return course;

  let gradeCategories = await parseCourse(host, cookies, key);

  if (gradeCategories == null) {
    const reportCard = await fetchReportCard(host, username, password);
    gradeCategories = (
      await fetchGradeCategoriesForCourse(
        host,
        reportCard.sessionId,
        reportCard.referer,
        reportCard.courses.find((c) => c.key === key)!
      )
    ).gradeCategories;
  }

  return {
    ...course,
    gradeCategories,
  };
}

async function fetchHomeInfo(host: string, username: string, password: string) {
  const cookies = await entryPoint(host);
  await login(host, cookies, username, password);
  return await parseHomeInfo(host, cookies);
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
  broadcastErrors: false|((name:string) => void),
  errorCallback?: (error: ErrorCode) => void,
  gradeCategory?: number,
  infoCallback?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void,
  onStatusUpdate?: (status: RefreshStatus) => void,
  courseCallback?: (course: Course) => void
): Promise<AllContent|null> {
  let numCourses = oldNumCourses || 8;

  let error = false;

  let resolved: number[] = [];
  let courses: Course[] = [];
  let emails: {[code: string]: {name: string, email: string}} = {};

  let gradeCategoryNames: string[] = [];

  onStatusUpdate && onStatusUpdate({ type: "LOGGING_IN", status: "Logging in...",  tasksCompleted: 0, taskRemaining: 0 });
  infoCallback && fetchHomeInfo(host, username, password).then(infoCallback);

  const runCourse = (i: number) => {
    fetchCourse(
      host,
      username,
      password,
      i,
      gradeCategory,
      i == 0 ? (e) => {emails = e} : undefined,
      async (realNum, names) => {
        if (realNum > numCourses) {
          for (let i = numCourses; i < realNum; i++) {
            runCourse(i);
          }
        }

        numCourses = realNum;
        gradeCategoryNames = names;
      },
    )
      .then((course) => {
        if (error) return;

        courseCallback && courseCallback(course);

        resolved.push(i);
        courses[i] = course;

        onStatusUpdate && onStatusUpdate({ type: "GETTING_COURSES", status: "Fetching courses...",  tasksCompleted: resolved.length, taskRemaining: numCourses - resolved.length });
      })
      .catch((e) => {
        if (error) return;

        (errorCallback || console.error)(e.message);

        if (broadcastErrors) {
          switch (e.message) {
            case "INCORRECT_PASSWORD":
            case "INCORRECT_USERNAME":
              Toast.show({
                type: "info",
                text1: "Incorrect Login",
                text2: "Go to your settings or tap this message to edit your credentials.",
                onPress: () => broadcastErrors("gradebookSettings")
              });
              break;
            case "SESSION_EXPIRED":
              Toast.show({
                type: "info",
                text1: "Session Expired",
                text2: "Scorecard has experienced an error. Please try again.",
              });
              break;
            default:
              Toast.show({
                type: "info",
                text1: e.message,
                text2: "Scorecard has experienced an error. Please try again.",
              });
              break;
          }
        }
        error = true;
      });
  };

  for (let i = 0; i < numCourses; i++) {
    runCourse(i);
  }

  const wait = async (resolve: (val: void) => void) => {
    if (error || resolved.length == numCourses) resolve();

    setTimeout(() => wait(resolve), 50);
  };
  await new Promise((res) => wait(res));

  onStatusUpdate && onStatusUpdate({ type: "IDLE", status: "",  tasksCompleted: 0, taskRemaining: 0 });
  if (error) return null;

  if (emails) {
    for (const code in emails) {
        const course = courses.find((c) => c.key.includes(code));
        if (course) course.teacher = emails[code];
    }
  }


  return {
    courses,
    gradeCategoryNames,
  };
}

export { fetchCourse, fetchAllContent, AllContent };
