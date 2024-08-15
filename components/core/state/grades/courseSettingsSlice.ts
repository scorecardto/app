import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CourseSettings } from "scorecard-types";
import ScorecardModule from "../../../../lib/expoModuleBridge";

interface AllCourseSettings {
  [key: string]: CourseSettings;
}

const initialState: AllCourseSettings = {};

const courseSettingsSlice = createSlice({
  name: "courseSettings",
  initialState,
  reducers: {
    resetCourseSettings: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = {};
      });
    },
    setCourseSetting: (
      state,
      action: PayloadAction<{
        key: string;
        value: CourseSettings;
        save: "STATE_AND_STORAGE" | "STATE" | "STORAGE";
      }>
    ) => {
      if (action.payload.save !== "STORAGE") {
        state[action.payload.key] = {
          ...state[action.payload.key],
          ...action.payload.value,
        };
      }

      if (action.payload.save !== "STATE") {
        ScorecardModule.storeItem("courseSettings", JSON.stringify(state))
      }
    },
    setAllCourseSettings: (state, action: PayloadAction<AllCourseSettings>) => {
      Object.entries(action.payload).forEach((e) => {
        state[e[0]] = e[1];
      });
    },
  },
});

export const { setCourseSetting, setAllCourseSettings, resetCourseSettings } =
  courseSettingsSlice.actions;

export default courseSettingsSlice.reducer;
