import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";
import CourseStateRecord from "../../../../lib/types/CourseStateRecord";
import RefreshStatus from "../../../../lib/types/RefreshStatus";

const initialState: RefreshStatus = {
  status: "No Data to Load",
  taskRemaining: 0,
  tasksCompleted: 0,
  type: "IDLE",
};

const refreshStatusSlice = createSlice({
  name: "refreshStatus",
  initialState,
  reducers: {
    resetRefreshStatus: (state) => {
      state.status = "No Data to Load";
      state.taskRemaining = 0;
      state.tasksCompleted = 0;
      state.type = "IDLE";
      state.courseKey = undefined;
      state.reportCard = undefined;
    },
    setRSMessage: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setRSTasksRemaining: (state, action: PayloadAction<number>) => {
      state.taskRemaining = action.payload;
    },
    setRSTasksCompleted: (state, action: PayloadAction<number>) => {
      state.tasksCompleted = action.payload;
    },
    setRSType: (state, action: PayloadAction<RefreshStatus["type"]>) => {
      state.type = action.payload;
    },

    setRSCourseKey: (state, action: PayloadAction<string | undefined>) => {
      state.courseKey = action.payload;
    },
    setRSReportCard: (
      state,
      action: PayloadAction<RefreshStatus["reportCard"]>
    ) => {
      state.reportCard = action.payload;
    },
    setRefreshStatus: (state, action: PayloadAction<RefreshStatus>) => {
      const {
        status,
        taskRemaining,
        tasksCompleted,
        type,
        courseKey,
        reportCard,
      } = action.payload;
      state.status = status;
      state.taskRemaining = taskRemaining;
      state.tasksCompleted = tasksCompleted;
      state.type = type;
      state.reportCard = reportCard;
      state.courseKey = courseKey;
    },
  },
});

export const {
  setRSMessage,
  setRSTasksCompleted,
  setRSTasksRemaining,
  setRSType,
  setRSCourseKey,
  setRSReportCard,
  setRefreshStatus,
  resetRefreshStatus,
} = refreshStatusSlice.actions;

export default refreshStatusSlice.reducer;
