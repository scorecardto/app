import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GradeCategory {
  category: number;
}

const initialState: GradeCategory = {
  category: 0,
};

const gradeCategorySlice = createSlice({
  name: "gradeCategory",
  initialState,
  reducers: {
    setGradeCategory: (state, action: PayloadAction<number>) => {
      state.category = action.payload;
    },
  },
});

export const { setGradeCategory } = gradeCategorySlice.actions;

export { GradeCategory };

export default gradeCategorySlice.reducer;
