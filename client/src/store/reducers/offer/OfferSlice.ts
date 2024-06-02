import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmptyOfferData, OfferData } from "../../../models/IOffer";

import { CryptoCurrency, FiatCurrency } from "utils/Currency";
import { LocalStorageKey } from "hooks/useLocalStorage";

interface IOfferState {
  offers: OfferData[];
  offersTimestamp?: number;
  offersIsLoading: boolean;
  offerIsLoading: boolean;
  createOfferIsLoading: boolean;
  error: string;
  currentOffer: string;
  currentOfferData?: OfferData;
  message: string;
  newOffer: EmptyOfferData;
  myOffers: OfferData[];
  lastOfferReqest: LastOfferReqest;
}
export interface LastOfferReqest {
  id?: string;
  timestamp?: number;
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
  myOffers: [],
  newOffer: emptyOfferData,
  lastOfferReqest: {},
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
      state.offersTimestamp = new Date().getTime();
      state.error = "";
    },
    offersError: (state, action: PayloadAction<string>) => {
      state.offersIsLoading = false;
      state.error = action.payload;
    },

    myOffersFetching: (state) => {
      state.offersIsLoading = true;
    },
    myOffersSuccess: (state, action: PayloadAction<OfferData[]>) => {
      state.offersIsLoading = false;
      state.myOffers = action.payload;
      state.error = "";
    },
    myOffersError: (state, action: PayloadAction<string>) => {
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
    myOfferSuccess: (state, action: PayloadAction<OfferData>) => {
      const offer = action.payload;
      let typeOfPrice = "fix";
      let interestPrice;
      let price = offer.price;
      if (offer.interestPrice) {
        typeOfPrice = "flex";
      }
      if (offer.interestPrice) {
        interestPrice = 1 / offer.interestPrice;
      }
      if (offer.price) {
        price = 1 / offer.price;
      }
      state.offerIsLoading = false;
      state.newOffer = { ...offer, typeOfPrice, interestPrice, price };
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
    setLastOfferReqest: (
      state,
      action: PayloadAction<{ data: LastOfferReqest }>
    ) => {
      state.lastOfferReqest = action.payload.data;
    },
  },
});

export default offerSlice.reducer;
