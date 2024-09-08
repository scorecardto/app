import { Assignment, GradebookRecord } from "scorecard-types";
import CourseStateRecord from "./types/CourseStateRecord";
import captureCourseState from "./captureCourseState";
import { AppDispatch } from "../components/core/state/store";
import { setGradeRecord } from "../components/core/state/grades/gradeDataSlice";
import { setOldCourseStates } from "../components/core/state/grades/oldCourseStatesSlice";
import { setGradeCategory } from "../components/core/state/grades/gradeCategorySlice";
import { updateCourseIfPinned } from "../components/core/state/widget/widgetSlice";
import { AllContent } from "./fetcher";
import ScorecardModule from "./expoModuleBridge";

export default async function fetchAndStore(
  data: AllContent,
  dispatch: AppDispatch,
  updateCourseStates: boolean,
  updateWidget = true
) {
  const gradeCategory =
    Math.max(
      ...data.courses.map((course) => course.grades.filter((g) => g).length)
    ) - 1;

  // data.courses[0].grades[gradeCategory]!.value = "0";

  if (updateWidget) {
    for (const course of data.courses) {
      dispatch(
        updateCourseIfPinned({
          key: course.key,
          grade: course.grades[gradeCategory]?.value ?? "NG",
        })
      );
    }
  }

  const oldData: GradebookRecord[] = JSON.parse(
    ScorecardModule.getItem("records") ?? "[]"
  );

  const newData: GradebookRecord = {
    courses: data.courses.map((c) => {
      if (
        (c.gradeCategories?.length ?? 0) === 0 ||
        c.gradeCategories!.every((gc) => (gc.assignments?.length ?? 0) === 0)
      ) {
        for (let i = 0; i < oldData.length; i++) {
          if (oldData[i].gradeCategory != gradeCategory) continue;
          const oldCourse = oldData[i].courses.find((oc) => oc.key === c.key);
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

    ScorecardModule.storeItem(
      "oldCourseStates",
      JSON.stringify(oldCourseStates)
    );
  }

  const assignmentHasGrade = (a: Assignment | undefined) =>
    a?.grade && a.grade !== "" && /[^a-z]/i.test(a.grade);
  let hasNewData = new Set<string>();
  if (oldData[0]) {
    // courseLoop:
    for (const course of newData.courses) {
      const oldCourse = oldData[0].courses.find((c) => c.key === course.key);
      if (!oldCourse) continue;

      if (
        course.grades[gradeCategory]?.value !==
        oldCourse.grades[gradeCategory]?.value
      ) {
        hasNewData.add(course.key);
      }

      const modifiedAssignments = [];
      for (const category of course.gradeCategories!) {
        const oldCategory = oldCourse.gradeCategories!.find(
          (c) => c.name === category.name
        );

        if (category.average !== oldCategory?.average) {
          hasNewData.add(course.key);
        }

        for (const assignment of category.assignments!) {
          if (!assignment.name) continue;
          const oldAssignment = oldCategory?.assignments?.find(
            (a) => a.name === assignment.name
          );

          if (assignmentHasGrade(assignment)) {
            if (!assignmentHasGrade(oldAssignment)) {
              modifiedAssignments.push(assignment.name);
              // continue courseLoop;
              hasNewData.add(course.key);
            }
          }
        }
      }
    }
  }

  ScorecardModule.storeItem("records", JSON.stringify([newData, ...oldData]));

  return Array.from(hasNewData);
}
