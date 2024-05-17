import { AppDispatch } from "store";
import { Application, applicationSlice } from "./ApplicationSlice";
import { API_URL } from "config";
import { api } from "store/api";
import axios from "axios";

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

export const editApplication =
  (application: Application) => async (dispatch: AppDispatch) => {
    dispatch(applicationSlice.actions.editApplication(application));
  };

export const createApplication =
  (data: Application, callback: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(applicationSlice.actions.createApplicationFetching());
      const response = await axios.post(
        `${API_URL}${api.application.createApplication}`,
        data,
        auth()
      );
      dispatch(
        applicationSlice.actions.createApplicationSuccess(response.data)
      );
      // dispatch(fetchOffers());
      callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(
        applicationSlice.actions.createApplicationError(e.response.data.message)
      );
    }
  };

export const getMyApplications =
  (callback?: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(applicationSlice.actions.getMyApplicationsFetching());
      const response = await axios.get(
        `${API_URL}${api.application.getMyApplications}`,
        auth()
      );
      dispatch(
        applicationSlice.actions.getMyApplicationsSuccess(response.data)
      );
      // dispatch(fetchOffers());
      callback && callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(
        applicationSlice.actions.getMyApplicationsError(e.response.data.message)
      );
    }
  };
