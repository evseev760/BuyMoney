import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmptyOfferData, OfferData } from "../../../models/IOffer";

import { CryptoCurrency, FiatCurrency } from "utils/Currency";
import { LocalStorageKey } from "hooks/useLocalStorage";

interface IOfferState {
  offers: OfferData[];
  offersIsLoading: boolean;
  offerIsLoading: boolean;
  createOfferIsLoading: boolean;
  error: string;
  currentOffer: string;
  currentOfferData?: OfferData;
  message: string;

  newOffer: EmptyOfferData;
}
const emptyOfferData: EmptyOfferData = {
  currency:
    localStorage.getItem(LocalStorageKey.newOfferCurrency) || FiatCurrency.USD,
  forPayment:
    localStorage.getItem(LocalStorageKey.newOfferForPayment) ||
    CryptoCurrency.USDT,
  typeOfPrice: "fix",
  price: undefined,
  interestPrice: undefined,
  quantity: undefined,
  minQuantity: undefined,
  comment: undefined,
  delivery: {
    isDelivered: false,
    price: undefined,
    distance: undefined,
  },
};

const initialState: IOfferState = {
  offers: [],
  offersIsLoading: false,
  offerIsLoading: false,
  createOfferIsLoading: false,
  currentOffer: window.location.pathname.split("/")[1] || "",
  error: "",
  message: "",
  currentOfferData: undefined,

  newOffer: emptyOfferData,
};

export const offerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    offersFetching: (state) => {
      state.offersIsLoading = true;
    },
    offersSuccess: (state, action: PayloadAction<OfferData[]>) => {
      state.offersIsLoading = false;
      state.offers = action.payload;
      state.error = "";
    },
    offersError: (state, action: PayloadAction<string>) => {
      state.offersIsLoading = false;
      state.error = action.payload;
    },

    createOfferFetching: (state) => {
      state.createOfferIsLoading = true;
    },
    createOfferSuccess: (
      state,
      action: PayloadAction<{ offerId: string; message: string }>
    ) => {
      state.createOfferIsLoading = false;
      state.currentOffer = action.payload.offerId;
      state.message = action.payload.message;
      state.error = "";
    },
    createOfferError: (state, action: PayloadAction<string>) => {
      state.createOfferIsLoading = false;
      state.error = action.payload;
    },

    offerFetching: (state) => {
      state.offerIsLoading = true;
    },
    offerSuccess: (state, action: PayloadAction<OfferData>) => {
      state.offerIsLoading = false;
      state.currentOfferData = action.payload;
      state.currentOffer = action.payload.id || "";
      state.error = "";
    },
    offerError: (state, action: PayloadAction<string>) => {
      state.offerIsLoading = false;
      state.error = action.payload;
    },

    updateNewOffer: (state, action: PayloadAction<EmptyOfferData>) => {
      state.newOffer = action.payload;
    },
    clearNewOffer: (state) => {
      state.newOffer = {
        ...emptyOfferData,
        currency:
          localStorage.getItem(LocalStorageKey.newOfferCurrency) ||
          FiatCurrency.USD,
        forPayment:
          localStorage.getItem(LocalStorageKey.newOfferForPayment) ||
          CryptoCurrency.USDT,
      };
    },

    addMessageFetching: (state) => {},
    addMessageSuccess: (state, action: PayloadAction<any>) => {},
    addMessageError: (state, action: PayloadAction<string>) => {},

    leaveTheOffer: (state) => {
      state.currentOfferData = undefined;
    },
  },
});

export default offerSlice.reducer;
