import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ExpoWidgets from "@bittingz/expo-widgets/src/ExpoWidgetsModule";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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
  data: JSON.parse(ExpoWidgets?.getWidgetData?.() || `{"data":[]}`),
};

const widgetSlice = createSlice({
  name: "widgetData",
  initialState,
  reducers: {
    resetPinnedCourses: (state, action: PayloadAction) => {
      state.data = [];
      ExpoWidgets.setWidgetData(JSON.stringify(state.data));
    },
    updateCourseOrder: (state, action: PayloadAction<string[]>) => {
      state?.data?.sort?.(
        (a, b) => action.payload.indexOf(a.key) - action.payload.indexOf(b.key)
      );
      ExpoWidgets.setWidgetData(JSON.stringify(state.data));
    },
    pinCourse: (state, action: PayloadAction<CourseProps>) => {
      if (state.data.length >= MAX_PINNED) return;

      const { course, order } = action.payload;

      state.data?.push?.(course);
      state.data?.sort?.((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

      ExpoWidgets.setWidgetData(JSON.stringify(state.data));
    },
    updateCourseIfPinned: (state, action: PayloadAction<PartialCourseData>) => {
      const newData = state?.data?.map?.((course) =>
        course.key === action.payload.key
          ? { ...course, ...action.payload }
          : course
      );

      if (JSON.stringify(newData) === JSON.stringify(state.data)) return;
      state.data = newData;

      ExpoWidgets.setWidgetData(JSON.stringify(state.data));
    },
    unpinCourse: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((course) => course.key !== action.payload);

      ExpoWidgets.setWidgetData(JSON.stringify(state.data));
    },
  },
});

export const {
  resetPinnedCourses,
  updateCourseOrder,
  pinCourse,
  unpinCourse,
  updateCourseIfPinned,
} = widgetSlice.actions;

export default widgetSlice.reducer;
