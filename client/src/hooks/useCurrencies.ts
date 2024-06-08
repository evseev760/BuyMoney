import { useCallback, useEffect } from "react";
import { batch } from "react-redux";
import {
  fetchCriptos,
  fetchCurrencies,
  fetchPrice,
  fetchFiatPrice,
  setLastCurrencyPair,
} from "store/reducers/currency/ActionCreators";

import { CryptoCurrency } from "utils/Currency";
import { useAppDispatch, useAppSelector } from "./redux";
import ComponentStyle from "styled-components/dist/models/ComponentStyle";

export const useCurrencies = () => {
  const dispatch = useAppDispatch();
  const { price, currencies, cripto, lastCurrencyPair } = useAppSelector(
    (state) => state.currencyReducer
  );
  useEffect(() => {
    batch(() => {
      !cripto.data.length && dispatch(fetchCriptos());
      !currencies.data.length && dispatch(fetchCurrencies());
    });
  }, []);
  const currenciesIsloading = currencies.isLoading || cripto.isLoading;

  const forPaymentArr = [...cripto.data, ...currencies.data];

  const getPrice = (first?: string, second?: string) => {
    if (!first || !second) return;
    const timestamp = new Date().getTime();
    const needPast = 5 * 60 * 1000;
    if (
      first === lastCurrencyPair.first &&
      second === lastCurrencyPair.second &&
      timestamp - Number(lastCurrencyPair.timestamp) < needPast
    )
      return;

    try {
      if (cripto.data.map((item) => item.code).includes(second)) {
        dispatch(fetchPrice(first, second));
      } else {
        dispatch(fetchFiatPrice(CryptoCurrency.USDT, first, second));
      }
      dispatch(setLastCurrencyPair({ first, second, timestamp }));
    } catch (error) {
      return;
    }
  };
  const isValidPrice = (
    mainValue: number,
    value?: number,
    isReversePrice?: boolean
  ) => {
    const upperLimit = isReversePrice ? (1 / mainValue) * 1.5 : mainValue * 1.5;
    const bottomLimit = isReversePrice
      ? (1 / mainValue) * 0.7
      : mainValue * 0.7;
    if (!value) return true;
    if (value && value >= 1 / upperLimit && value <= 1 / bottomLimit) {
      return true;
    }
    return false;
  };
  const isValidInterestPrice = (value?: number) => {
    if (value && value >= 70 && value <= 150) {
      return true;
    }
    if (!value) return true;
    return false;
  };
  const getLabel = (value?: string) => {
    return forPaymentArr.find((item) => item.code === value)?.label;
  };

  return {
    forPaymentArr,
    currencies,
    cripto,
    currenciesIsloading,
    price,
    getPrice,
    isValidPrice,
    isValidInterestPrice,
    getLabel,
  };
};
