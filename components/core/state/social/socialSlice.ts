import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Club, ClubPost } from "scorecard-types";

interface SocialSlice {
  connected: boolean;
  clubs: Club[];
  recentPosts: ClubPost[];
}

const initialState: SocialSlice = {
  connected: false,
  clubs: [],
  recentPosts: [],
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
    setRecentPosts: (state, action: PayloadAction<ClubPost[]>) => {
      state.recentPosts = action.payload;
    },
  },
});

export const { setSocialConnected, setClubs, setRecentPosts } =
  socialSlice.actions;

export default socialSlice.reducer;
