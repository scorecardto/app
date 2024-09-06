import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Club, ClubPost } from "scorecard-types";

interface SocialSlice {
  connected: boolean;
  clubs: Club[];
  recentPosts: ClubPost[];
  preferredEmail: string | undefined;
}

const initialState: SocialSlice = {
  connected: false,
  clubs: [],
  recentPosts: [],
  preferredEmail: undefined,
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
    setPreferredEmail: (state, action: PayloadAction<string | undefined>) => {
      state.preferredEmail = action.payload;
    },
  },
});

export const {
  setSocialConnected,
  setClubs,
  setRecentPosts,
  setPreferredEmail,
} = socialSlice.actions;

export default socialSlice.reducer;
