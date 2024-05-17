import ListDividers from "components/List";
import { useTg } from "hooks/useTg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import { CurrencySelect } from "components/selectCurrency";
import { DrawerComponent } from "components/Drawer";
import currensies from "utils/criptocurrency.json";
import {
  clearNewOffer,
  createOffer,
  setNewOffer,
} from "store/reducers/offer/ActionCreators";

import { useAppDispatch, useAppSelector } from "hooks/redux";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { SelectItem, getLabel } from "utils/Currency";
import { MarketPrice } from "./components/marketPrice";
import { FixPriceInput } from "./components/FixPriceInput";
import { FlexPriceInput } from "./components/FlexPriceInput";
import { YourFlexPrice } from "./components/YourFlexPrice";
import { Quantity } from "./components/Quantity";
import { Delivery } from "./components/Delivery";
import { DeliveryValues } from "models/IOffer";
import { Currency } from "models/Currency";
import { useCurrencies } from "hooks/useCurrencies";
import { CommentInput } from "./components/Comment";
import { useLocalStorage } from "hooks/useLocalStorage";

interface Drawers {
  fiatCurrency: JSX.Element;
  cryptoCurrency: JSX.Element;
  priceType: JSX.Element;
  paymentMethods: JSX.Element;
}
type Draver =
  | "fiatCurrency"
  | "cryptoCurrency"
  | "paymentMethods"
  | "priceType"
  | undefined;

export const CreateOffer = () => {
  const navigate = useNavigate();
  const {
    tg,
    onToggleBackButton,
    setBackButtonCallBack,
    offBackButtonCallBack,
    onToggleMainButton,
    setMainButtonCallBack,
    offMainButtonCallBack,
  } = useTg();
  const { setLocalValue, LocalStorageKey } = useLocalStorage();
  const dispatch = useAppDispatch();
  const { newOffer, createOfferIsLoading } = useAppSelector(
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

  const [isReversePrice, setIsReversePrice] = useState<boolean>();

  const [currentDrawer, setCurrentDrawer] = useState<Draver>();
  const backButtonHandler = useCallback(() => {
    if (currentDrawer) {
      changeDrawer(undefined);
    } else {
      navigate(RouteNames.MAIN);
    }
  }, [currentDrawer]);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      // onToggleBackButton(false);
      offBackButtonCallBack(backButtonHandler);
    };
  }, [currentDrawer]);

  // useEffect(() => {
  //   dispatch(setCurrencies(currensies));
  // }, []);

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
  const submitCreateOffer = useCallback(() => {
    const callback = () => {
      tg.MainButton.hideProgress();
      offMainButtonCallBack(submitCreateOffer);
      onToggleMainButton(false, "Создать");
      dispatch(clearNewOffer());
      backButtonHandler();
    };
    const onError = () => {
      tg.MainButton.hideProgress();
      onToggleMainButton(false, "Создать");
    };
    tg.MainButton.showProgress();
    !createOfferIsLoading && dispatch(createOffer(newOffer, callback, onError));
  }, [newOffer]);

  useEffect(() => {
    if (!newOffer) return;
    const isValidPriceCondition =
      (newOffer.typeOfPrice === "fix" &&
        isValidPrice(marketPrice, newOffer.price)) ||
      (newOffer.typeOfPrice === "flex" &&
        isValidInterestPrice(newOffer.interestPrice));

    if (
      isValidPriceCondition &&
      isValidMinQuantity() &&
      newOffer.minQuantity &&
      newOffer.quantity
    ) {
      onToggleMainButton(true, "Создать");
      tg.onEvent("mainButtonClicked", submitCreateOffer);
      return () => {
        tg.offEvent("mainButtonClicked", submitCreateOffer);
      };
    } else {
      onToggleMainButton(false, "Создать");
    }
  }, [newOffer]);
  const changeDrawer = (value: Draver) => {
    setCurrentDrawer(value);
  };
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
    dispatch(
      setNewOffer({
        ...newOffer,
        paymentMethods: getMethods(),
      })
    );

    // changeDrawer(undefined);
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
      const reversePrice = value ? 1 / value : undefined; // Рассчитываем обратную цену
      dispatch(setNewOffer({ ...newOffer, price: reversePrice })); // Сохраняем обратную цену
    } else {
      dispatch(setNewOffer({ ...newOffer, price: value })); // Иначе сохраняем стандартную цену
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

  const getListViewValue = (arr: SelectItem[], value?: string) => {
    return getLabel(arr, value) || <HorizontalRuleIcon />;
  };
  const getFixPriceValue = (value?: number) => {
    if (isReversePrice) {
      // Если цена обратная, то делаем обратное преобразование
      return value ? 1 / value : undefined; // Возвращаем обратное значение
    }
    return value;
  };
  const priceTypes: SelectItem[] = [
    {
      code: "fix",
      label: "Фиксированная",
    },
    {
      code: "flex",
      label: "Плавающая",
    },
  ];
  const offerParams = [
    {
      label: "Продать валюту",
      handleClick: () => changeDrawer("fiatCurrency"),
      value: getListViewValue(currencies.data, newOffer.currency),
      isLoading: currenciesIsloading,
    },
    {
      label: "Принимаю к оплате",
      handleClick: () => changeDrawer("cryptoCurrency"),
      value: getListViewValue(forPaymentArr, newOffer.forPayment),
      isLoading: currenciesIsloading,
    },
    {
      label: "Способ оплаты",
      handleClick: () => changeDrawer("paymentMethods"),
      value: newOffer.paymentMethods?.length
        ? `${getListViewValue(
            forPaymentArr.find(
              (item: Currency) => item.code === newOffer.forPayment
            )?.paymentMethodsList || [],
            newOffer.paymentMethods[0]
          )} ${
            Number(newOffer.paymentMethods?.length) > 1
              ? " +" + Number(newOffer.paymentMethods?.length - 1)
              : ""
          }`
        : "-",
      isLoading: currenciesIsloading,
    },
    {
      label: "Тип цены",
      handleClick: () => changeDrawer("priceType"),
      value: getListViewValue(priceTypes, newOffer.typeOfPrice),
      isLoading: currenciesIsloading,
    },
  ];
  const drawers: Drawers = {
    fiatCurrency: (
      <CurrencySelect
        handleSelect={onFiatChange}
        currentValue={newOffer.currency}
        array={currencies.data}
      />
    ),
    cryptoCurrency: (
      <CurrencySelect
        handleSelect={onCryptoChange}
        currentValue={newOffer.forPayment}
        array={forPaymentArr}
      />
    ),
    paymentMethods: (
      <CurrencySelect
        handleSelect={onPaymentMethodChange}
        currentValue={
          newOffer.paymentMethods?.length ? newOffer.paymentMethods : ""
        }
        array={
          forPaymentArr.find(
            (item: Currency) => item.code === newOffer.forPayment
          )?.paymentMethodsList || []
        }
      />
    ),
    priceType: (
      <CurrencySelect
        handleSelect={onPriceTypeChange}
        currentValue={newOffer.typeOfPrice}
        array={priceTypes}
      />
    ),
  };
  // console.log(555, price, marketPrice);
  return (
    <>
      <div>Создайте объявление</div>
      <ListDividers listArr={offerParams} />

      {newOffer.typeOfPrice === "fix" && (
        <FixPriceInput
          onChange={onPriceChange}
          value={getFixPriceValue(newOffer.price)}
          firstCurrency={getLabel(currencies.data, newOffer.currency)}
          secondCurrency={getLabel(forPaymentArr, newOffer.forPayment)}
          isReversePrice={!!isReversePrice}
          isValid={isValidPrice(marketPrice, newOffer.price)}
          setIsReversePrice={onChangeIsReversePrice}
          isLoading={currenciesIsloading}
        />
      )}
      {newOffer.typeOfPrice === "flex" && (
        <FlexPriceInput
          onChange={onInterestPriceChange}
          value={newOffer.interestPrice}
          isValid={isValidInterestPrice(
            newOffer.interestPrice && newOffer.interestPrice
          )}
          isLoading={currenciesIsloading}
        />
      )}
      {!!marketPrice && newOffer.currency && newOffer.forPayment && (
        <MarketPrice
          isLoading={price.isLoading || currenciesIsloading}
          price={marketPrice}
          first={getLabel(forPaymentArr, newOffer.forPayment)}
          second={getLabel(currencies.data, newOffer.currency)}
          isReversePrice={!!isReversePrice}
        />
      )}

      {newOffer.typeOfPrice === "flex" &&
        !!marketPrice &&
        newOffer.currency &&
        newOffer.forPayment && (
          <YourFlexPrice
            isLoading={price.isLoading}
            price={
              newOffer.interestPrice
                ? (marketPrice / newOffer.interestPrice) * 100
                : 0
            }
            first={getLabel(forPaymentArr, newOffer.forPayment)}
            second={getLabel(currencies.data, newOffer.currency)}
            isReversePrice={!isReversePrice}
          />
        )}
      <Quantity
        isValid={true}
        onChange={onQuantityChange}
        value={newOffer.quantity}
        currency={getLabel(currencies.data, newOffer.currency)}
        label="Количество на продажу"
        isLoading={currenciesIsloading}
      />
      <Quantity
        isValid={isValidMinQuantity()}
        onChange={onMinQuantityChange}
        value={newOffer.minQuantity}
        currency={getLabel(currencies.data, newOffer.currency)}
        label="Сумма минимальной сделки"
        isLoading={currenciesIsloading}
      />
      <CommentInput
        isValid={true}
        onChange={onCommentChange}
        value={newOffer.comment}
      />
      {!currenciesIsloading && (
        <>
          <Delivery
            deliveryValues={newOffer.delivery}
            onChange={onDeliveryChange}
            currency={getLabel(currencies.data, newOffer.currency)}
            isValid={true}
          />
        </>
      )}
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => changeDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
    </>
  );
};