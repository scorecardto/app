import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {Assignment, Course, GradebookRecord, GradeCategory, CourseGrade} from "scorecard-types";
import ScorecardModule from "../../../../lib/expoModuleBridge";

interface GradeChanges {
  courses: {[key: string]: {name: boolean, average: boolean}};
  gradeCategories: {[course: string]: {[id: string]: {name: boolean, average: boolean, weight: boolean}}};
  assignments: {[course: string]: {[category: string]: {[name: string]: {name: boolean, grade: boolean, dropped: boolean, count: boolean}}}};
}

interface GradeData {
  record: GradebookRecord | null;
  oldRecord: GradebookRecord | null;
  gradeChanges: GradeChanges;
}

const initialState: GradeData = {
  record: null,
  oldRecord: null,
  gradeChanges: JSON.parse(ScorecardModule.getItem("gradeChanges") ?? "null") ?? {
    courses: {},
    gradeCategories: {},
    assignments: {},
  },
};

const gradeDataSlice = createSlice({
  name: "gradeData",
  initialState,
  reducers: {
    resetGradeData: (state) => {
      state.record = state.oldRecord = null;
    },
    setGradeRecord: (state, action: PayloadAction<GradeData["record"]>) => {
      state.record = action.payload;
    },
    setPreviousGradeRecord: (state, action: PayloadAction<GradeData["oldRecord"]>) => {
      state.oldRecord = action.payload;
    },
    updateGradeChanges: (state, action: PayloadAction<GradebookRecord>) => {
      const newRecord: GradebookRecord = action.payload;

      const prevRecord: GradebookRecord = JSON.parse(ScorecardModule.getItem("lastComparedRecord") ?? "null");
      ScorecardModule.storeItem("lastComparedRecord", JSON.stringify(newRecord));
      if (!prevRecord) return;

      const changes = state.gradeChanges;

      for (const c in newRecord.courses) {
        const course = newRecord.courses[c];
        const oldCourse = prevRecord.courses?.find((c) => c.key === course.key);
        if (!oldCourse) { // the whole course is new
          changes.courses[course.key] = {name: true, average: true};
          continue;
        }

        const changedCourse = changes.courses[course.key] ?? {name: false, average: false};
        changedCourse.average ||= course.grades[newRecord.gradeCategory]?.value != oldCourse.grades[newRecord.gradeCategory]?.value

        for (const cat in course.gradeCategories!) {
          const category = course.gradeCategories![cat];
          const oldCategory = oldCourse.gradeCategories?.find((c) => c.id === category.id);
          changes.gradeCategories[course.key] = changes.gradeCategories[course.key] ?? {};
          if (!oldCategory) { // the whole category is new
            changedCourse.name = true;
            changes.gradeCategories[course.key][category.id] = {name: true, average: true, weight: true};
            continue;
          }

          const changedCategory = changes.gradeCategories[course.key][category.id] ?? {name: false, average: false, weight: false};
          changedCategory.average ||= category.average != oldCategory.average;
          changedCategory.weight ||= category.weight != oldCategory.weight;

          for (const a in category.assignments!) {
            const assignment = category.assignments![a];
            const oldAssignment = oldCategory.assignments?.find((a) => a.name === assignment.name);

            changes.assignments[course.key] = changes.assignments[course.key] ?? {};
            changes.assignments[course.key][category.id] = changes.assignments[course.key][category.id] ?? {};
            if (!oldAssignment) { // the whole assignment is new
              changes.assignments[course.key][category.id][assignment.name!] = {name: true, grade: true, dropped: true, count: true};
              continue;
            }

            const changedAssignment = changes.assignments[course.key][category.id][assignment.name!] ?? {points: false, grade: false, dropped: false, scale: false, max: false, count: false};
            changedAssignment.grade ||= assignment.grade != oldAssignment.grade;
            changedAssignment.dropped ||= assignment.dropped != oldAssignment.dropped;
            changedAssignment.count ||= assignment.count != oldAssignment.count;

            if (changedAssignment.grade || changedAssignment.dropped || changedAssignment.name || changedAssignment.count) changedCategory.name = true;

            changes.assignments[course.key][category.id][assignment.name!] = changedAssignment;
          }

          if (changedCategory.name || changedCategory.average || changedCategory.weight) changedCourse.name = true;
          changes.gradeCategories[course.key][category.id] = changedCategory;
        }

        changes.courses[course.key] = changedCourse;
      }

      ScorecardModule.storeItem("gradeChanges", JSON.stringify(changes));
    },
    clearGradeChanges: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.gradeChanges.courses[key];
      delete state.gradeChanges.gradeCategories[key];
      delete state.gradeChanges.assignments[key];
      ScorecardModule.storeItem("gradeChanges", JSON.stringify(state.gradeChanges));
    },
  },
});

export const { setGradeRecord, setPreviousGradeRecord, resetGradeData, updateGradeChanges, clearGradeChanges } = gradeDataSlice.actions;

export { GradeData };

export default gradeDataSlice.reducer;
