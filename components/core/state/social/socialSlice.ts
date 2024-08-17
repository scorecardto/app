import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SocialSlice {
  connected: boolean;
}

const initialState: SocialSlice = {
  connected: false,
};

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setSocialConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

export const { setSocialConnected } = socialSlice.actions;

export default socialSlice.reducer;
