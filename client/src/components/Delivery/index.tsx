import { DeliveryValues } from "models/IOffer";
import CurrencyInput from "react-currency-input-field";
import styled, { DefaultTheme, css } from "styled-components";

interface DeliveryProps {
  isValid: boolean;
  onChange: (value: DeliveryValues) => void;
  deliveryValues?: DeliveryValues;
  currency: string;
}
export const Delivery = (props: DeliveryProps) => {
  const { isValid, onChange, deliveryValues, currency } = props;
  // const handleChangeMaxDistance = (value: any, name: any, values: any) => {
  //   onChange({ ...deliveryValues, distance: values.float });
  // };
  const handleChangeDeliveryPrice = (value: any, name: any, values: any) => {
    onChange({ ...deliveryValues, price: values.float });
  };
  // const handleChangeIsDelivered = (value: boolean) => {
  //   onChange({
  //     ...deliveryValues,
  //     isDelivered: value,
  //     price: undefined,
  //     distance: undefined,
  //   });
  // };
  return (
    <>
      {/* <Title>Доставка</Title> */}
      {/* <SwitchContainer>
        <Title>Есть доставка</Title>
        <StyledSwitch
          isOn={!!deliveryValues?.isDelivered}
          handleChangeSwitch={handleChangeIsDelivered}
        />
      </SwitchContainer> */}
      {/* <Container> */}
      {/* <Title>Максимальное расстояние</Title> */}
      {/* <QuantityInput
          onValueChange={handleChangeMaxDistance}
          value={deliveryValues?.distance}
          placeholder={"Максимальное расстояние"}
          disabled={!deliveryValues?.isDelivered}
          style={{ borderRadius: "12px 12px 0 0" }}
        />
        <StyledSuffix isValid={isValid}>km.</StyledSuffix> */}
      {/* </Container> */}

      <Container style={{ marginTop: "1px" }}>
        <Title>Стоимость доставки</Title>
        <QuantityInput
          onValueChange={handleChangeDeliveryPrice}
          value={deliveryValues?.price}
          placeholder={"Стоимость доставки"}
          disabled={!deliveryValues?.isDelivered}
          style={{ borderRadius: "0 0 12px 12px" }}
        />
        <StyledSuffix isValid={isValid}>{currency}</StyledSuffix>
      </Container>
      <br />
      <br />
      <br />
    </>
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
const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
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

// const StyledSwitch = styled(Switch)`
//   ${({ theme }: { theme: DefaultTheme }) => css`
//     .MuiSwitch-colorSecondary.Mui-checked {
//       color: ${theme.palette.button.primary};
//     }
//     .MuiSwitch-switchBase {
//       color: ${theme.palette.button.secondary};
//     }
//     .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
//       background-color: ${theme.palette.text.secondary};
//     }
//     .MuiSwitch-track {
//       background-color: ${theme.palette.background.secondary};
//     }
//   `}
// `;
