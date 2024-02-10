import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";
import CourseStateRecord from "../../../../lib/types/CourseStateRecord";

interface OldCourseStates {
  record: CourseStateRecord;
}

const initialState: OldCourseStates = {
  record: {},
};

const oldCourseStatesSlice = createSlice({
  name: "oldCourseStates",
  initialState,
  reducers: {
    setOldCourseStates: (state, action: PayloadAction<CourseStateRecord>) => {
      state.record = action.payload;
    },
  },
});

export const { setOldCourseStates } = oldCourseStatesSlice.actions;

export default oldCourseStatesSlice.reducer;
