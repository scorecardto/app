import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ExpoWidgets from '@bittingz/expo-widgets/src/ExpoWidgetsModule';

interface CourseData {
    key: string;
    title: string;
    grade: string;
    color: string;
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

const initialState: WidgetData = { data: JSON.parse(ExpoWidgets.getWidgetData()) };

const widgetSlice = createSlice({
    name: "widgetData",
    initialState,
    reducers: {
        resetPinnedCourses: (state, action: PayloadAction) => {
            state.data = [];
            ExpoWidgets.setWidgetData(JSON.stringify(state.data));
        },
        pinCourse: (state, action: PayloadAction<CourseData>) => {
            if (state.data.length >= MAX_PINNED) return;

            state.data.push(action.payload);

            ExpoWidgets.setWidgetData(JSON.stringify(state.data))
        },
        updateCourseIfPinned: (state, action: PayloadAction<PartialCourseData>) => {
            const newData = state.data
                .map(course => course.key === action.payload.key ? {...course, ...action.payload} : course);
            
            if (JSON.stringify(newData) === JSON.stringify(state.data)) return;
            state.data = newData;

            ExpoWidgets.setWidgetData(JSON.stringify(state.data));
        },
        unpinCourse: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter((course) => course.key !== action.payload);

            ExpoWidgets.setWidgetData(JSON.stringify(state.data));
        }
    },
});

export const { resetPinnedCourses, pinCourse, unpinCourse, updateCourseIfPinned } = widgetSlice.actions;

export default widgetSlice.reducer;
