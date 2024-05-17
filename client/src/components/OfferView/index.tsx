import { Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Avatar } from "components/Avatar";
import { MainButton } from "components/MainButton";
import Price from "components/Price";
import { useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { useFilter } from "hooks/useFilter";
import { OfferData } from "models/IOffer";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled, { DefaultTheme, css } from "styled-components";

interface OfferViewProps {
  offer: OfferData;
}
export const OfferView = (props: OfferViewProps) => {
  const navigate = useNavigate();
  const { currency, forPayment } = useAppSelector(
    (state) => state.filterReducer
  );
  const { forPaymentArr } = useCurrencies();
  const { price } = useAppSelector((state) => state.currencyReducer);

  const { offer } = props;
  const isReversePrice = offer.interestPrice
    ? price.data.price < 0.1
    : offer.price < 0.1;
  const getViewPrice = () => {
    if (offer.interestPrice) {
      const interestPrice = (offer.interestPrice / 100) * price.data.price;
      return isReversePrice ? 1 / interestPrice : interestPrice;
    } else {
      return isReversePrice ? 1 / offer.price : offer.price;
    }
  };
  const getMainUnit = () => {
    return (
      forPaymentArr.find(
        (item) => item.code === (isReversePrice ? currency : forPayment)
      )?.label || <Skeleton width={50} />
    );
  };
  const getSecondUnit = () => {
    return (
      forPaymentArr.find(
        (item) => item.code === (isReversePrice ? forPayment : currency)
      )?.label || <Skeleton width={50} />
    );
  };
  const onGoToOffer = () => {
    navigate(`${RouteNames.OFFER}/${offer._id}`);
  };
  console.log(444, price.data.price, offer);
  return (
    <Container>
      <StyledHeader>
        <PriceContainer>
          <PriceRow>
            <Price value={getViewPrice()} />
            <span>{getMainUnit()}</span>
          </PriceRow>
          <Label>Цена за 1 {getSecondUnit()}</Label>
        </PriceContainer>
        <ButtonContainer>
          <MainButton handleClick={onGoToOffer} text="Купить" />
        </ButtonContainer>
      </StyledHeader>
      <StyledBody>
        <InfoRow>
          <Label>
            <Avatar avatar={offer.mainUserAvatar} size={24} />
          </Label>
          <Value>{offer.mainUsername}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Доступно</Label>
          <Value>{offer.quantity}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Лимиты</Label>
          <Value>{offer?.minQuantity}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Доставка</Label>
          <Value>{offer?.delivery?.distance}</Value>
        </InfoRow>
      </StyledBody>
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    display: flex;
    flex-direction: column;
    gap: 1px;
    position: relative;
  `}
`;
const StyledHeader = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};

    border-radius: 12px 12px 0 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;
  `}
`;
const StyledBody = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};

    border-radius: 0 0 12px 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `}
`;
const PriceRow = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 24px;
    display: flex;
    gap: 8px;
    & * {
      font-family: ui-rounded, sans-serif !important;
    }
  `}
`;
const PriceContainer = styled.div`
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
const InfoRow = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: space-between;
  `}
`;
const Value = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 16px;
    flex: 1;
  `}
`;
const Label = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 16px;
    flex: 1;
  `}
`;
