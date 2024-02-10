import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    },
  },
});

export const { setCourseOrder } = courseOrderSlice.actions;

export default courseOrderSlice.reducer;
