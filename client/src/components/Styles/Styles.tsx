import styled, { DefaultTheme, css } from "styled-components";
import CurrencyInput from "react-currency-input-field";
import { Button } from "@material-ui/core";

export const StiledCurrencyInput = styled(CurrencyInput)<{ isValid: boolean }>`
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

export const StiledTextInput = styled.input<{ isValid: boolean }>`
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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  position: relative;
`;
export const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    margin-left: 8px;
    color: ${theme.palette.text.primary};
    font-size: 16px;
  `}
`;
export const SwapButton = styled(Button)`
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
export const StyledSuffix = styled.div<{ isValid: boolean }>`
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
export const Primary = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary} !important;
  `}
`;

export const PrimaryBtn = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.button.primary} !important;
    & * {
      color: ${theme.palette.button.primary} !important;
    }
  `}
`;
export const Label = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    flex: 1;
    display: flex;
    align-items: center;
    font-weight: 300;
    gap: 8px;
    & * {
      color: ${theme.palette.text.secondary};
    }
  `}
`;

export const Value = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 16px;
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 300;
  `}
`;
export const InfoRow = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}
`;
export const IconTitle = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 14px;
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 300;
    & svg {
      fill: ${theme.palette.button.primary};
      width: 30px;
      height: 30px;
    }
  `}
`;
export const IconStatus = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & svg {
      fill: ${theme.palette.button.primary};
      width: 20px;
      height: 20px;
    }
  `}
`;
