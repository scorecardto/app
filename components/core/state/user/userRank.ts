import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserRankType from "../../../../lib/types/UserRankType";

interface UserRank {
  type: UserRankType;
}

const initialState: UserRank = {
  type: "DEFAULT",
};

const userRankSlice = createSlice({
  name: "userRank",
  initialState,
  reducers: {
    resetUserRank: (state) => {
      state.type = "DEFAULT";
    },
    setUserRankType: (state, action: PayloadAction<UserRankType>) => {
      state.type = action.payload;
    },
  },
});

export const { setUserRankType, resetUserRank } = userRankSlice.actions;

export default userRankSlice.reducer;
