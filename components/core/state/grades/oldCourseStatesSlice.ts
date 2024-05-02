import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";
import CourseStateRecord from "../../../../lib/types/CourseStateRecord";
import CourseState from "../../../../lib/types/CourseState";
import ScorecardModule from "../../../../lib/expoModuleBridge";

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
    resetOldCourseStates: (state) => {
      state.record = {};
    },
    setOldCourseStates: (state, action: PayloadAction<CourseStateRecord>) => {
      state.record = action.payload;
    },
    setOldCourseState(
      state,
      action: PayloadAction<{
        key: string;
        value: CourseState;
        save: "STATE_AND_STORAGE" | "STATE" | "STORAGE";
      }>
    ) {
      if (action.payload.save !== "STORAGE") {
        state.record[action.payload.key] = action.payload.value;
      }

      if (action.payload.save !== "STATE") {
        ScorecardModule.storeItem("oldCourseStates", JSON.stringify(state.record))
      }
    },
  },
});

export const { setOldCourseStates, setOldCourseState, resetOldCourseStates } =
  oldCourseStatesSlice.actions;

export default oldCourseStatesSlice.reducer;
