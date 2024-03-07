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
import {useEffect} from "react";
import {updateCourseIfPinned} from "../components/core/state/widget/widgetSlice";

export default async function fetchAndStore(
  data: AllContentResponse,
  dispatch: AppDispatch,
  updateCourseStates: boolean
) {
  const gradeCategory =
    Math.max(
      ...data.courses.map((course) => course.grades.filter((g) => g).length)
    ) - 1;

  // data.courses[0].grades[gradeCategory]!.value = "50";
  // data.courses[1].gradeCategories[0].assignments.splice(0, 1);

  for (const course of data.courses) {
    dispatch(updateCourseIfPinned({
      key: course.key,
      grade: course.grades[gradeCategory]?.value ?? "NG",
    }));
  }

  dispatch(setReferer(data.referer));
  dispatch(setSessionId(data.sessionId));

  const oldData: GradebookRecord[] = JSON.parse(
    (await Storage.getItem({ key: "records" })) ?? "[]"
  );

  const newData: GradebookRecord = {
    courses: data.courses.map(c => {
      if ((c.gradeCategories?.length ?? 0) === 0 || c.gradeCategories!.every(gc=>(gc.assignments?.length ?? 0) === 0)) {
        for (let i = 0; i < oldData.length; i++) {
          const oldCourse = oldData[0].courses.find(oc => oc.key === c.key);
          if (oldCourse) return oldCourse;
        }
      }

      return c;
    }),
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
  let hasNewData = new Set<string>();
  if (oldData[0]) {
    // courseLoop:
    for (const course of newData.courses) {
      const oldCourse = oldData[0].courses.find(c=>c.key === course.key);
      if (!oldCourse) continue;

      if (course.grades[gradeCategory]?.value !== oldCourse.grades[gradeCategory]?.value) {
        hasNewData.add(course.key)
      }

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
              hasNewData.add(course.key);
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

  return Array.from(hasNewData);
}