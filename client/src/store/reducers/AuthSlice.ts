import { ICurrentUser } from "../../models/IAuth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  error: string;
  isLoading: boolean;
  message?: string;

  isAuth: boolean;
  currentUser: ICurrentUser;
}

const initialState: AuthState = {
  token: "",
  isLoading: false,
  error: "",
  message: "",
  isAuth: false,
  currentUser: {
    id: "",
    username: "",
    email: "",
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
    authSuccess: (state, action: PayloadAction<ICurrentUser>) => {
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
  },
});

export default authSlice.reducer;
