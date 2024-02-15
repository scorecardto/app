import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NameSlice {
  firstName: string;
  lastName: string;
}

const initialState: NameSlice = {
  firstName: "",
  lastName: "",
};

const nameSlice = createSlice({
  name: "name",
  initialState,
  reducers: {
    resetName: (state) => {
      state.firstName = "";
      state.lastName = "";
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
  },
});

export const { setFirstName, setLastName, resetName } = nameSlice.actions;

export default nameSlice.reducer;
