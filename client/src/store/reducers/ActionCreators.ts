import { AppDispatch } from "../";
import axios from "axios";
import { api } from "../api";
import { userSlice } from "./UserSlice";
import { authSlice } from "./AuthSlice";
import { offerSlice } from "./OfferSlice";

import { API_URL } from "../../config";
import { EmptyOfferData, IOffer } from "../../models/IOffer";
import { IOfferCreateData } from "../../pages/Offer/Offers/CreateOfferModal";
import { IMessage } from "../../models/IMessage";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.usersFetching());
    const response = await axios.get<any>(`${API_URL}${api.auth.users}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(userSlice.actions.usersFetchingSuccess(response.data));
  } catch (e: any) {
    dispatch(userSlice.actions.usersFetchingError(e.message));
  }
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
    console.log(777, tg, params, hash);

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
//CHATS BEGIN......................................................

export const fetchOffers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(offerSlice.actions.offersFetching());
    const response = await axios.get<IOffer[]>(
      `${API_URL}${api.offer.getOffers}`,
      auth()
    );
    dispatch(offerSlice.actions.offersSuccess(response.data));
  } catch (e: any) {
    dispatch(offerSlice.actions.offersError(e.response.data.message));
  }
};

export const createOffer =
  (data: EmptyOfferData, callback: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.createOfferFetching());
      const response = await axios.post<any>(
        `${API_URL}${api.offer.createOffer}`,
        data,
        auth()
      );
      dispatch(offerSlice.actions.createOfferSuccess(response.data));
      // dispatch(fetchOffers());
      callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(offerSlice.actions.createOfferError(e.response.data.message));
    }
  };

export const setNewOffer =
  (data: EmptyOfferData, callback?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(offerSlice.actions.updateNewOffer(data));
    callback && callback();
  };
export const clearNewOffer = () => async (dispatch: AppDispatch) => {
  dispatch(offerSlice.actions.clearNewOffer());
};

export const fetchOffer = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(offerSlice.actions.offerFetching());
    const response = await axios.get<IOffer>(
      `${API_URL}${api.offer.getOffer}/${id}`,
      auth()
    );
    dispatch(offerSlice.actions.offerSuccess(response.data));
  } catch (e: any) {
    dispatch(offerSlice.actions.offerError(e.response.data.message));
  }
};

export const fetchPrice =
  (crypto: string, fiat: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.priceFetching());
      const response = await axios.get(
        `${API_URL}${api.offer.getPrice}?crypto=${crypto}&fiat=${fiat}`,
        auth()
      );
      dispatch(offerSlice.actions.priceSuccess(response));
    } catch (e: any) {
      dispatch(offerSlice.actions.priceError(e.response.data.message));
    }
  };

export const leaveTheOffer = () => (dispatch: AppDispatch) => {
  dispatch(offerSlice.actions.leaveTheOffer());
};
// export const fetchProposals =
//   (id: string, callBack?: () => void) => async (dispatch: AppDispatch) => {
//     try {
//       dispatch(offerSlice.actions.messagesFetching());
//       const response = await axios.get<IMessage[]>(
//         `${API_URL}${api.offer.getProposals}/${id}`,
//         auth()
//       );
//       dispatch(offerSlice.actions.messagesSuccess(response.data));
//       callBack && callBack();
//     } catch (e: any) {
//       dispatch(offerSlice.actions.messagesError(e.response.data.message));
//     }
//   };

// export const addProposal =
//   (
//     data: { offerId: string; quantity: number; createdAt: number },
//     callBack?: () => void
//   ) =>
//   async (dispatch: AppDispatch) => {
//     try {
//       dispatch(offerSlice.actions.addMessageFetching());
//       const response = await axios.post<any>(
//         `${API_URL}${api.offer.addProposal}`,
//         data,
//         auth()
//       );
//       dispatch(offerSlice.actions.addMessageSuccess(response.data));
//       callBack && callBack();
//       dispatch(fetchProposals(data.offerId));
//     } catch (e: any) {
//       dispatch(offerSlice.actions.addMessageError(e.response.data.message));
//     }
//   };
