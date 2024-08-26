import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Club } from "scorecard-types";

interface SocialSlice {
  connected: boolean;
  clubs: Club[];
}

const initialState: SocialSlice = {
  connected: false,
  clubs: [],
};

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setSocialConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setClubs: (state, action: PayloadAction<Club[]>) => {
      state.clubs = action.payload;
    },
  },
});

export const { setSocialConnected, setClubs } = socialSlice.actions;

export default socialSlice.reducer;
