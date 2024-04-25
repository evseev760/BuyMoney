import { Button, TextField } from "@material-ui/core";
import styled, { DefaultTheme, css } from "styled-components";
import CurrencyInput from "react-currency-input-field";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

interface FlexPriceProps {
  onChange: (value: number) => void;
  value?: number;
  firstCurrency: string;
  secondCurrency: string;
  isValid: boolean;
  isReversePrice: boolean;
  setIsReversePrice: () => void;
}
export const FixPriceInput = (props: FlexPriceProps) => {
  const {
    onChange,
    value,
    firstCurrency,
    secondCurrency,
    isValid,
    isReversePrice,
    setIsReversePrice,
  } = props;

  const handleChange = (value: any, name: any, values: any) => {
    console.log(333, value, name, values);
    onChange(values.float);
  };
  console.log(222, value);
  return (
    <Container>
      <Title>Фиксированная цена</Title>
      <StiledCurrencyInput
        placeholder={`${isReversePrice ? "Отдам" : "Получу"} за 1 ${
          isReversePrice ? secondCurrency : firstCurrency
        } `}
        defaultValue={value}
        decimalsLimit={10}
        onValueChange={handleChange}
        isValid={isValid}
      />

      <StyledSuffix isValid={isValid}>
        {isReversePrice ? firstCurrency : secondCurrency}
        <SwapButton onClick={setIsReversePrice}>
          <SwapHorizIcon />
        </SwapButton>
      </StyledSuffix>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-top: 16px;
`;
const SwapButton = styled(Button)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    height: 32px;
    width: 32px;
    min-width: 32px;
    & svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    margin-left: 8px;
    color: ${theme.palette.text.primary};
    font-size: 16px;
  `}
`;

const StiledCurrencyInput = styled(CurrencyInput)<{ isValid: boolean }>`
  ${({ theme, isValid }: { theme: DefaultTheme; isValid: boolean }) => css`
    ::placeholder {
      color: ${theme.palette.text.secondary};
      opacity: 1;
    }

    color: ${isValid ? theme.palette.button.primary : "red"};
    font-size: 16px;
    background-color: ${theme.palette.background.secondary};
    height: 32px;
    padding: 8px 16px;
    outline: none;
    border: none;
    border-radius: 12px;
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
