import CircularProgress from "@mui/material/CircularProgress";
import Button from "@material-ui/core/Button";
import styled, { DefaultTheme, css, useTheme } from "styled-components";

interface ButtonProps {
  text: string;
  handleClick: () => void;
  icon?: any;
  disabled?: boolean;
  isLoading?: boolean;
}
export const SecondButton = (props: ButtonProps) => {
  const { text, handleClick, icon, disabled, isLoading } = props;
  const theme = useTheme();
  return (
    <StyledButton disabled={!!disabled} disableRipple onClick={handleClick}>
      {!isLoading && icon && <IconContainer>{icon}</IconContainer>}
      {!isLoading && text}
      {isLoading && (
        <CircularProgress
          size={20}
          sx={{ color: theme.palette.buttonText.primary }}
        />
      )}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    cursor: pointer !important;
    background-color: ${theme.palette.button.secondary};
    color: ${theme.palette.buttonText.secondary};
    flex-grow: 1;
    height: 28px;
    /* width: 84px; */
    padding: 0 12px;
    border-radius: 8px;
    & svg {
      fill: ${theme.palette.buttonText.secondary};
    }
    &:hover {
      background-color: ${theme.palette.button.secondary};
      color: ${theme.palette.buttonText.secondary};
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
