import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Currency } from "models/Currency";

interface item {
  isLoading: boolean;
  data: PriceResponse;
  error: string;
}
interface currencyState {
  isLoading: boolean;
  data: Currency[];
  error: string;
}
export interface LastCurrencyPair {
  first?: string;
  second?: string;
  timestamp?: number;
}
interface initialStateProps {
  price: item;
  lastCurrencyPair: LastCurrencyPair;
  currencies: currencyState;
  cripto: currencyState;
}
export interface PriceResponse {
  price: number;
}

const initialState: initialStateProps = {
  price: {
    isLoading: false,
    data: { price: 0 },
    error: "",
  },
  lastCurrencyPair: {
    first: undefined,
    second: undefined,
    timestamp: undefined,
  },

  currencies: {
    isLoading: false,
    data: [],
    error: "",
  },
  cripto: {
    isLoading: false,
    data: [],
    error: "",
  },
};

export const currencySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    priceFetching: (state) => {
      state.price.isLoading = true;
    },
    priceSuccess: (state, action: PayloadAction<{ data: PriceResponse }>) => {
      state.price.isLoading = false;
      state.price.data = action.payload.data;
      state.price.error = "";
    },
    priceError: (state, action: PayloadAction<string>) => {
      state.price.isLoading = false;
      state.price.error = action.payload;
    },

    currenciesFetching: (state) => {
      state.currencies.isLoading = true;
    },
    currenciesSuccess: (state, action: PayloadAction<{ data: any }>) => {
      state.currencies.isLoading = false;
      state.currencies.data = action.payload.data;
      state.currencies.error = "";
    },
    currenciesError: (state, action: PayloadAction<string>) => {
      state.currencies.isLoading = false;
      state.currencies.error = action.payload;
    },

    criptoFetching: (state) => {
      state.cripto.isLoading = true;
    },
    criptoSuccess: (state, action: PayloadAction<{ data: any }>) => {
      state.cripto.isLoading = false;
      state.cripto.data = action.payload.data;
      state.currencies.error = "";
    },
    criptoError: (state, action: PayloadAction<string>) => {
      state.cripto.isLoading = false;
      state.cripto.error = action.payload;
    },

    setLastCurrencyPair: (
      state,
      action: PayloadAction<{ data: LastCurrencyPair }>
    ) => {
      state.lastCurrencyPair = action.payload.data;
    },
  },
});

export default currencySlice.reducer;
