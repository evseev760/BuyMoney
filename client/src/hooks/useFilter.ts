import { useEffect, useMemo, useState } from "react";
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
  const { offersTimestamp } = useAppSelector((state) => state.offerReducer);

  const [shouldUpdate, setShouldUpdate] = useState(!offersTimestamp);
  const { setLocalValue, LocalStorageKey } = useLocalStorage();
  const handleFetchOffers = useMemo(() => {
    return () => {
      if (currentUser.location?.coordinates[0]) {
        dispatch(
          fetchOffers(
            { currency, forPayment, paymentMethods, sum, distance },
            () => setShouldUpdate(false)
          )
        );
      }
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
    const timestamp = new Date().getTime();
    const needPast = 60 * 1000;
    if (
      !shouldUpdate &&
      offersTimestamp &&
      timestamp - Number(offersTimestamp) < needPast
    )
      return;
    handleFetchOffers();
  }, [handleFetchOffers]);

  const setCurrency = (value: string) => {
    dispatch(editCurrency(value));
    setLocalValue(LocalStorageKey.filterCurrency, value);
    setShouldUpdate(true);
  };
  const setForPayment = (value: string) => {
    dispatch(editForPayment(value));
    setLocalValue(LocalStorageKey.filterForPayment, value);
    setShouldUpdate(true);
  };
  const setPaymentMethods = (value: string[]) => {
    dispatch(editPaymentMethods(value.length ? value : undefined));
    setShouldUpdate(true);
  };
  const setSum = (value?: number) => {
    dispatch(editSum(value));
    setShouldUpdate(true);
  };
  const setDistance = (value?: number) => {
    dispatch(editDistance(value ? value * 1000 : 1000));
    setShouldUpdate(true);
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
