import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CourseGlyphsSlice {
    glyphs: string[];
}

const initialState: CourseGlyphsSlice = {
    glyphs: [],
};

const courseGlyphsSlice = createSlice({
    name: "courseGlyphs",
    initialState,
    reducers: {
        setCourseGlyphs: (state, action: PayloadAction<string[]>) => {
            state.glyphs = action.payload;
        },
    },
});

export const { setCourseGlyphs } = courseGlyphsSlice.actions;

export default courseGlyphsSlice.reducer;
