import { Switch } from "@material-ui/core";
import styled, { css, DefaultTheme } from "styled-components";
interface StyledSwitchProps {
  isOn: boolean;
  handleChangeSwitch: (value: boolean) => void;
  disabled?: boolean;
}
export const StyledSwitch = (props: StyledSwitchProps) => {
  const { isOn, handleChangeSwitch, disabled } = props;
  return (
    <StyledSwitchComponent
      checked={isOn}
      onChange={(e: any) => handleChangeSwitch(e.target.checked)}
      disabled={disabled}
    />
  );
};
const StyledSwitchComponent = styled(Switch)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    .MuiSwitch-colorSecondary.Mui-checked {
      color: ${theme.palette.button.primary};
    }
    .MuiSwitch-switchBase {
      color: ${theme.palette.button.secondary};
    }
    .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
      background-color: ${theme.palette.text.secondary};
    }
    .MuiSwitch-track {
      background-color: ${theme.palette.background.secondary};
    }
  `}
`;
