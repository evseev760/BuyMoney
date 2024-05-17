import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKey } from "hooks/useLocalStorage";
import { Currency } from "models/Currency";
import { FiatCurrency, CryptoCurrency } from "utils/Currency";

export interface Filter {
  currency: string;
  forPayment: string;
  paymentMethods?: string[];
  sum?: number;
  distance: number;
}

const initialState: Filter = {
  currency:
    localStorage.getItem(LocalStorageKey.filterCurrency) || FiatCurrency.USD,
  forPayment:
    localStorage.getItem(LocalStorageKey.filterForPayment) ||
    CryptoCurrency.USDT,
  paymentMethods: undefined,
  sum: undefined,
  distance: 10000,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    editCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    editForPayment: (state, action: PayloadAction<string>) => {
      state.forPayment = action.payload;
    },
    editPaymentMethods: (
      state,
      action: PayloadAction<string[] | undefined>
    ) => {
      state.paymentMethods = action.payload;
    },
    editSum: (state, action: PayloadAction<number | undefined>) => {
      state.sum = action.payload;
    },
    editDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload || 0;
    },
  },
});

export default filterSlice.reducer;
