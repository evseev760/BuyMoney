import { AppDispatch } from "store";
import axios from "axios";
import { api, auth } from "store/api";
import { authSlice } from "./AuthSlice";

import { API_URL } from "config";
import { CurrentUser, UpdateUserData } from "models/Auth";

export const fetchAuth = (tg: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());

    const response = await axios.get<any>(`${API_URL}${api.auth.auth}`, auth());
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
    if (response?.data.user?.username !== tg?.initDataUnsafe?.user?.username) {
      dispatch(fetchLogin(tg));
    }
  } catch (e: any) {
    dispatch(authSlice.actions.authError(""));
    dispatch(fetchLogin(tg));
  }
};

export const fetchLogin = (tg: any) => async (dispatch: AppDispatch) => {
  try {
    const params = new URLSearchParams(tg.initData);

    const hash = params.get("hash") || "";

    dispatch(authSlice.actions.loginFetching());
    const response = await axios.post<any>(`${API_URL}${api.auth.login}`, {
      userData: tg.initData,
      hash: hash,
    });
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
  } catch (e: any) {
    dispatch(authSlice.actions.authError(e.response.data.message));
  }
};

export const updateUserData =
  (data: UpdateUserData, callback?: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.updateUserDataFetching());
      const response = await axios.post(
        `${API_URL}${api.auth.updateUserData}`,
        data,
        auth()
      );
      dispatch(authSlice.actions.updateUserDataSuccess(response.data));
      callback && callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(authSlice.actions.updateUserDataError(e.response.data.message));
    }
  };

export const userDataWathUpdated =
  (data: CurrentUser) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.updateUserDataSuccess(data));
  };

export const updateUserLocation =
  (
    data: { latitude: number; longitude: number },
    callback?: () => void,
    errorCallback?: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.updateUserDataFetching());
      const response = await axios.post(
        `${API_URL}${api.auth.updateUserLocation}`,
        data,
        auth()
      );
      dispatch(authSlice.actions.updateUserDataSuccess(response.data));
      callback && callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(authSlice.actions.updateUserDataError(e.response.data.message));
    }
  };
export const sendPhoneNumberInstructions =
  (callback?: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.sendPhoneNumberInstructionsFetching());
      await axios.post(
        `${API_URL}${api.auth.sendPhoneNumberInstructions}`,
        {},
        auth()
      );
      dispatch(authSlice.actions.sendPhoneNumberInstructionsSuccess());
      callback && callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(authSlice.actions.sendPhoneNumberInstructionsError());
    }
  };
