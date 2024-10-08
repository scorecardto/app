import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ScorecardModule from "../../../../lib/expoModuleBridge";

interface CourseData {
  key: string;
  title: string;
  grade: string;
  color: string;
}

interface CourseProps {
  course: CourseData;
  order: string[];
}

interface PartialCourseData {
  key: string;
  title?: string;
  grade?: string;
  color?: string;
}

interface WidgetData {
  data: CourseData[];
}

const MAX_PINNED = 3;

const initialState: WidgetData = {
  data: JSON.parse(ScorecardModule.getWidgetData() || "[]"),
};

const widgetSlice = createSlice({
  name: "widgetData",
  initialState,
  reducers: {
    resetPinnedCourses: (state, action: PayloadAction) => {
      state.data = [];
      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
    updateCourseOrder: (state, action: PayloadAction<string[]>) => {
      state.data?.sort?.(
        (a, b) => action.payload.indexOf(a.key) - action.payload.indexOf(b.key)
      );
      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
    unpinUnknownCourses: (state, action: PayloadAction<string[]>) => {
      state.data = state.data.filter((course) => action.payload.includes(course.key));
      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
    pinCourse: (state, action: PayloadAction<CourseProps>) => {
      if (state.data.length >= MAX_PINNED) return;

      const { course, order } = action.payload;

      state.data?.push?.(course);
      state.data?.sort?.((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
    updateCourseIfPinned: (state, action: PayloadAction<PartialCourseData>) => {
      const newData = state?.data?.map?.((course) =>
        course.key === action.payload.key
          ? { ...course, ...action.payload }
          : course
      );

      if (JSON.stringify(newData) === JSON.stringify(state.data)) return;
      state.data = newData;

      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
    unpinCourse: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((course) => course.key !== action.payload);

      ScorecardModule.setWidgetData(JSON.stringify(state.data));
    },
  },
});

export const {
  resetPinnedCourses,
  updateCourseOrder,
  pinCourse,
  unpinCourse,
  updateCourseIfPinned,
  unpinUnknownCourses
} = widgetSlice.actions;

export default widgetSlice.reducer;
