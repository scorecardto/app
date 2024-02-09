import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LoginSlice {
  district: string;
  username: string;
  password: string;
  referer: string;
  sessionId: string;
}

const initialState: LoginSlice = {
  district: "",
  username: "",
  password: "",
  referer: "",
  sessionId: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setDistrict: (state, action: PayloadAction<string>) => {
      state.district = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setReferer: (state, action: PayloadAction<string>) => {
      state.referer = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
  },
});

export const {
  setDistrict,
  setUsername,
  setPassword,
  setReferer,
  setSessionId,
} = loginSlice.actions;

export default loginSlice.reducer;
