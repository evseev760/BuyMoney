import { AppDispatch } from "../";
import axios from "axios";
import { IUser } from "../../models/IUser";
import { userSlice } from "./UserSlice";
import { authSlice } from "./AuthSlice";

import { API_URL } from "../../config";

// export const fetchUsers = createAsyncThunk(
//   "user/fetchAll",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get<IUser[]>(
//         "https://jsonplaceholder.typicode.com/user2s"
//       );
//       return response.data;
//     } catch (e) {
//       return thunkAPI.rejectWithValue("Не удалось загрузить пользователей");
//     }
//   }
// );
export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.usersFetching());
    const response = await axios.get<IUser[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    dispatch(userSlice.actions.usersFetchingSuccess(response.data));
  } catch (e: any) {
    dispatch(userSlice.actions.usersFetchingError(e.message));
  }
};
export const fetchAuth = (navigate: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());

    const response = await axios.get<any>(`${API_URL}auth/auth`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
    navigate("/");
  } catch (e: any) {
    dispatch(authSlice.actions.authError(""));
    navigate("/login");
  }
};
export const fetchRegistration =
  (data: { username: string; password: string }, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.registrationFetching());
      const response = await axios.post(`${API_URL}auth/registration`, data);
      dispatch(authSlice.actions.registrationSuccess(response.data));
      navigate("/login");
    } catch (e: any) {
      dispatch(authSlice.actions.registrationError(e.response.data.message));
    }
  };

export const fetchLogin =
  (data: { username: string; password: string }, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.loginFetching());
      const response = await axios.post<any>(`${API_URL}auth/login`, data);
      dispatch(authSlice.actions.authSuccess(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (e: any) {
      dispatch(authSlice.actions.authError(e.response.data.message));
    }
  };

export const logOut = (navigate: any) => (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logout());
  localStorage.removeItem("token");
  navigate("/login");
};
