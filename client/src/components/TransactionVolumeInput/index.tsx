import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import styled, { css, DefaultTheme } from "styled-components";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useCurrencies } from "hooks/useCurrencies";
import { Button } from "@material-ui/core";

interface TransactionVolumeInputProps {
  onChange: (value: number) => void;
  secondCurrency?: string;
  firstCurrency?: string;
  currentValue?: number;
  isValid?: boolean;
  isReversePrice: boolean;
  setIsReversePrice: (value: boolean) => void;
}

export const TransactionVolumeInput = (props: TransactionVolumeInputProps) => {
  const {
    onChange,
    secondCurrency,
    firstCurrency,
    currentValue,
    isValid,
    isReversePrice,
    setIsReversePrice,
  } = props;
  const { getLabel } = useCurrencies();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  const onSwap = () => {
    setIsReversePrice(!isReversePrice);
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <Container>
      <StiledVolumeInput
        ref={inputRef}
        minLength={1}
        defaultValue={currentValue}
        decimalsLimit={10}
        onValueChange={handleChange}
        isValid={!!isValid}
        // suffix={
        //   " " +
        //   (isReversePrice ? getLabel(firstCurrency) : getLabel(secondCurrency))
        // }
      />
      <StyledSuffix isValid={!!isValid}>
        {isReversePrice ? getLabel(firstCurrency) : getLabel(secondCurrency)}
        <SwapButton onClick={onSwap}>
          <SwapHorizIcon />
        </SwapButton>
      </StyledSuffix>
    </Container>
  );
};
const StiledVolumeInput = styled(CurrencyInput)<{ isValid: boolean }>`
  ${({ theme, isValid }: { theme: DefaultTheme; isValid: boolean }) => css`
    ::placeholder {
      color: ${theme.palette.text.secondary};
      opacity: 1;
    }

    color: ${isValid ? theme.palette.button.primary : "red"};
    font-size: 40px;
    background-color: ${theme.palette.background.primary};
    height: 64px;
    padding: 8px 0;
    outline: none;
    border: none;
    border-radius: 12px;
    font-family: ui-rounded, sans-serif !important;
  `}
`;
const SwapButton = styled(Button)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    height: 48px;
    width: 48px;
    min-width: 32px;
    border-radius: 12px;
    & svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
const StyledSuffix = styled.div<{ isValid: boolean }>`
  ${({ theme, isValid }: { theme: DefaultTheme; isValid: boolean }) => css`
    position: absolute;
    font-size: 40px;
    right: 0;
    bottom: 16px;
    height: 48px;
    color: ${isValid ? theme.palette.button.primary : "red"};
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ui-rounded, sans-serif !important;
  `}
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  position: relative;
`;
