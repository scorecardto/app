import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";
import CourseStateRecord from "../../../../lib/types/CourseStateRecord";
import RefreshStatus from "../../../../lib/types/RefreshStatus";
import { CourseSettings, GradebookRecord } from "scorecard-types";

interface GradeData {
  gradeCategory: number;
  record: GradebookRecord | null;
  courseSettings: { [key: string]: CourseSettings };
  courseOrder: string[] | null;
}

const initialState: GradeData = {
  gradeCategory: 0,
  record: null,
  courseOrder: null,
  courseSettings: {},
};

const gradeDataSlice = createSlice({
  name: "gradeData",
  initialState,
  reducers: {
    setGradeCategory: (
      state,
      action: PayloadAction<GradeData["gradeCategory"]>
    ) => {
      state.gradeCategory = action.payload;
    },
    setCourseOrder: (
      state,
      action: PayloadAction<GradeData["courseOrder"]>
    ) => {
      state.courseOrder = action.payload;
    },
    setCourseSettings: (
      state,
      action: PayloadAction<GradeData["courseSettings"]>
    ) => {
      state.courseSettings = action.payload;
    },
    setGradeRecord: (state, action: PayloadAction<GradeData["record"]>) => {
      state.record = action.payload;
    },
    setGradeData: (state, action: PayloadAction<GradeData>) => {
      state.courseOrder = action.payload.courseOrder;
      state.courseSettings = action.payload.courseSettings;
      state.gradeCategory = action.payload.gradeCategory;
      state.record = action.payload.record;
    },
  },
});

export const {
  setCourseOrder,
  setCourseSettings,
  setGradeCategory,
  setGradeData,
  setGradeRecord,
} = gradeDataSlice.actions;

export { GradeData };

export default gradeDataSlice.reducer;
