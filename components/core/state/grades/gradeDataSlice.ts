import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GradebookRecord } from "scorecard-types";

interface GradeData {
  record: GradebookRecord | null;
}

const initialState: GradeData = {
  record: null,
};

const gradeDataSlice = createSlice({
  name: "gradeData",
  initialState,
  reducers: {
    setGradeRecord: (state, action: PayloadAction<GradeData["record"]>) => {
      state.record = action.payload;
    },
  },
});

export const { setGradeRecord } = gradeDataSlice.actions;

export { GradeData };

export default gradeDataSlice.reducer;
