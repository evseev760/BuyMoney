import { useAppSelector } from "hooks/redux";
import { DeliveryValues } from "models/IOffer";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";
import styled, { DefaultTheme, css } from "styled-components";

interface DeliveryProps {
  isValid: boolean;
  onChange: (value: DeliveryValues) => void;
  deliveryValues?: DeliveryValues;
  currency: string;
}
export const Delivery = (props: DeliveryProps) => {
  const { t } = useTranslation();
  const { isValid, onChange, deliveryValues, currency } = props;
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const handleChangeDeliveryPrice = (value: any, name: any, values: any) => {
    onChange({ ...deliveryValues, price: values.float });
  };

  return currentUser.delivery.isDelivered ? (
    <>
      <Container>
        <Title>{t("costOfDelivery")}</Title>
        <QuantityInput
          onValueChange={handleChangeDeliveryPrice}
          value={deliveryValues?.price}
          placeholder={t("costOfDelivery")}
          disabled={false}
        />
        <StyledSuffix isValid={isValid}>{currency}</StyledSuffix>
      </Container>
      <br />
      <br />
      <br />
    </>
  ) : (
    <></>
  );
};

const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 16px;
    margin-left: 8px;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-top: 16px;
`;

const QuantityInput = styled(CurrencyInput)<{ disabled: boolean }>`
  ${({ theme, disabled }: { theme: DefaultTheme; disabled: boolean }) => css`
    ::placeholder {
      color: ${theme.palette.text.secondary};
      opacity: 1;
    }

    color: ${theme.palette.button.primary};
    font-size: 16px;
    background-color: ${theme.palette.background.secondary};
    height: 32px;
    padding: 8px 16px;
    outline: none;
    border: none;
    border-radius: 12px;

    opacity: ${disabled ? 0.4 : 1};
  `}
`;

const StyledSuffix = styled.div<{ isValid: boolean }>`
  ${({ theme, isValid }: { theme: DefaultTheme; isValid: boolean }) => css`
    position: absolute;
    font-size: 16px;
    right: 16px;
    bottom: 0px;
    height: 48px;
    color: ${isValid ? theme.palette.text.primary : "red"};
    display: flex;
    align-items: center;
    gap: 8px;
  `}
`;
