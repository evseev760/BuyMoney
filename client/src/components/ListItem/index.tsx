import { ListItem, ListItemText } from "@material-ui/core";
import { DrawerComponent } from "components/Drawer";
import { Theme } from "models/Theme";
import styled, { DefaultTheme, css } from "styled-components";

interface ListItemProps {
  handleClick: () => void;
  label: string;
  icon?: any;
  value?: string;
}

export const ListItemComponent = ({
  handleClick,
  label,
  icon,
  value,
}: ListItemProps) => {
  return (
    <ListItemContainer>
      <StyledListItem button onClick={handleClick}>
        {icon && <IconContainer>{icon}</IconContainer>}
        <ListItemText primary={label} />
        <StyledValue>{value && value}</StyledValue>
      </StyledListItem>
    </ListItemContainer>
  );
};

const StyledListItem = styled(ListItem)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    cursor: pointer;
    -webkit-user-select: none;
    &:hover {
      background-color: ${theme.palette.background.secondary};
      color: ${theme.palette.text.primary};
      opacity: 0.9;
    }
  `}
`;
const StyledValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.button.primary};
  `}
`;

const IconContainer = styled.div`
  display: flex;
  margin: 0 8px;
`;

const ListItemContainer = styled.div`
  position: relative;
  &:first-child {
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }
`;
