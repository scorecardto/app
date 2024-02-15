import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SettingsSlice {
  enableGradebookPushNotifications: boolean;
  gradebookCheckInterval: string;
}

const initialState: SettingsSlice = {
  enableGradebookPushNotifications: false,
  gradebookCheckInterval: "morning",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      state.enableGradebookPushNotifications =
        initialState.enableGradebookPushNotifications;
      state.gradebookCheckInterval = initialState.gradebookCheckInterval;
    },

    setEnableGradebookPushNotifications: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableGradebookPushNotifications = action.payload;
    },
    setGradebookCheckInterval: (state, action: PayloadAction<string>) => {
      state.gradebookCheckInterval = action.payload;
    },
    setAllSettings: (state, action: PayloadAction<object>) => {
      const enableGradebookPushNotifications =
        // @ts-ignore
        action.payload.enableGradebookPushNotifications;

      if (typeof enableGradebookPushNotifications === "boolean") {
        state.enableGradebookPushNotifications =
          enableGradebookPushNotifications;
      }

      const gradebookCheckInterval =
        // @ts-ignore
        action.payload.gradebookCheckInterval;

      if (typeof gradebookCheckInterval === "string") {
        state.gradebookCheckInterval = gradebookCheckInterval;
      }
    },
  },
});

export const {
  setEnableGradebookPushNotifications,
  setGradebookCheckInterval,
  setAllSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
