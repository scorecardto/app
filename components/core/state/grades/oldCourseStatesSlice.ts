import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";
import CourseStateRecord from "../../../../lib/types/CourseStateRecord";
import CourseState from "../../../../lib/types/CourseState";
import Storage from "expo-storage";

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
        Storage.setItem({
          key: "oldCourseStates",
          value: JSON.stringify(state.record),
        });
      }
    },
  },
});

export const { setOldCourseStates, setOldCourseState } =
  oldCourseStatesSlice.actions;

export default oldCourseStatesSlice.reducer;
