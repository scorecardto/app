import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GradebookRecord } from "scorecard-types";

interface GradeData {
  record: GradebookRecord | null;
  oldRecord: GradebookRecord | null;
}

const initialState: GradeData = {
  record: null,
  oldRecord: null
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
    }
  },
});

export const { setGradeRecord, setPreviousGradeRecord, resetGradeData } = gradeDataSlice.actions;

export { GradeData };

export default gradeDataSlice.reducer;
