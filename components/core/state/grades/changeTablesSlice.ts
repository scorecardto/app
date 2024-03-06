import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {ChangeTable} from "../../../../lib/types/ChangeTableEntry";

interface ChangeTablesSlice {
  tables: {[idx: string]: ChangeTable};
}

const initialState: ChangeTablesSlice = {tables: {}};

const changeTablesSlice = createSlice({
  name: "changeTables",
  initialState,
  reducers: {
    setChangeTable(state, action: PayloadAction<{key: string, table: ChangeTable}>) {
      state.tables[action.payload.key] = action.payload.table;
    }
  },
});

export const { setChangeTable } = changeTablesSlice.actions;

export default changeTablesSlice.reducer;
