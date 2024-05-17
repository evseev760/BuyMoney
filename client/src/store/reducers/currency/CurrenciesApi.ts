import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "config";
import { Currency } from "models/Currency";
import { api } from "store/api";

export const сurrencyApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getCurrencies: builder.query<Currency[], void>({
      query: () => api.currency.getCurrencies,
    }),
    getCriptos: builder.query<Currency[], void>({
      query: () => api.currency.getCripto,
    }),
    getFiatPrice: builder.mutation<
      number,
      { crypto: string; first: string; second: string }
    >({
      query: ({ crypto, first, second }) =>
        `${api.currency.getPriceFiat}?crypto=${crypto}&first=${first}&second=${second}`,
    }),
    getPrice: builder.mutation<number, { fiat: string; crypto: string }>({
      query: ({ fiat, crypto }) =>
        `${api.currency.getPrice}?crypto=${crypto}&fiat=${fiat}`,
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCriptosQuery,
  useGetFiatPriceMutation,
  useGetPriceMutation,
} = сurrencyApi;
