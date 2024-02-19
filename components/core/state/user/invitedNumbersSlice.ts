import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Storage from "expo-storage";
interface InvitedNumbers {
  numbers: string[] | null;
  openInviteSheetDate: number | null;
}

const initialState: InvitedNumbers = {
  numbers: null,
  openInviteSheetDate: null,
};

const invitedNumbersSlice = createSlice({
  name: "invitedNumbers",
  initialState,
  reducers: {
    resetInvitedNumbers: (state) => {
      state.numbers = null;
      state.openInviteSheetDate = null;
    },
    addInvitedNumber: (state, action: PayloadAction<string>) => {
      if (state.numbers === null) {
        state.numbers = [action.payload];
      } else {
        state.numbers.push(action.payload);
      }
    },
    setInvitedNumbers: (state, action: PayloadAction<string[] | null>) => {
      state.numbers = action.payload;
    },
    setOpenInviteSheetDate: (state, action: PayloadAction<number | null>) => {
      state.openInviteSheetDate = action.payload;
    },
    saveInvitedNumbers: (state) => {
      Storage.setItem({
        key: "invitedNumbers",
        value: JSON.stringify(state.numbers),
      });
    },
  },
});

export const {
  setInvitedNumbers,
  resetInvitedNumbers,
  setOpenInviteSheetDate,
  saveInvitedNumbers,
  addInvitedNumber,
} = invitedNumbersSlice.actions;

export default invitedNumbersSlice.reducer;
