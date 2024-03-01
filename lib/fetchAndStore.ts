import Storage from "expo-storage";
import {AllContentResponse, Assignment, GradebookRecord} from "scorecard-types";
import CourseStateRecord from "./types/CourseStateRecord";
import captureCourseState from "./captureCourseState";
import { AppDispatch } from "../components/core/state/store";
import {
  setReferer,
  setSessionId,
} from "../components/core/state/user/loginSlice";
import { setGradeRecord } from "../components/core/state/grades/gradeDataSlice";
import { setOldCourseStates } from "../components/core/state/grades/oldCourseStatesSlice";
import { setGradeCategory } from "../components/core/state/grades/gradeCategorySlice";
import {updateNotifs} from "./backgroundNotifications";

export default async function fetchAndStore(
  data: AllContentResponse,
  dispatch: AppDispatch,
  updateCourseStates: boolean
) {
  const gradeCategory =
    Math.max(
      ...data.courses.map((course) => course.grades.filter((g) => g).length)
    ) - 1;

  dispatch(setReferer(data.referer));
  dispatch(setSessionId(data.sessionId));

  const oldData: GradebookRecord[] = JSON.parse(
    (await Storage.getItem({ key: "records" })) ?? "[]"
  );

  const newData: GradebookRecord = {
    courses: data.courses,
    gradeCategory,
    date: Date.now(),
    gradeCategoryNames: data.gradeCategoryNames,
  };

  dispatch(setGradeCategory(gradeCategory));
  dispatch(setGradeRecord(newData));

  if (updateCourseStates) {
    const oldCourseStates: CourseStateRecord = {};

    for (const course of newData.courses) {
      oldCourseStates[course.key] = captureCourseState(course);
    }

    dispatch(setOldCourseStates(oldCourseStates));

    await Storage.setItem({
      key: "oldCourseStates",
      value: JSON.stringify(oldCourseStates),
    });
  }

  const assignmentHasGrade = (a: Assignment | undefined) => a?.grade && a.grade !== '' && /[^a-z]/i.test(a.grade);
  let hasNewData = false;
  if (oldData[0]) {
    // courseLoop:
    for (const course of newData.courses) {
      const oldCourse = oldData[0].courses.find(c=>c.key === course.key);
      if (!oldCourse) continue;

      hasNewData = hasNewData || course.grades[course.grades.length-1]?.value !== oldCourse.grades[oldCourse.grades.length-1]?.value;

      let notModifiedAssignmentsExist = false;
      const modifiedAssignments = [];
      for (const category of course.gradeCategories!) {
        const oldCategory = oldCourse.gradeCategories!.find(c=>c.name === category.name);

        for (const assignment of category.assignments!) {
          if (!assignment.name) continue;
          const oldAssignment = oldCategory?.assignments?.find(a=>a.name === assignment.name);

          if (assignmentHasGrade(assignment)) {
            if (!assignmentHasGrade(oldAssignment)) {
              modifiedAssignments.push(assignment.name);
              // continue courseLoop;
              hasNewData = true;
            } else if (assignmentHasGrade(assignment)) {
              notModifiedAssignmentsExist = true;
            }
          }
        }
      }

      if (notModifiedAssignmentsExist) {
        for (const n of modifiedAssignments) {
          await updateNotifs(course.key, n);
          console.log("updating", course.key, n);
        }
      }
    }
  }

  await Storage.setItem({
    key: "records",
    value: JSON.stringify([newData, ...oldData]),
  });

  return hasNewData;
}