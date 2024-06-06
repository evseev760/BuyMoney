import { CurrentUser } from "models/Auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  error: string;
  isLoading: boolean;
  sendPhoneNumberInstructionsIsLoading: boolean;
  disableTradingIsLoading: boolean;
  message?: string;
  isAuth: boolean;
  currentUser: CurrentUser;
}

const initialState: AuthState = {
  token: "",
  isLoading: false,
  error: "",
  message: "",
  isAuth: false,
  sendPhoneNumberInstructionsIsLoading: false,
  disableTradingIsLoading: false,
  currentUser: {
    id: "",
    username: "",
    roles: [],
    isSuspicious: false,
    nickname: "",
    avatar: "",
    isAnOffice: false,
    delivery: {
      isDelivered: false,
      distance: undefined,
    },
    ratings: {
      average: 0,
      count: 0,
    },
    disableTrading: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
    },
    loginFetching: (state) => {
      state.isLoading = true;
    },

    registrationFetching: (state) => {
      state.isLoading = true;
    },
    registrationSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      state.message = "";
    },
    registrationError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    authFetching: (state) => {
      state.isLoading = true;
    },
    authSuccess: (state, action: PayloadAction<CurrentUser>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.message = "";
      state.isAuth = true;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      state.isAuth = false;
    },

    updateUserDataFetching: (state) => {
      state.isLoading = true;
    },
    updateUserDataSuccess: (state, action: PayloadAction<CurrentUser>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.message = "";
    },
    updateUserDataError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    sendPhoneNumberInstructionsFetching: (state) => {
      state.sendPhoneNumberInstructionsIsLoading = true;
    },
    sendPhoneNumberInstructionsSuccess: (state) => {
      state.sendPhoneNumberInstructionsIsLoading = false;
    },
    sendPhoneNumberInstructionsError: (state) => {
      state.sendPhoneNumberInstructionsIsLoading = false;
    },

    disableTradingFetching: (state) => {
      state.disableTradingIsLoading = true;
    },
    disableTradingSuccess: (state, action: PayloadAction<CurrentUser>) => {
      state.disableTradingIsLoading = false;
      state.currentUser = action.payload;
    },
    disableTradingError: (state) => {
      state.disableTradingIsLoading = false;
    },
  },
});

export default authSlice.reducer;
