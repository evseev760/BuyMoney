import { OfferData } from "models/IOffer";
import styled, { DefaultTheme, css } from "styled-components";
import {
  fiatCurrenciesArray,
  criptoCurrenciesArray,
  getLabel,
} from "models/Currency";

interface OfferViewProps {
  offer: OfferData;
}
export const OfferView = (props: OfferViewProps) => {
  const { offer } = props;
  return (
    <Container>
      <StyledHeader>
        <PriceContainer>
          <Price>
            {offer.price
              ? offer.price
              : offer.interestPrice +
                " " +
                getLabel(criptoCurrenciesArray, offer.forPayment)}{" "}
          </Price>
          <Label>
            Цена за 1 {getLabel(fiatCurrenciesArray, offer.currency)}
          </Label>
        </PriceContainer>
        <ButtonContainer></ButtonContainer>
      </StyledHeader>
      <StyledBody>
        <InfoRow>
          <Label>Аватар</Label>
          <Value>{offer.mainUsername}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Доступно</Label>
          <Value>{offer.quantity}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Лимиты</Label>
          <Value>{offer.minQuantity}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Доставка</Label>
          <Value>{offer.delivery.distance}</Value>
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
const Price = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 24px;
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
