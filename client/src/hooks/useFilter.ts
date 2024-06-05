import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useDebounce } from "hooks/useDebounce";

export const useFilter = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const { currency, forPayment, paymentMethods, sum, distance } =
    useAppSelector((state) => state.filterReducer);
  const { offersTimestamp } = useAppSelector((state) => state.offerReducer);
  const debounceDelay = 1000;
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
    shouldUpdate,
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

  const setCurrency = useCallback(
    (value: string) => {
      dispatch(editCurrency(value));
      setLocalValue(LocalStorageKey.filterCurrency, value);
      setShouldUpdate(true);
    },
    [dispatch, setLocalValue, LocalStorageKey.filterCurrency]
  );

  const setForPayment = useCallback(
    (value: string) => {
      dispatch(editForPayment(value));
      setLocalValue(LocalStorageKey.filterForPayment, value);
      setShouldUpdate(true);
    },
    [dispatch, setLocalValue, LocalStorageKey.filterForPayment]
  );

  const debouncedSetShouldUpdate = useDebounce(() => {
    setShouldUpdate(true);
  }, debounceDelay);

  const setPaymentMethods = useCallback(
    (value: string[]) => {
      dispatch(editPaymentMethods(value.length ? value : undefined));
      debouncedSetShouldUpdate();
    },
    [dispatch, debouncedSetShouldUpdate]
  );

  const setSum = useCallback(
    (value?: number) => {
      dispatch(editSum(value));
      debouncedSetShouldUpdate();
    },
    [dispatch, debouncedSetShouldUpdate]
  );

  const setDistance = useCallback(
    (value?: number) => {
      dispatch(editDistance(value ? value * 1000 : 1000));
      debouncedSetShouldUpdate();
    },
    [dispatch, debouncedSetShouldUpdate]
  );

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
