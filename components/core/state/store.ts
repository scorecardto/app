import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./user/loginSlice";
import nameReducer from "./user/nameSlice";
import settingsReducer from "./user/settingsSlice";
import userRankReducer from "./user/userRank";
import oldCourseStatesReducer from "./grades/oldCourseStatesSlice";
import refreshStatusReducer from "./grades/refreshStatusSlice";
import invitedNumbersReducer from "./user/invitedNumbersSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    name: nameReducer,
    settings: settingsReducer,
    userRank: userRankReducer,
    oldCourseStates: oldCourseStatesReducer,
    refreshStatus: refreshStatusReducer,
    invitedNumbers: invitedNumbersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
