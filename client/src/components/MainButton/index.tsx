import Button from "@material-ui/core/Button";
import { useTg, ThemeParamsProps } from "hooks/useTg";
import styled, { DefaultTheme, css } from "styled-components";

interface ButtonProps {
  text: string;
  handleClick: () => void;
  icon?: any;
}
export const MainButton = (props: ButtonProps) => {
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
    background-color: ${theme.palette.button.primary};
    color: ${theme.palette.text.primary};
    flex-grow: 1;
    height: 28px;
    /* width: 84px; */
    padding: 0 12px;
    border-radius: 8px;
    & svg {
      fill: ${theme.palette.text.primary};
    }
    &:hover {
      background-color: ${theme.palette.button.primary};
      color: ${theme.palette.text.primary};
      opacity: 0.9;
    }
    &:active {
      opacity: 0.8;
    }
  `}
`;
const IconContainer = styled.div`
  margin: 0 8px;
  display: flex;
`;
