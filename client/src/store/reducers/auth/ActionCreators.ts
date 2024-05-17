import { AppDispatch } from "store";
import axios from "axios";
import { api } from "store/api";
import { authSlice } from "./AuthSlice";

import { API_URL } from "config";

const auth = () => {
  let headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const walletToken = localStorage.getItem("walletToken");
  if (walletToken) {
    //@ts-ignore
    headers = { ...headers, walletToken: walletToken };
  }

  return { headers };
};

//AUTH BEGIN.............................................................
export const fetchAuth = (tg: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());

    const response = await axios.get<any>(`${API_URL}${api.auth.auth}`, auth());
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
    const path = window.location.pathname;
    // navigate(path);
  } catch (e: any) {
    dispatch(authSlice.actions.authError(""));
    dispatch(fetchLogin(tg));
    // navigate("/login");
  }
};

export const fetchRegistration =
  (data: { username: string; password: string }, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.registrationFetching());
      const response = await axios.post(
        `${API_URL}${api.auth.registration}`,
        data
      );
      dispatch(authSlice.actions.registrationSuccess(response.data));
      navigate("/login");
    } catch (e: any) {
      dispatch(authSlice.actions.registrationError(e.response.data.message));
    }
  };

export const fetchLogin = (tg: any) => async (dispatch: AppDispatch) => {
  try {
    const params = new URLSearchParams(tg.initData);

    const hash = params.get("hash") || "";

    dispatch(authSlice.actions.loginFetching());
    const response = await axios.post<any>(`${API_URL}${api.auth.login}`, {
      username: tg.initData,
      password: hash,
    });
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
  } catch (e: any) {
    dispatch(authSlice.actions.authError(e.response.data.message));
  }
};

export const logOut = (navigate: any) => (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logout());
  localStorage.removeItem("token");
  navigate("/login");
};
// AUTH END........................................................
