import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmptyOfferData, IOffer } from "../../models/IOffer";

import { IMessage } from "../../models/IMessage";

interface IOfferState {
  offers: IOffer[];
  offersIsLoading: boolean;
  offerIsLoading: boolean;
  createOfferIsLoading: boolean;
  error: string;
  currentOffer: string;
  currentOfferData: EmptyOfferData;
  message: string;
  price: {
    isLoading: boolean;
    data: any;
    error: string;
  };
  newOffer: EmptyOfferData;
}
const emptyOfferData: EmptyOfferData = {
  currency: "usd",
  forPayment: "tether",
  isFixPrice: "fix",
  price: undefined,
  interestPrice: undefined,
  quantity: undefined,
  minQuantity: undefined,
  delivery: {
    isDelivered: undefined,
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
  currentOfferData: emptyOfferData,
  price: {
    isLoading: false,
    data: {},
    error: "",
  },
  newOffer: emptyOfferData,
};

export const offerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    offersFetching: (state) => {
      state.offersIsLoading = true;
    },
    offersSuccess: (state, action: PayloadAction<IOffer[]>) => {
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

    priceFetching: (state) => {
      state.price.isLoading = true;
    },
    priceSuccess: (state, action: PayloadAction<{ data: any }>) => {
      state.price.isLoading = false;
      state.price.data = action.payload.data;
      state.price.error = "";
    },
    priceError: (state, action: PayloadAction<string>) => {
      state.createOfferIsLoading = false;
      state.price.error = action.payload;
    },

    offerFetching: (state) => {
      state.offerIsLoading = true;
    },
    offerSuccess: (state, action: PayloadAction<IOffer>) => {
      state.offerIsLoading = false;
      state.currentOfferData = action.payload;
      state.currentOffer = action.payload._id || "";
      state.error = "";
    },
    offerError: (state, action: PayloadAction<string>) => {
      state.offerIsLoading = false;
      state.error = action.payload;
    },

    // messagesFetching: (state) => {},
    // messagesSuccess: (state, action: PayloadAction<IMessage[]>) => {
    //   state.currentOfferData.proposals = action.payload;
    // },
    // messagesError: (state, action: PayloadAction<string>) => {},

    updateNewOffer: (state, action: PayloadAction<EmptyOfferData>) => {
      state.newOffer = action.payload;
    },
    clearNewOffer: (state) => {
      state.newOffer = emptyOfferData;
    },

    addMessageFetching: (state) => {},
    addMessageSuccess: (state, action: PayloadAction<any>) => {},
    addMessageError: (state, action: PayloadAction<string>) => {},

    leaveTheOffer: (state) => {
      state.currentOfferData = emptyOfferData;
    },
  },
});

export default offerSlice.reducer;
