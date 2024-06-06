import { Paper } from "@material-ui/core";
import ListDividers from "components/List";
import Price from "components/Price";
import { UserInfo } from "components/UserInfo";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { useTg } from "hooks/useTg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import styled, { css, DefaultTheme } from "styled-components";
import { getLabel } from "utils/Currency";
import { useTranslation } from "react-i18next";
import { useOffer } from "hooks/useOffer";
import { TabsComponent } from "components/TabsComponent";
import { ReviewSkeleton } from "components/OfferView/Skeleton";
import { Reviews } from "components/Reviews";
import { NoResults } from "components/NoResults";
import { getCommentsByUserId } from "store/reducers/application/ActionCreators";

export const OfferDetails = () => {
  const { currentOfferData, offerIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const location = useLocation();
  const { t } = useTranslation();
  const { id, userId } = useParams();
  const { getOffer } = useOffer();

  const navigate = useNavigate();
  const { forPaymentArr } = useCurrencies();
  const {
    onToggleBackButton,
    setBackButtonCallBack,
    offBackButtonCallBack,
    onToggleMainButton,
    tg,
  } = useTg();
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const wayBack = location.state?.from || "/";
  const backButtonHandler = () => navigate(wayBack);

  useEffect(() => {
    getOffer(id, userId);
  }, [id]);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    tg.MainButton.show();
    onToggleMainButton(true, t("back"));

    tg.onEvent("mainButtonClicked", backButtonHandler);

    return () => {
      tg.offEvent("mainButtonClicked", backButtonHandler);
      offBackButtonCallBack(backButtonHandler);
      onToggleMainButton(false, t("back"));
      tg.MainButton.hide();
    };
  }, []);
  // useEffect(() => {
  //   if (currentOfferData?.sellerData._id)
  //     dispatch(getCommentsByUserId(currentOfferData?.sellerData._id));
  // }, [currentOfferData?.sellerData._id]);
  const currency = getLabel(forPaymentArr, currentOfferData?.currency);
  const forPayment = getLabel(forPaymentArr, currentOfferData?.forPayment);
  const forPaymentItem = forPaymentArr.find(
    (item) => item.code === currentOfferData?.forPayment
  );
  const { reviews, reviewsIsLoading } = useAppSelector(
    (state) => state.applicationReducer
  );
  const listArr = [
    {
      label: `${t("priceFor1")} ${currency}`,
      handleClick: () => {},
      value: !!currentOfferData?.price ? (
        <Primary>
          <Price value={1 / currentOfferData?.price} /> ${forPayment}
        </Primary>
      ) : (
        <></>
      ),
      isLoading: offerIsLoading,
    },
    {
      label: `${t("priceFor1")} ${forPayment}`,
      handleClick: () => {},
      value: !!currentOfferData?.price ? (
        <Primary>
          <Price value={currentOfferData?.price} /> ${currency}
        </Primary>
      ) : (
        <></>
      ),
      isLoading: offerIsLoading,
    },
    {
      label: t("limits"),
      handleClick: () => {},
      value: currentOfferData ? (
        <Column>
          <Primary>
            <Price
              value={
                (currentOfferData.minQuantity * 1) / currentOfferData.price
              }
            />
            {` - `}
            <Price
              value={(currentOfferData.quantity * 1) / currentOfferData.price}
            />
            {` ${forPayment}`}
          </Primary>
          <Primary>
            <Price value={currentOfferData?.minQuantity} />
            {` - `}
            <Price value={currentOfferData?.quantity} />
            {` ${currency}`}
          </Primary>
        </Column>
      ) : (
        <></>
      ),
      isLoading: offerIsLoading,
    },
    {
      label: t("paymentMethods"),
      handleClick: () => {},
      value: (
        <Column>
          {currentOfferData?.paymentMethods?.map((item) => (
            <div>
              {
                forPaymentItem?.paymentMethodsList.find(
                  (metod) => metod.code === item
                )?.label
              }
            </div>
          ))}
        </Column>
      ),
      isLoading: offerIsLoading,
    },
    {
      label: t("delivery"),
      handleClick: () => {},
      value: (
        <Primary>
          {currentOfferData?.delivery.isDelivered ? t("available") : t("no")}
        </Primary>
      ),
      isLoading: offerIsLoading,
    },
    !!currentOfferData?.delivery.isDelivered &&
      !!currentOfferData?.delivery.distance && {
        label: t("maximumDistance"),
        handleClick: () => {},
        value: <Primary>{currentOfferData?.delivery.distance}</Primary>,
        isLoading: offerIsLoading,
      },
    !!currentOfferData?.delivery.isDelivered &&
      !!currentOfferData?.delivery.price && {
        label: t("deliveryPrice"),
        handleClick: () => {},
        value: <Primary>{currentOfferData?.delivery.price}</Primary>,
        isLoading: offerIsLoading,
      },
  ]?.filter((item) => !!item);
  const tabsArray = [t("offerDetails"), t("reviews")];
  return (
    <StyledContainer>
      <UserInfo currentUser={currentOfferData?.sellerData} />
      <TabsContainer>
        <TabsComponent
          array={tabsArray}
          onChange={setCurrentTab}
          value={currentTab}
        />
      </TabsContainer>
      {!currentTab ? (
        <>
          <ListDividers listArr={listArr} />
          {!offerIsLoading && currentOfferData?.comment && (
            <CommentPaper>
              <CommentTitle>
                <ChatBubbleOutlineIcon /> {` ${t("comment")}`}
              </CommentTitle>
              {currentOfferData?.comment}
            </CommentPaper>
          )}
        </>
      ) : (
        <>
          {reviewsIsLoading ? (
            <ReviewSkeleton />
          ) : reviews.length ? (
            <Reviews reviewArray={reviews} />
          ) : (
            <NoResults text={t("noResults5")} noAnimation />
          )}
        </>
      )}
    </StyledContainer>
  );
};
const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 8px;
  cursor: pointer;
`;
const Primary = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    * {
      color: ${theme.palette.button.primary} !important;
    }
  `}
`;
const CommentPaper = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    border-radius: 12px;
    padding: 16px;
    color: ${theme.palette.text.secondary};
    white-space: normal;
  `}
`;

const CommentTitle = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 8px;
    svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
