import { TextField } from "@material-ui/core";
import styled, { DefaultTheme, css } from "styled-components";
import CurrencyInput from "react-currency-input-field";

interface FlexPriceProps {
  onChange: (value: number) => void;
  value?: number;
  isValid: boolean;
}
export const FlexPriceInput = (props: FlexPriceProps) => {
  const { onChange, value, isValid } = props;
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  return (
    <Container>
      <Title>Процент от рыночной цены</Title>
      <StiledCurrencyInput
        id="input-example"
        name="input-name"
        placeholder={`70 ~ 150 % `}
        defaultValue={value}
        decimalsLimit={2}
        maxLength={5}
        onValueChange={handleChange}
        suffix={"  %"}
        isValid={isValid}
      />
    </Container>
  );
};

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    margin-left: 8px;
    color: ${theme.palette.text.primary};
    font-size: 16px;
  `}
`;
