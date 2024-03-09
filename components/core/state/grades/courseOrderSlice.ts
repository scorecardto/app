import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Storage from "expo-storage";

interface CourseOrder {
  order: string[];
}

const initialState: CourseOrder = {
  order: [],
};

const courseOrderSlice = createSlice({
  name: "courseOrder",
  initialState,
  reducers: {
    setCourseOrder: (state, action: PayloadAction<string[]>) => {
      state.order = action.payload;
      Storage.setItem({ key: "courseOrder", value: JSON.stringify(action.payload) });
    },
  },
});

export const { setCourseOrder } = courseOrderSlice.actions;

export default courseOrderSlice.reducer;
