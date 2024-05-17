import { AppDispatch } from "store";
import axios from "axios";
import { api } from "store/api";

import {
  currencySlice,
  LastCurrencyPair,
  PriceResponse,
} from "./CurrencySlice";

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

export const fetchPrice =
  (fiat: string, crypto: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(currencySlice.actions.priceFetching());
      const response = await axios.get<PriceResponse>(
        `${API_URL}${api.currency.getPrice}?crypto=${crypto}&fiat=${fiat}`,
        auth()
      );
      dispatch(currencySlice.actions.priceSuccess(response));
      return response;
    } catch (e: any) {
      dispatch(currencySlice.actions.priceError(e.response.data.message));
    }
  };
export const fetchFiatPrice =
  (crypto: string, first: string, second: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(currencySlice.actions.priceFetching());
      const result = await axios.get(
        `${API_URL}${api.currency.getPriceFiat}?crypto=${crypto}&first=${first}&second=${second}`,
        auth()
      );

      dispatch(currencySlice.actions.priceSuccess(result));
    } catch (e: any) {
      dispatch(currencySlice.actions.priceError(e.response.data.message));
    }
  };
export const fetchCurrencies = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(currencySlice.actions.currenciesFetching());
    const response = await axios.get(
      `${API_URL}${api.currency.getCurrencies}`,
      auth()
    );
    dispatch(currencySlice.actions.currenciesSuccess(response));
  } catch (e: any) {
    dispatch(currencySlice.actions.currenciesError(e.response.data.message));
  }
};
export const fetchCriptos = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(currencySlice.actions.criptoFetching());
    const response = await axios.get(
      `${API_URL}${api.currency.getCripto}`,
      auth()
    );
    dispatch(currencySlice.actions.criptoSuccess(response));
  } catch (e: any) {
    dispatch(currencySlice.actions.criptoError(e.response.data.message));
  }
};

export const setLastCurrencyPair =
  (data: LastCurrencyPair) => async (dispatch: AppDispatch) => {
    dispatch(currencySlice.actions.setLastCurrencyPair({ data }));
  };

export const setCurrencies =
  (currencies: any) => async (dispatch: AppDispatch) => {
    try {
      // dispatch(currencySlice.actions.currenciesFetching());
      const response = await axios.post(
        `${API_URL}${api.currency.setCurrencies}`,
        { data: currencies },
        auth()
      );
      // dispatch(currencySlice.actions.currenciesSuccess(response));
    } catch (e: any) {
      dispatch(currencySlice.actions.currenciesError(e.response.data.message));
    }
  };
