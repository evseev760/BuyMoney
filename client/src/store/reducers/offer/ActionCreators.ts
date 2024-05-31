import { AppDispatch } from "store";
import axios from "axios";
import { api, auth } from "store/api";

import { offerSlice } from "./OfferSlice";

import { API_URL } from "config";
import { EmptyOfferData, OfferData } from "models/IOffer";
import { Filter } from "../filter/FilterSlice";

export const fetchOffers =
  (filter?: Filter) => async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.offersFetching());
      let url = `${API_URL}${api.offer.getOffers}`;

      if (filter) {
        const queryParams = new URLSearchParams();

        if (filter.currency) queryParams.append("currency", filter.currency);
        if (filter.forPayment)
          queryParams.append("forPayment", filter.forPayment);
        if (filter.distance)
          queryParams.append("distance", filter.distance.toString());
        if (filter.paymentMethods)
          queryParams.append("paymentMethods", filter.paymentMethods.join(","));
        if (filter.sum) queryParams.append("sum", filter.sum.toString());

        url += `?${queryParams.toString()}`;
      }
      const response = await axios.get<OfferData[]>(url, auth());
      dispatch(offerSlice.actions.offersSuccess(response.data));
    } catch (e: any) {
      dispatch(offerSlice.actions.offersError(e.response.data.message));
    }
  };

export const fetchMyOffers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(offerSlice.actions.myOffersFetching());

    const response = await axios.get<OfferData[]>(
      `${API_URL}${api.offer.getMyOffers}`,
      auth()
    );
    dispatch(offerSlice.actions.myOffersSuccess(response.data));
  } catch (e: any) {
    dispatch(offerSlice.actions.myOffersError(e.response.data.message));
  }
};

export const createOffer =
  (data: EmptyOfferData, callback: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.createOfferFetching());
      const response = await axios.post(
        `${API_URL}${api.offer.createOffer}`,
        data,
        auth()
      );
      dispatch(offerSlice.actions.createOfferSuccess(response.data));
      callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(offerSlice.actions.createOfferError(e.response.data.message));
    }
  };

export const editOffer =
  (data: EmptyOfferData, callback: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.createOfferFetching());
      const response = await axios.post(
        `${API_URL}${api.offer.editOffer}`,
        data,
        auth()
      );
      dispatch(offerSlice.actions.createOfferSuccess(response.data));
      callback();
    } catch (e: any) {
      errorCallback && errorCallback();
      dispatch(offerSlice.actions.createOfferError(e.response.data.message));
    }
  };

export const updateOffer =
  (data: EmptyOfferData, callback: () => void, errorCallback?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(offerSlice.actions.createOfferFetching());
      const response = await axios.post(
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
    const response = await axios.get<OfferData>(
      `${API_URL}${api.offer.getOffer}/${id}`,
      auth()
    );
    dispatch(offerSlice.actions.offerSuccess(response.data));
  } catch (e: any) {
    dispatch(offerSlice.actions.offerError(e.response.data.message));
  }
};

export const fetchMyOffer = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(offerSlice.actions.offerFetching());
    const response = await axios.get<OfferData>(
      `${API_URL}${api.offer.getOffer}/${id}`,
      auth()
    );
    dispatch(offerSlice.actions.myOfferSuccess(response.data));
  } catch (e: any) {
    dispatch(offerSlice.actions.offerError(e.response.data.message));
  }
};
