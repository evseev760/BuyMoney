import { useEffect, useRef } from "react";
import { PriceInputSkeleton } from "../FlexPriceInput/PriceInputSkeleton";
import {
  Container,
  Title,
  StiledCurrencyInput,
  StyledSuffix,
} from "components/Styles/Styles";

interface QuantityProps {
  isValid: boolean;
  onChange: (value?: number) => void;
  value?: number;
  defaultValue?: number;
  currency: string;
  label: string;
  isLoading?: boolean;
  focus?: boolean;
}

export const Quantity = (props: QuantityProps) => {
  const {
    isValid,
    onChange,
    value,
    defaultValue,
    currency,
    label,
    isLoading,
    focus,
  } = props;
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>{label}</Title>
      <StiledCurrencyInput
        ref={inputRef}
        onValueChange={handleChange}
        value={value}
        isValid={isValid}
        placeholder={label}
        defaultValue={defaultValue}
      />
      <StyledSuffix isValid={isValid}>{currency}</StyledSuffix>
    </Container>
  );
};
