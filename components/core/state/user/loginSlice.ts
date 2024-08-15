import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LoginSlice {
  district: string;
  username: string;
  password: string;
  referer: string;
  sessionId: string;
  districtName: string;
  districtVipProgramDate: string | null;
  schoolName: string;
  gradeLabel: string;
}

const initialState: LoginSlice = {
  district: "",
  username: "",
  password: "",
  referer: "",
  sessionId: "",
  districtName: "",
  districtVipProgramDate: null,
  schoolName: "",
  gradeLabel: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetLogin: (state) => {
      state.district = "";
      state.username = "";
      state.password = "";
      state.referer = "";
      state.sessionId = "";
      state.districtName = "";
      state.districtVipProgramDate = null;
    },
    setDistrict: (state, action: PayloadAction<string>) => {
      state.district = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setDistrictName: (state, action: PayloadAction<string>) => {
      state.districtName = action.payload;
    },
    setDistrictVipProgramDate: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.districtVipProgramDate = action.payload;
    },
    setSchoolName: (state, action: PayloadAction<string>) => {
      state.schoolName = action.payload;
    },
    setGradeLabel: (state, action: PayloadAction<string>) => {
      state.gradeLabel = action.payload;
    },
  },
});

export const {
  resetLogin,
  setDistrict,
  setUsername,
  setPassword,
  setDistrictVipProgramDate,
  setDistrictName,
  setSchoolName,
  setGradeLabel,
} = loginSlice.actions;

export default loginSlice.reducer;
