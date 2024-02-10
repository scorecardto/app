import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./user/loginSlice";
import nameReducer from "./user/nameSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    name: nameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
