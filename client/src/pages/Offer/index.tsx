import { Avatar } from "components/Avatar";
import { DrawerComponent } from "components/Drawer";
import ListDividers from "components/List";
import { CurrencySelect } from "components/selectCurrency";
import { TransactionVolumeInput } from "components/TransactionVolumeInput";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { useTg } from "hooks/useTg";
import { Currency } from "models/Currency";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styled, { css, DefaultTheme } from "styled-components";
import SkeletonOffer from "./Skeleton";
import Price from "components/Price";
import { useApplication } from "hooks/useApplication";
import { useTranslation } from "react-i18next";
import { NoResults } from "components/NoResults";
import { MainButton } from "components/MainButton";
import { SecondButton } from "components/SecondButton";
import { sendPhoneNumberInstructions } from "store/reducers/auth/ActionCreators";
import { useOffer } from "hooks/useOffer";

interface Drawers {
  paymentMethods: JSX.Element;
}
type Drawer = "paymentMethods" | undefined;
const getDisplayedPrice = (
  price: number,
  currency?: string,
  forPayment?: string
) => {
  const roundedPrice = parseFloat(price?.toFixed(10));
  if (roundedPrice >= 0.1) {
    return { price: roundedPrice, currency, forPayment };
  } else {
    const inversePrice = parseFloat((1 / roundedPrice)?.toFixed(10));
    return { price: inversePrice, currency: forPayment, forPayment: currency };
  }
};

export const Offer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getOffer } = useOffer();
  const { getLabel, currenciesIsloading, forPaymentArr } = useCurrencies();
  const { application, isLoading, createApplication, editApplication } =
    useApplication();
  const { currentOfferData, offerIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const {
    currentUser,
    isLoading: isLoadingUser,
    sendPhoneNumberInstructionsIsLoading,
  } = useAppSelector((state) => state.authReducer);
  const {
    onToggleBackButton,
    setBackButtonCallBack,
    offBackButtonCallBack,
    onToggleMainButton,
    offMainButtonCallBack,
    tg,
  } = useTg();
  const [isReversePrice, setIsReversePrice] = useState<boolean>(true);
  const [currentDrawer, setCurrentDrawer] = useState<Drawer>(undefined);
  const isRevers = currentOfferData?.price && !(currentOfferData?.price > 100);

  const backButtonHandler = useCallback(() => {
    if (!!currentDrawer) {
      setCurrentDrawer(undefined);
      tg.BackButton.show();
    } else {
      navigate(RouteNames.OFFERS);
      onToggleMainButton(false, t("buy"));
      dispatch(
        editApplication({
          ...application,
          quantity: 0,
        })
      );
    }
  }, [currentDrawer, application, dispatch, navigate, onToggleMainButton, tg]);

  useEffect(() => {
    if (application.quantity) {
      onQuantityChange(
        isReversePrice
          ? application.quantity / getViewPrice()
          : application.quantity
      );
    }
  }, [isReversePrice]);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, [currentDrawer]);

  useEffect(() => {
    getOffer(id);
    return () => {
      dispatch(
        editApplication({
          ...application,
          quantity: 0,
        })
      );
    };
  }, [id]);

  useEffect(() => {
    if (currentOfferData?.currency) {
      dispatch(
        editApplication({
          ...application,
          currency: currentOfferData.currency,
          forPayment: currentOfferData.forPayment,
          price: getViewPrice(),
          offerId: currentOfferData._id,
          seller: currentOfferData.seller,
        })
      );
    }
  }, [currentOfferData]);

  const submitCreateOffer = useCallback(() => {
    const callback = () => {
      tg.MainButton.hideProgress();
      offMainButtonCallBack(submitCreateOffer);
      onToggleMainButton(false, t("buy"));
      navigate(RouteNames.MAIN);
    };
    const onError = () => {
      tg.MainButton.hideProgress();
      onToggleMainButton(false, t("buy"));
    };
    tg.MainButton.showProgress();
    if (!isLoading) dispatch(createApplication(application, callback, onError));
  }, [application, isLoading]);

  const isValidQuantity = () => {
    if (!currentOfferData || !application.quantity) return false;

    const viewPrice = getViewPrice();
    let minQuantity;
    let maxQuantity;

    if (isReversePrice) {
      minQuantity = currentOfferData.minQuantity;
      maxQuantity = currentOfferData.quantity;
    } else {
      minQuantity = currentOfferData.minQuantity * (1 / viewPrice);
      maxQuantity = currentOfferData.quantity * (1 / viewPrice);
    }

    const calculateQuantity = isReversePrice
      ? application.quantity
      : application.quantity / viewPrice;
    return calculateQuantity >= minQuantity && calculateQuantity <= maxQuantity;
  };
  useEffect(() => {
    if (!application) return;

    if (isValidQuantity()) {
      onToggleMainButton(true, t("buy"));
      tg.onEvent("mainButtonClicked", submitCreateOffer);
      return () => {
        tg.offEvent("mainButtonClicked", submitCreateOffer);
      };
    } else {
      onToggleMainButton(false, t("buy"));
    }
  }, [application]);

  const changeDrawer = (value: Drawer) => {
    setCurrentDrawer(value);
  };

  const onPaymentMethodChange = (value: string) => {
    dispatch(
      editApplication({
        ...application,
        paymentMethod: value,
      })
    );
    changeDrawer(undefined);
  };

  const paymentMethodsList = forPaymentArr.find(
    (item: Currency) => item.code === currentOfferData?.forPayment
  )?.paymentMethodsList;

  const drawers: Drawers = {
    paymentMethods: (
      <CurrencySelect
        handleSelect={onPaymentMethodChange}
        currentValue={application.paymentMethod}
        array={
          paymentMethodsList?.filter((item) =>
            currentOfferData?.paymentMethods?.length
              ? currentOfferData?.paymentMethods?.includes(item.code)
              : true
          ) || []
        }
      />
    ),
  };

  const getViewPrice = () => {
    if (!currentOfferData) return 0;

    return currentOfferData.price;
  };

  const getLimits = () => {
    if (!currentOfferData) return "";

    if (isReversePrice) {
      return (
        <>
          <Price value={currentOfferData.minQuantity} />
          {" - "} <Price value={currentOfferData.quantity} />{" "}
          <Primary>{` ${getLabel(currentOfferData.currency)}`}</Primary>
        </>
      );
    } else {
      const viewPrice = getViewPrice();
      const minQuantity = currentOfferData.minQuantity * (1 / viewPrice);
      const quantity = currentOfferData.quantity * (1 / viewPrice);
      return (
        <>
          <Price value={minQuantity} />
          {" - "} <Price value={quantity} />{" "}
          <Primary>{` ${getLabel(currentOfferData.forPayment)}`}</Primary>
        </>
      );
    }
  };

  const listArr = [
    {
      label: t("paymentMethod"),
      handleClick: () => changeDrawer("paymentMethods"),
      value:
        paymentMethodsList?.find(
          (item) => item.code === application.paymentMethod
        )?.label || "",
      isLoading: currenciesIsloading,
      isSelect: true,
    },
    {
      label: t("limits"),
      value: getLimits(),
      handleClick: () => {},
      isLoading: currenciesIsloading,
    },
    {
      label: t("offerDetails"),
      handleClick: () =>
        currentOfferData &&
        navigate(`${RouteNames.OFFERDETAILS}/${currentOfferData._id}`, {
          state: { from: `${RouteNames.OFFER}/${currentOfferData._id}` },
        }),
      value: <ArrowForwardIosIcon />,
    },
  ];

  const onQuantityChange = (value: number) => {
    const viewPrice = getViewPrice();
    const adjustedValue = isReversePrice
      ? value
      : parseFloat((value * viewPrice).toFixed(10));

    dispatch(
      editApplication({
        ...application,
        quantity: adjustedValue,
      })
    );
  };
  const sendInstructions = () => {
    dispatch(sendPhoneNumberInstructions(() => tg.close()));
  };

  const {
    price: displayedPrice,
    currency: displayedCurrency,
    forPayment: displayedForPayment,
  } = getDisplayedPrice(
    getViewPrice(),
    currentOfferData?.currency,
    currentOfferData?.forPayment
  );

  if (!currentUser?.username && !currentUser?.phoneNumber && !isLoadingUser) {
    return (
      <StyledContainer>
        <NoResults text={t("noResults4")} />
        <SendInstructionsContainer>
          <SecondButton
            disabled={sendPhoneNumberInstructionsIsLoading}
            text={t("back")}
            handleClick={backButtonHandler}
          />
          <MainButton
            isLoading={sendPhoneNumberInstructionsIsLoading}
            text={t("share")}
            handleClick={sendInstructions}
          />
        </SendInstructionsContainer>
      </StyledContainer>
    );
  }
  return offerIsLoading || currenciesIsloading ? (
    <SkeletonOffer />
  ) : currentOfferData ? (
    <StyledContainer>
      <Header>
        <Avatar avatar={currentOfferData?.sellerData?.avatar || ""} size={40} />
        <Title>
          {isReversePrice ? t("youBuyFrom") : t("youGive")}{" "}
          <b>{currentOfferData?.sellerData?.nickname}</b>
        </Title>
      </Header>
      <TransactionVolumeInput
        setIsReversePrice={setIsReversePrice}
        isReversePrice={!!isReversePrice}
        onChange={onQuantityChange}
        currentValue={application.quantity}
        firstCurrency={currentOfferData.currency}
        secondCurrency={currentOfferData.forPayment}
        isValid={application.quantity === 0 || isValidQuantity()}
      />
      {isRevers ? (
        <StyledPriceInfo>
          {t("priceFor1")} {getLabel(displayedCurrency)} ≈{" "}
          <Price value={1 / displayedPrice} /> {getLabel(displayedForPayment)}
        </StyledPriceInfo>
      ) : (
        <StyledPriceInfo>
          {t("priceFor1")} {getLabel(displayedForPayment)} ≈{" "}
          <Price value={displayedPrice} /> {getLabel(displayedCurrency)}
        </StyledPriceInfo>
      )}
      <ListDividers listArr={listArr} />
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => changeDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
    </StyledContainer>
  ) : (
    <></>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 20px;
  `}
`;
const StyledPriceInfo = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 20px;
  `}
`;
const Primary = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary} !important;
  `}
`;
const SendInstructionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  & button {
    flex: 1;
  }
`;

export default Offer;
