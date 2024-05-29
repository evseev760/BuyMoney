import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setNewOffer,
  clearNewOffer,
  createOffer,
  updateOffer,
  fetchOffer,
} from "store/reducers/offer/ActionCreators";
import { useTg } from "hooks/useTg";
import { useCurrencies } from "hooks/useCurrencies";
import { useLocalStorage } from "hooks/useLocalStorage";
import { getLabel, SelectItem } from "utils/Currency";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { useAppDispatch, useAppSelector } from "./redux";
import { DeliveryValues } from "models/IOffer";

type Draver =
  | "fiatCurrency"
  | "cryptoCurrency"
  | "paymentMethods"
  | "priceType"
  | undefined;

export const useOfferForm = (isEdit = false, offerId = null) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    tg,
    onToggleMainButton,
    setMainButtonCallBack,
    offMainButtonCallBack,
  } = useTg();
  const { setLocalValue, LocalStorageKey } = useLocalStorage();
  const { newOffer, createOfferIsLoading, currentOfferData } = useAppSelector(
    (state) => state.offerReducer
  );
  const {
    price,
    currencies,
    cripto,
    forPaymentArr,
    currenciesIsloading,
    getPrice,
    isValidInterestPrice,
    isValidPrice,
  } = useCurrencies();

  const [isReversePrice, setIsReversePrice] = useState(false);
  const [currentDrawer, setCurrentDrawer] = useState<Draver>(undefined);

  useEffect(() => {
    if (isEdit && offerId) {
      dispatch(fetchOffer(offerId));
    }
  }, [isEdit, offerId]);

  useEffect(() => {
    if (currentOfferData) {
      dispatch(setNewOffer(currentOfferData));
    }
  }, [currentOfferData]);

  useEffect(() => {
    if (
      newOffer.currency &&
      newOffer.forPayment &&
      cripto.data.length &&
      currencies.data.length
    ) {
      getPrice(newOffer.currency, newOffer.forPayment);
    }
  }, [newOffer.currency, newOffer.forPayment, currencies, cripto]);

  const changeDrawer = (value: Draver) => setCurrentDrawer(value);

  const marketPrice = price?.data?.price;

  const isValidMinQuantity = () => {
    return newOffer.minQuantity && newOffer.quantity
      ? newOffer.minQuantity <= newOffer.quantity
      : true;
  };

  const onFiatChange = (value: string) => {
    dispatch(
      setNewOffer({
        ...newOffer,
        currency: value,
        interestPrice: undefined,
        price: undefined,
      })
    );
    setLocalValue(LocalStorageKey.newOfferCurrency, value);
    changeDrawer(undefined);
  };

  const onCryptoChange = (value: string) => {
    dispatch(
      setNewOffer({
        ...newOffer,
        forPayment: value,
        interestPrice: undefined,
        price: undefined,
        paymentMethods: undefined,
      })
    );
    setLocalValue(LocalStorageKey.newOfferForPayment, value);
    changeDrawer(undefined);
  };

  const onPaymentMethodChange = (value: string) => {
    const getMethods = () => {
      if (newOffer?.paymentMethods) {
        return newOffer.paymentMethods.includes(value)
          ? newOffer.paymentMethods.filter((item) => item !== value)
          : [...newOffer.paymentMethods, value];
      } else {
        return [value];
      }
    };
    dispatch(setNewOffer({ ...newOffer, paymentMethods: getMethods() }));
  };

  const onPriceTypeChange = (value: string) => {
    if (value === "fix") {
      dispatch(
        setNewOffer({
          ...newOffer,
          typeOfPrice: value,
          interestPrice: undefined,
        })
      );
    } else if (value === "flex") {
      setIsReversePrice(false);
      dispatch(
        setNewOffer({ ...newOffer, typeOfPrice: value, price: undefined })
      );
    }
    changeDrawer(undefined);
  };

  const onPriceChange = (value: number) => {
    if (isReversePrice) {
      const reversePrice = value ? 1 / value : undefined;
      dispatch(setNewOffer({ ...newOffer, price: reversePrice }));
    } else {
      dispatch(setNewOffer({ ...newOffer, price: value }));
    }
  };

  const onInterestPriceChange = (value: number) => {
    dispatch(setNewOffer({ ...newOffer, interestPrice: value }));
  };

  const onChangeIsReversePrice = () => {
    dispatch(setNewOffer({ ...newOffer, price: undefined }));
    setIsReversePrice((prev) => !prev);
  };

  const onQuantityChange = (value?: number) => {
    dispatch(setNewOffer({ ...newOffer, quantity: value }));
  };

  const onMinQuantityChange = (value?: number) => {
    dispatch(setNewOffer({ ...newOffer, minQuantity: value }));
  };

  const onCommentChange = (value?: string) => {
    dispatch(setNewOffer({ ...newOffer, comment: value }));
  };

  const onDeliveryChange = (value: DeliveryValues) => {
    dispatch(setNewOffer({ ...newOffer, delivery: value }));
  };

  const submitForm = useCallback(
    (callback: () => void, onError: () => void) => {
      tg.MainButton.showProgress();
      !createOfferIsLoading &&
        dispatch(
          (isEdit ? updateOffer : createOffer)(newOffer, callback, onError)
        );
    },
    [newOffer, createOfferIsLoading, isEdit]
  );

  const formValid = useCallback(() => {
    const isValidPriceCondition =
      (newOffer.typeOfPrice === "fix" &&
        isValidPrice(marketPrice, newOffer.price)) ||
      (newOffer.typeOfPrice === "flex" &&
        isValidInterestPrice(newOffer.interestPrice));

    return (
      isValidPriceCondition &&
      isValidMinQuantity() &&
      newOffer.minQuantity &&
      newOffer.quantity
    );
  }, [newOffer, marketPrice]);

  const getListViewValue = (arr: SelectItem[], value?: string) =>
    getLabel(arr, value) || "-";

  const getCurrencyLabel = (value: string) =>
    getLabel(currencies.data, value) || "";

  const getCryptoLabel = (value: string) => getLabel(cripto.data, value) || "";

  return {
    newOffer,
    currentDrawer,
    changeDrawer,
    onFiatChange,
    onCryptoChange,
    onPaymentMethodChange,
    onPriceTypeChange,
    onPriceChange,
    onInterestPriceChange,
    onChangeIsReversePrice,
    onQuantityChange,
    onMinQuantityChange,
    onCommentChange,
    onDeliveryChange,
    submitForm,
    formValid,
    marketPrice,
    getCurrencyLabel,
    getCryptoLabel,
    getListViewValue,
    currencies,
    cripto,
    forPaymentArr,
    currenciesIsloading,
    isReversePrice,
  };
};
