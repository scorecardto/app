import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface VirtualSheetsSlice {
  sheetIds: string[];
}

const initialState: VirtualSheetsSlice = {
  sheetIds: [],
};

const virtualSheetsSlice = createSlice({
  name: "virtualSheets",
  initialState,
  reducers: {
    setVirtualSheetIds: (state, action: PayloadAction<string[]>) => {
      state.sheetIds = action.payload;
    },
    addVirtualSheetId: (state, action: PayloadAction<string>) => {
      state.sheetIds.push(action.payload);
    },
    removeLatestVirtualSheetId: (state, action) => {
      state.sheetIds.shift();
    },
  },
});

export const {
  setVirtualSheetIds,
  addVirtualSheetId,
  removeLatestVirtualSheetId,
} = virtualSheetsSlice.actions;

export default virtualSheetsSlice.reducer;
