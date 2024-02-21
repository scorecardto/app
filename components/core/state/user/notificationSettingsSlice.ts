import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NotificationSettingsSlice {
  [x: string]: "OFF" | "ON_ONCE" | "ON_ALWAYS";
}

const initialState: NotificationSettingsSlice = {};

const NotificationSettingsSlice = createSlice({
  name: "notificationSettings",
  initialState,
  reducers: {
    resetAllNotifications: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = "OFF";
      });
    },
    setNotification: (
      state,
      action: PayloadAction<{
        key: string;
        value: "OFF" | "ON_ONCE" | "ON_ALWAYS";
      }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    enableAllNotifications: (
      state,
      action: PayloadAction<{
        keys: string[];
      }>
    ) => {
      action.payload.keys.forEach((key) => {
        state[key] = "ON_ALWAYS";
      });
    },
  },
});

export const {
  setNotification,
  resetAllNotifications,
  enableAllNotifications,
} = NotificationSettingsSlice.actions;

export default NotificationSettingsSlice.reducer;
