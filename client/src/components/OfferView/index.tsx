import { Skeleton } from "@material-ui/lab";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import { Avatar } from "components/Avatar";
import { MainButton } from "components/MainButton";
import Price from "components/Price";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { Rating } from "@material-ui/lab";
import { OfferData } from "models/IOffer";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled, { DefaultTheme, css } from "styled-components";
import { getLabel } from "utils/Currency";
import { Numeral } from "components/Numeral";
import EditIcon from "@mui/icons-material/Edit";
import SwipeableListItem from "components/SwipeableListItemProps";
import { useTranslation } from "react-i18next";
import { getLocationTitle } from "utils/location";
import { InfoRow } from "components/Styles/Styles";
import { deliteOffer } from "store/reducers/offer/ActionCreators";
import { useState } from "react";
import { DeliteDialog } from "components/Dialogs/Delite";

interface OfferViewProps {
  offer: OfferData;
  isMy?: boolean;
}
export const OfferView = (props: OfferViewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { forPaymentArr, currenciesIsloading } = useCurrencies();
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { deliteOfferIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );

  const [isOpenDelite, setIsOpenDelite] = useState(false);

  const { offer, isMy } = props;

  const getCurrencyPaymentMethods = () => {
    return (
      forPaymentArr.find((item) => item.code === offer.forPayment)
        ?.paymentMethodsList || []
    );
  };
  const isRevers = !(offer.price > 100);
  const getViewPrice = () => {
    const shouldReversePrice = isRevers;
    return shouldReversePrice ? 1 / offer.price : offer.price;
  };

  const getMainUnit = () => {
    if (currenciesIsloading) return <Skeleton width={50} />;
    return (
      forPaymentArr.find(
        (item) => item.code === (isRevers ? offer.forPayment : offer.currency)
      )?.label || <Skeleton width={50} />
    );
  };

  const getSecondUnit = () => {
    if (currenciesIsloading) return <Skeleton width={50} />;
    return (
      forPaymentArr.find(
        (item) => item.code === (isRevers ? offer.currency : offer.forPayment)
      )?.label || <Skeleton width={50} />
    );
  };
  const onGoToEditOffer = () => {
    navigate(`${RouteNames.EDITOFFER}/${offer._id}`);
  };
  const onGoToOffer = () => {
    navigate(`${RouteNames.OFFER}/${offer._id}`);
  };
  const getDistance = () => {
    if (!offer.distance) return 0;
    return Number(
      offer.distance % 1 === 0
        ? (offer.distance / 1000).toFixed(0)
        : (offer.distance / 1000).toFixed(1)
    );
  };
  const goToOfferDrtails = () =>
    navigate(
      `${RouteNames.OFFERDETAILS}/${offer._id}/${offer.sellerData._id}`,
      {
        state: {
          from: isMy
            ? `${RouteNames.MYOFFERS}`
            : `${RouteNames.OFFERS}#${offer._id}`,
        },
      }
    );
  const deliteOfferHandel = () => {
    dispatch(deliteOffer({ offerId: offer._id }));
  };
  return (
    <BorderRadius>
      <SwipeableListItem
        onClick={() => setIsOpenDelite(true)}
        isDisabled={!isMy}
      >
        <Container id={offer._id}>
          <StyledHeader>
            <ColumnContainer onClick={goToOfferDrtails}>
              <PriceRow>
                <Price value={getViewPrice()} />
                <span>{getMainUnit()}</span>
              </PriceRow>
              <Label>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  {/* <span> */}
                  {`${t("priceFor1")} `}
                  {getSecondUnit()}
                  {/* </span> */}

                  <IconsContainer>
                    {offer.sellerData.isAnOffice && <BusinessOutlinedIcon />}
                    {offer.delivery.isDelivered && (
                      <DeliveryDiningOutlinedIcon
                        sx={{ marginBottom: "-3px" }}
                      />
                    )}
                  </IconsContainer>
                </div>
              </Label>
            </ColumnContainer>
            <ButtonContainer>
              {isMy ? (
                <MainButton
                  handleClick={onGoToEditOffer}
                  text=""
                  icon={<EditIcon />}
                  isLoading={deliteOfferIsLoading.includes(offer._id)}
                  disabled={deliteOfferIsLoading.includes(offer._id)}
                />
              ) : (
                <MainButton handleClick={onGoToOffer} text={t("buy")} />
              )}
            </ButtonContainer>
          </StyledHeader>
          <StyledBody>
            {!isMy && (
              <InfoRow onClick={goToOfferDrtails}>
                <LeftBlock>
                  <Label>
                    <Avatar
                      avatar={offer?.sellerData?.avatar || ""}
                      size={24}
                    />
                    {offer?.sellerData?.nickname}
                  </Label>
                </LeftBlock>
                <RightBlock>
                  <Value>
                    {!!offer?.sellerData?.ratings?.average && (
                      <Grade>
                        <Price value={offer.sellerData.ratings.average} />
                      </Grade>
                    )}
                    <ColumnContainer style={{ gap: 0 }}>
                      <StyledRating
                        defaultValue={5}
                        value={offer.sellerData.ratings.average}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <GradeCount>
                        {t("totalMarks")}{" "}
                        <Secondary>
                          <Price value={offer.sellerData.ratings.count} />
                        </Secondary>
                      </GradeCount>
                    </ColumnContainer>
                  </Value>
                </RightBlock>
              </InfoRow>
            )}
            {!!offer.comment && (
              <InfoRow>
                <LeftBlock>
                  <Label>
                    <Comment>{offer.comment}</Comment>
                  </Label>
                </LeftBlock>
              </InfoRow>
            )}

            <div style={{ marginBottom: "8px" }}></div>
            <StyledInfoContainer>
              {!!offer.paymentMethods?.length && (
                <InfoRow>
                  <LeftBlock>
                    <Label>{t("payment")}</Label>
                  </LeftBlock>
                  <RightBlock>
                    <GradeCount>
                      {offer.paymentMethods.map((item) => (
                        <span>
                          {getLabel(getCurrencyPaymentMethods(), item)}
                        </span>
                      ))}
                    </GradeCount>
                  </RightBlock>
                </InfoRow>
              )}
              <InfoRow>
                <LeftBlock>
                  <Label>{t("limits")}</Label>
                </LeftBlock>
                <RightBlock>
                  <Value>
                    <Numeral value={offer.minQuantity} />
                    {" - "}
                    <Numeral value={offer.quantity} />
                    <span>{!isRevers ? getMainUnit() : getSecondUnit()}</span>
                  </Value>
                </RightBlock>
              </InfoRow>

              {!!offer.distance && (
                <InfoRow>
                  <LeftBlock>
                    <Label>{t("fromYou")}</Label>
                  </LeftBlock>
                  <RightBlock>
                    <Value>
                      <span>≈</span>
                      <Price value={getDistance()} />
                      <span>km</span>
                    </Value>
                  </RightBlock>
                </InfoRow>
              )}
              {!!offer?.delivery?.isDelivered &&
                !!offer?.delivery?.distance && (
                  <InfoRow>
                    <LeftBlock>
                      <Label>{t("delivery")}</Label>
                    </LeftBlock>
                    <RightBlock>
                      <Value>
                        <span>{t("upTo")}</span>
                        <Price value={offer?.delivery?.distance} />
                        <span>km</span>
                        {!!offer?.delivery.price ? (
                          <Label>
                            <Secondary>
                              <Price value={offer?.delivery?.price} />
                            </Secondary>
                            <span>
                              {isRevers ? getMainUnit() : getSecondUnit()}
                            </span>
                          </Label>
                        ) : (
                          <Label></Label>
                        )}
                      </Value>
                    </RightBlock>
                  </InfoRow>
                )}
              {getLocationTitle(currentUser.location) !==
                getLocationTitle(offer.location) && (
                <InfoRow>
                  <LeftBlock></LeftBlock>
                  <RightBlock>
                    <Label>
                      <Comment>{getLocationTitle(offer.location)}</Comment>
                    </Label>
                  </RightBlock>
                </InfoRow>
              )}
            </StyledInfoContainer>
            <DeliteDialog
              handleClick={() => {}}
              onConfirm={deliteOfferHandel}
              text={t("delete")}
              dialogText={t("deleteTheAd")}
              isOpen={isOpenDelite}
              onClose={() => setIsOpenDelite(false)}
              // icon={<DoDisturbAltOutlinedIcon />}

              noBtn={true}
            />
          </StyledBody>
        </Container>
      </SwipeableListItem>
    </BorderRadius>
  );
};
const BorderRadius = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    border-radius: 12px;
    overflow: hidden;
  `}
`;
const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    display: flex;
    flex-direction: column;
    /* gap: 1px; */
    position: relative;
  `}
`;
const StyledHeader = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};

    border-radius: 12px 12px 0 0;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${theme.palette.background.primary};
  `}
`;
const StyledBody = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    /* min-height: 128px; */
    border-radius: 0 0 12px 12px;
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `}
`;
const StyledInfoContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    /* background-color: ${theme.palette.background.secondary}; */
    /* min-height: 128px; */

    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `}
`;
const PriceRow = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 28px;
    display: flex;
    gap: 8px;
    & * {
      font-family: ui-rounded, sans-serif !important;
    }
  `}
`;
const ColumnContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `}
`;

const ButtonContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
  `}
`;

const Value = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-weight: 300;
    font-size: 16px;
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
  `}
`;
const Label = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 16px;
    font-weight: 300;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  `}
`;
const Comment = styled.div`
  white-space: normal;
  line-height: 16px;
`;
const GradeCount = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 13px;
    font-weight: 300;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  `}
`;

const Secondary = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & * {
      color: ${theme.palette.text.secondary} !important;
    }
  `}
`;
const Grade = styled.div`
  & {
    font-size: 28px;
  }
`;
const StyledRating = styled(Rating)(({ theme }) => ({
  "&": {
    fontSize: "12px",
  },
  "& .MuiRating-iconFilled": {
    color: theme.palette.button.primary,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.button.primary,
  },
}));
const LeftBlock = styled.div`
  flex: 3;
`;
const RightBlock = styled.div`
  flex: 4;
`;
const IconsContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    gap: 8px;
    align-items: center;
    & svg {
      fill: ${theme.palette.button.primary};
    }
    padding-left: 8px;
  `}
`;
