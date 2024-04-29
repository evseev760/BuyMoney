import { IUser } from "../../models/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VerificationState {
  verification: boolean;
  isLoading: boolean;
  error: string;
}
const initialState: VerificationState = {
  verification: false,
  isLoading: false,
  error: "",
};

export const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    verifyFetching: (state) => {
      state.isLoading = true;
    },
    verifySuccess: (state, action: PayloadAction<boolean>) => {
      state.isLoading = false;
      state.verification = action.payload;
      state.error = "";
    },
    verifyError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default verifySlice.reducer;
