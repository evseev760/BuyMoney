import CurrencyInput from "react-currency-input-field";
import styled, { DefaultTheme, css } from "styled-components";

interface QuantityProps {
  isValid: boolean;
  onChange: (value?: number) => void;
  value?: number;
  currency: string;
  label: string;
}

export const Quantity = (props: QuantityProps) => {
  const { isValid, onChange, value, currency, label } = props;
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  return (
    <Container>
      <Title>{label}</Title>
      <QuantityInput
        onValueChange={handleChange}
        value={value}
        isValid={isValid}
        placeholder={label}
      />
      <StyledSuffix isValid={isValid}>{currency}</StyledSuffix>
    </Container>
  );
};

const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    margin-left: 8px;
    color: ${theme.palette.text.primary};
    font-size: 16px;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-top: 16px;
`;

const QuantityInput = styled(CurrencyInput)<{ isValid: boolean }>`
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
