import Button from "@material-ui/core/Button";
import { useTg, ThemeParamsProps } from "hooks/useTg";
import styled, { DefaultTheme, css } from "styled-components";

interface ButtonProps {
  text: string;
  handleClick: () => void;
  icon?: any;
}
export const ActionButton = (props: ButtonProps) => {
  const { text, handleClick, icon } = props;
  const { themeParams } = useTg();
  return (
    <StyledButton disableRipple onClick={handleClick}>
      {icon && <IconContainer>{icon}</IconContainer>}
      {text}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    cursor: pointer !important;
    background-color: ${theme.palette.button.secondary};
    color: ${theme.palette.button.primary};
    flex-grow: 1;
    height: 48px;
    border-radius: 12px;
    & svg {
      fill: ${theme.palette.button.primary};
    }
    &:hover {
      background-color: ${theme.palette.button.secondary};
      color: ${theme.palette.button.primary};
      opacity: 0.9;
    }
    /* &:active {
      background-color: ${theme.palette.button.primary};
    } */
  `}
`;
const IconContainer = styled.div`
  margin: 0 8px;
  display: flex;
`;
