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
    setUserRankType: (state, action: PayloadAction<UserRankType>) => {
      state.type = action.payload;
    },
  },
});

export const { setUserRankType } = userRankSlice.actions;

export default userRankSlice.reducer;
