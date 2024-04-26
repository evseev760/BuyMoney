import ListDividers from "components/List";
import { useTg } from "hooks/useTg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import { CurrencySelect } from "./components/selectCurrency";
import { DrawerComponent } from "components/Drawer";
import {
  clearNewOffer,
  createOffer,
  fetchPrice,
  setNewOffer,
} from "store/reducers/ActionCreators";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import {
  fiatCurrenciesArray,
  criptoCurrenciesArray,
  SelectItem,
  getLabel,
} from "models/Currency";
import { MarketPrice } from "./components/marketPrice";
import { FixPriceInput } from "./components/FixPriceInput";
import { FlexPriceInput } from "./components/FlexPriceInput";
import { YourFlexPrice } from "./components/YourFlexPrice";
import { Quantity } from "./components/Quantity";
import { Delivery } from "./components/Delivery";
import { DeliveryValues } from "models/IOffer";

interface Drawers {
  fiatCurrency: JSX.Element;
  cryptoCurrency: JSX.Element;
  priceType: JSX.Element;
}
type Draver = "fiatCurrency" | "cryptoCurrency" | "priceType" | undefined;

export const CreateOffer = () => {
  const navigate = useNavigate();
  const {
    tg,
    onToggleBackButton,
    onToggleMainButton,
    setMainButtonCallBack,
    offMainButtonCallBack,
  } = useTg();
  const dispatch = useAppDispatch();
  const { newOffer, price, createOfferIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const [isReversePrice, setIsReversePrice] = useState<boolean>();

  const [currentDrawer, setCurrentDrawer] = useState<Draver>();
  const backButtonHandler = () => navigate(RouteNames.MAIN);

  useEffect(() => {
    onToggleBackButton(backButtonHandler, true);
    return () => {
      onToggleBackButton(backButtonHandler, false);
    };
  }, []);
  useEffect(() => {
    if (newOffer.currency && newOffer.forPayment) {
      dispatch(fetchPrice(newOffer.forPayment, newOffer.currency));
    }
  }, [newOffer.currency, newOffer.forPayment]);
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
    if (
      ((newOffer.typeOfPrice === "fix" &&
        isValidPrice(marketPrice, newOffer.price) &&
        newOffer.price) ||
        (newOffer.typeOfPrice === "flex" &&
          isValidInterestPrice(
            newOffer.interestPrice && newOffer.interestPrice
          ) &&
          newOffer.interestPrice)) &&
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
  const marketPrice = useMemo<number>(() => {
    if (
      price &&
      newOffer.forPayment &&
      newOffer.currency &&
      price.data &&
      price.data[newOffer.forPayment]
    ) {
      return price.data[newOffer.forPayment][newOffer.currency];
    }
    return undefined;
  }, [price]);
  const isValidPrice = (mainValue: number, value?: number) => {
    const upperLimit = mainValue * 1.5;
    const bottomLimit = mainValue * 0.7;
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
    return false;
  };
  const isValidMinQuantity = () => {
    // if()
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
    changeDrawer(undefined);
  };
  const onCryptoChange = (value: string) => {
    dispatch(
      setNewOffer({
        ...newOffer,
        forPayment: value,
        interestPrice: undefined,
        price: undefined,
      })
    );
    changeDrawer(undefined);
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
    // if (Number.isNaN(+value)) return;
    // dispatch(setNewOffer({ ...newOffer, price: value }));
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
      value: getListViewValue(fiatCurrenciesArray, newOffer.currency),
    },
    {
      label: "Принимаю к оплате",
      handleClick: () => changeDrawer("cryptoCurrency"),
      value: getListViewValue(criptoCurrenciesArray, newOffer.forPayment),
    },
    {
      label: "Тип цены",
      handleClick: () => changeDrawer("priceType"),
      value: getListViewValue(priceTypes, newOffer.typeOfPrice),
    },
  ];
  const drawers: Drawers = {
    fiatCurrency: (
      <CurrencySelect
        handleSelect={onFiatChange}
        currentValue={newOffer.currency}
        array={fiatCurrenciesArray}
      />
    ),
    cryptoCurrency: (
      <CurrencySelect
        handleSelect={onCryptoChange}
        currentValue={newOffer.forPayment}
        array={criptoCurrenciesArray}
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
  console.log(555, newOffer);
  return (
    <>
      <div>Создайте объявление</div>
      <ListDividers listArr={offerParams} />

      {newOffer.typeOfPrice === "fix" && (
        <FixPriceInput
          onChange={onPriceChange}
          value={getFixPriceValue(newOffer.price)}
          firstCurrency={getLabel(fiatCurrenciesArray, newOffer.currency)}
          secondCurrency={getLabel(criptoCurrenciesArray, newOffer.forPayment)}
          isReversePrice={!!isReversePrice}
          isValid={isValidPrice(marketPrice, newOffer.price)}
          setIsReversePrice={onChangeIsReversePrice}
        />
      )}
      {newOffer.typeOfPrice === "flex" && (
        <FlexPriceInput
          onChange={onInterestPriceChange}
          value={newOffer.interestPrice}
          isValid={isValidInterestPrice(
            newOffer.interestPrice && newOffer.interestPrice
          )}
        />
      )}
      {price.data && newOffer.currency && newOffer.forPayment && (
        <MarketPrice
          isLoading={price.isLoading}
          price={marketPrice}
          first={getLabel(criptoCurrenciesArray, newOffer.forPayment)}
          second={getLabel(fiatCurrenciesArray, newOffer.currency)}
          isReversePrice={!!isReversePrice}
        />
      )}

      {newOffer.typeOfPrice === "flex" &&
        price.data &&
        newOffer.currency &&
        newOffer.forPayment && (
          <YourFlexPrice
            isLoading={price.isLoading}
            price={
              newOffer.interestPrice
                ? (marketPrice / newOffer.interestPrice) * 100
                : 0
            }
            first={getLabel(criptoCurrenciesArray, newOffer.forPayment)}
            second={getLabel(fiatCurrenciesArray, newOffer.currency)}
            isReversePrice={!isReversePrice}
          />
        )}
      <Quantity
        isValid={true}
        onChange={onQuantityChange}
        value={newOffer.quantity}
        currency={getLabel(fiatCurrenciesArray, newOffer.currency)}
        label="Количество на продажу"
      />
      <Quantity
        isValid={isValidMinQuantity()}
        onChange={onMinQuantityChange}
        value={newOffer.minQuantity}
        currency={getLabel(fiatCurrenciesArray, newOffer.currency)}
        label="Сумма минимальной сделки"
      />
      <Delivery
        deliveryValues={newOffer.delivery}
        onChange={onDeliveryChange}
        currency={getLabel(fiatCurrenciesArray, newOffer.currency)}
        isValid={true}
      />
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => changeDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
    </>
  );
};
