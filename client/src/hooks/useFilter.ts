import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  editCurrency,
  editDistance,
  editForPayment,
  editPaymentMethods,
  editSum,
} from "store/reducers/filter/ActionCreators";
import { fetchOffers } from "store/reducers/offer/ActionCreators";
import { useLocalStorage } from "hooks/useLocalStorage";

export const useFilter = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const { currency, forPayment, paymentMethods, sum, distance } =
    useAppSelector((state) => state.filterReducer);
  const { setLocalValue, LocalStorageKey } = useLocalStorage();
  const handleFetchOffers = useMemo(() => {
    return () => {
      currentUser.location?.coordinates[0] &&
        dispatch(
          fetchOffers({ currency, forPayment, paymentMethods, sum, distance })
        );
    };
  }, [
    currency,
    forPayment,
    paymentMethods,
    sum,
    distance,
    currentUser.location,
  ]);

  useEffect(() => {
    handleFetchOffers();
  }, [handleFetchOffers]);

  const setCurrency = (value: string) => {
    dispatch(editCurrency(value));
    setLocalValue(LocalStorageKey.filterCurrency, value);
  };
  const setForPayment = (value: string) => {
    dispatch(editForPayment(value));
    setLocalValue(LocalStorageKey.filterForPayment, value);
  };
  const setPaymentMethods = (value: string[]) => {
    dispatch(editPaymentMethods(value.length ? value : undefined));
  };
  const setSum = (value?: number) => {
    dispatch(editSum(value));
  };
  const setDistance = (value?: number) => {
    dispatch(editDistance(value ? value * 1000 : 1000));
  };

  return {
    currency,
    forPayment,
    paymentMethods,
    sum,
    distance,
    setCurrency,
    setForPayment,
    setPaymentMethods,
    setSum,
    setDistance,
    handleFetchOffers,
  };
};
