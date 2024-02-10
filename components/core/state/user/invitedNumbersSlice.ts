import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InvitedNumbers {
  numbers: string[] | null;
}

const initialState: InvitedNumbers = {
  numbers: null,
};

const invitedNumbersSlice = createSlice({
  name: "invitedNumbers",
  initialState,
  reducers: {
    setInvitedNumbers: (state, action: PayloadAction<string[] | null>) => {
      state.numbers = action.payload;
    },
  },
});

export const { setInvitedNumbers } = invitedNumbersSlice.actions;

export default invitedNumbersSlice.reducer;
