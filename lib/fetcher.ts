import axios, { Options, RequestHeaders } from "redaxios";
import Form from "form-data";
import parse from "node-html-parser";
import qs from "qs";
import {
  AllContentResponse,
  AllCoursesResponse,
  Assignment,
  Course,
  CourseResponse,
  GradeCategoriesResponse,
  GradeCategory,
} from "scorecard-types";
// @ts-ignore
import * as iso88592 from "iso-8859-2/iso-8859-2.mjs";
import RefreshStatus from "./types/RefreshStatus";

const generateSessionId = () => {
  return [...Array(32)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")
    .toUpperCase();
};

const toFormData = (obj: any) => {
  const formData = new Form();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};
const toFormDataData = (obj: any) => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};

const fetchReportCard = async (
  host: string,
  username: string,
  password: string,
  onLoginSuccess?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void,
  onStatusUpdate?: (status: RefreshStatus) => void
): Promise<CourseResponse> => {
  const cookie = generateSessionId();

  onStatusUpdate?.({
    tasksCompleted: 0,
    taskRemaining: 10,
    status: "Connecting to Frontline...",
    type: "LOGGING_IN",
  });

  const ENTRY_POINT: Options = {
    url: `https://${host}/selfserve/EntryPointHomeAction.do?parent=false`,
    method: "GET",
    headers: {
      // Cookie: `JSESSIONID=${cookie}`,
      // Connection: "keep-alive",
    },
  };

  await axios(ENTRY_POINT);

  const ENTRY_POINT_LOGIN: Options = {
    url: `https://${host}/selfserve/HomeLoginAction.do?parent=false&teamsStaffUser=N`,
    method: "GET",
    headers: {
      // Referer: ENTRY_POINT.url!,
      // Connection: "keep-alive",
    },
  };

  await axios(ENTRY_POINT_LOGIN);

  const HOME_LOGIN = {
    url: `https://${host}/selfserve/SignOnLoginAction.do?parent=false&teamsStaffUser=N`,
    method: "POST",
    data: toFormData({
      // selectedIndexId: -1,
      // selectedTable: "",
      // smartFormName: "SmartForm",
      // focusElement: "",
      userLoginId: username,
      userPassword: password,
    }),
    headers: {
      // Referer: ENTRY_POINT_LOGIN.url!,
      // Connection: "keep-alive",
    },
  };

  // @ts-ignore
  const homeLoginResponse = await axios(HOME_LOGIN);

  const homeLoginHtml = parse(homeLoginResponse.data as string);

  if (
    homeLoginHtml.querySelector("span.error")?.innerText ===
    "User ID or Password is incorrect."
  ) {
    throw new Error("INCORRECT_PASSWORD");
  }
  if (
    homeLoginHtml.querySelector("span.error")?.innerText ===
      "The username or password you entered is invalid.  Please try again." ||
    homeLoginHtml.querySelector("span.error")?.innerText ===
      "Invalid User ID or Password! "
  ) {
    throw new Error("INCORRECT_USERNAME");
  }

  onStatusUpdate?.({
    tasksCompleted: 1,
    taskRemaining: 10,
    status: "Getting New Grades...",
    type: "LOGGING_IN",
  });

  const REPORT_CARDS: Options = {
    url: `https://${host}/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined`,
    method: "POST",
    // data: toFormData({
    //   "x-tab-id": "undefined",
    // }),
    headers: {
      // Referer: HOME_LOGIN.url!,
      // Connection: "keep-alive",
    },
  };

  // @ts-ignore
  const reportCardsResponse: string = (await axios(REPORT_CARDS)).data;

  const reportCardsHtml = parse(reportCardsResponse);

  if (
    reportCardsHtml.querySelector("#pageMessageDiv.message.info")?.innerText ===
    "Your session has expired.  Please use the Close button and log in again."
  ) {
    throw new Error("SESSION_EXPIRED");
  }

  const courseElements = reportCardsHtml.querySelectorAll(
    ".studentGradingBottomLeft tr:not(:first-child) td:nth-child(4)"
  );

  const rawName =
    reportCardsHtml.querySelector(
      "#defaultInfoHeader tr:nth-child(1) td:nth-child(2)"
    )?.innerText || "";

  const lastName = rawName?.split(",")?.[0];

  const legalFirstName = rawName?.split(", ")?.[1]?.split(" ")?.[0];

  const regex = /\(.*\)/g;

  const prefferedFirstName = regex.exec(rawName)?.[0];

  const firstName = prefferedFirstName
    ? prefferedFirstName.replace(/[()]/g, "")
    : legalFirstName;

  const schoolName =
    reportCardsHtml.querySelector(
      "#defaultInfoHeader tr:nth-child(2) td:nth-child(1)"
    )?.innerText || "";

  const gradeLabel =
    reportCardsHtml.querySelector(
      "#defaultInfoHeader tr:nth-child(2) td:nth-child(2)"
    )?.innerText || "";
  if (onLoginSuccess) {
    onLoginSuccess({
      firstName: firstName,
      lastName: lastName,
      grade: gradeLabel,
      school: schoolName,
    });
  }

  const columnNames: string[] = [];

  const courses: Course[] = [];

  courseElements.forEach((courseElement, idx) => {
    const courseKey: string = courseElement.getAttribute("cellkey")!;

    const name = courseElement.textContent;

    const grades: Course["grades"] = [];

    const gradeElements = reportCardsHtml.querySelectorAll(
      `.studentGradingBottomRight tr:nth-child(${idx + 2}) td`
    );

    gradeElements.forEach((gradeElement) => {
      const key = gradeElement.getAttribute("cellkey")!;
      const parsedKey = qs.parse(key, { delimiter: "," });

      if (idx === 0) {
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
  });

  return {
    courses,
    sessionId: cookie,
    referer: '',//REPORT_CARDS.url!,
    gradeCategoryNames: columnNames,
  };
};

type XMLOptions = {
  method?: string;
  url?: string;
  headers?: { [key: string]: string };
  responseType?: XMLHttpRequestResponseType;
  data?: FormData;
};

function makeXmlHttpRequest(options: XMLOptions) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(options.method!, options.url!);

    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        // @ts-ignore
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }

    if (options.responseType) {
      xhr.responseType = options.responseType;
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("request finished", options.url, "at", new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());

        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => {
      // if status is 0, app was likely backgrounded,
      // so we just want to try again and keep going
      if (xhr.status === 0) makeXmlHttpRequest(options).then(resolve, reject);
      else reject(xhr.statusText);
    };

    console.log("making request", options.url, "at", new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
    xhr.send(options.data);
  });
}
const fetchGradeCategoriesForCourse = async (
  host: string,
  course: Course,
  gradeIndex?: number
): Promise<GradeCategory[]> => {
  const ASSIGNMENTS: XMLOptions = {
    url: `https://${host}/selfserve/PSSViewGradeBookEntriesAction.do?x-tab-id=undefined`,
    method: "POST",
    data: toFormDataData({
      // selectedIndexId: -1,
      // selectedTable: "",
      // smartFormName: "SmartForm",
      // focusElement: "",
      gradeBookKey:
        gradeIndex != null ? course.grades[gradeIndex]?.key : course.key,
      // replaceObjectParam1: "",
      // selectedCell: "",
      // selectedTdId: "",
    }),
    headers: {
      // Referer: `https://${host}/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined`,
      // Connection: "keep-alive",
    },
    responseType: "text",
  };

  const assignmentsResponseRaw = await makeXmlHttpRequest(ASSIGNMENTS);

  const assignmentsHtml = parse(assignmentsResponseRaw as string);

  const categoryElements = assignmentsHtml.querySelectorAll(
    ".tablePanelContainer"
  );

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


  const BACK_TO_REPORT_CARD: XMLOptions = {
    url: `https://${host}/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined`,
    method: "POST",
    // data: toFormDataData({
      // selectedIndexId: undefined,
      // selectedTable: undefined,
      // smartFormName: "SmartForm",
      // focusElement: "",
    // }),
    responseType: "text",
    headers: {
      // Referer: ASSIGNMENTS.url!,
      // Connection: "keep-alive",
    },
  };

  await makeXmlHttpRequest(BACK_TO_REPORT_CARD);

  console.log("returning", course.name, gradeCategories.map(c=>c.name));
  return gradeCategories;
};

const fetchAllContent = async (
  host: string,
  username: string,
  password: string,
  onLoginSuccess?: (info: {
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
  }) => void,
  onStatusUpdate?: (status: RefreshStatus) => void
): Promise<AllContentResponse> => {
  let reportCard;
  while (!reportCard) {
    try {
      reportCard = await fetchReportCard(
        host,
        username,
        password,
        onLoginSuccess,
        onStatusUpdate
      );
    } catch (err) {
      if (
        !(err instanceof TypeError && err.message === "Network request failed")
      ) {
        return Promise.reject(err);
      }
    }
  }
  const gradeCategories = reportCard.gradeCategoryNames;

  const assignmentsAllCoursesResponse = await fetchGradeCategoriesForCourses(
    host,
    reportCard,
    onStatusUpdate
  );

  onStatusUpdate?.({
    status: "Done",
    type: "IDLE",
    tasksCompleted: 0,
    taskRemaining: 0,
  });

  return {
    ...assignmentsAllCoursesResponse,
    gradeCategoryNames: gradeCategories,
  };
};

const fetchGradeCategoriesForCourses = async (
  host: string,
  reportCard: CourseResponse,
  onStatusUpdate?: (status: RefreshStatus) => void,
  gradeIndex?: number
): Promise<AllCoursesResponse> => {
  const all: Course[] = new Array(reportCard.courses.length);
  const foundCourses: number[] = [];

  let sessionId = reportCard.sessionId;
  let referer = `https://${host}/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined`;

  for (let i = 0; i < all.length; i++) {
    const course = reportCard.courses[i];

    onStatusUpdate?.({
      tasksCompleted: i + 2,
      taskRemaining: reportCard.courses.length + 2,
      status: "Updating COURSE_NAME",
      type: "GETTING_COURSES",
      courseKey: course.key,
    });

    const categories = await fetchGradeCategoriesForCourse(
        host,
        course,
        gradeIndex
    )//.then(categories => {
      console.log("got course", course.name, i, categories.map(c=>c.name));
      foundCourses.push(i);
      all[i] = {
        ...course,
        gradeCategories: categories,
      };
    //})
  }

  const wait = async (resolve: (val: void) => void) => {
    if (foundCourses.length == reportCard.courses.length) resolve();

    setTimeout(() => wait(resolve), 50);
  }

  await new Promise(res => wait(res));

  console.log(JSON.stringify(all));
  return {
    sessionId,
    referer,
    courses: all,
  };
};

export {
  fetchReportCard,
  fetchGradeCategoriesForCourse,
  fetchGradeCategoriesForCourses,
  fetchAllContent,
};
