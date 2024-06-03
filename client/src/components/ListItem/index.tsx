import { ListItem, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import styled, { DefaultTheme, css } from "styled-components";

export interface ListItemProps {
  handleClick: () => void;
  label: string;
  icon?: any;
  value?: string | JSX.Element;
  disable?: boolean;
  isLoading?: boolean;
  isSelect?: boolean;
}

export const ListItemComponent = ({
  handleClick,
  label,
  icon,
  value,
  disable,
  isLoading,
  isSelect,
}: ListItemProps) => {
  return (
    <>
      {isLoading ? (
        <ListItemSkeleton />
      ) : (
        <ListItemContainer>
          <StyledListItem
            disabled={disable}
            button
            disableRipple
            onClick={handleClick}
          >
            {icon && <IconContainer>{icon}</IconContainer>}
            <ListItemText primary={label} />
            <StyledValue>
              {value && value} {isSelect && <ArrowDropDownIcon />}
            </StyledValue>
          </StyledListItem>
        </ListItemContainer>
      )}
    </>
  );
};
const getRandomWidth = () => `${Math.random() * (70 - 30) + 30}%`;
const ListItemSkeleton = () => (
  <ListItemContainer>
    <StyledSkeleton variant="rect" height={48} />
    <SkeletonTextContainer>
      <StyledSkeletonText variant="text" width={"60%"} />
      <StyledSkeletonText variant="text" width={"30%"} />
    </SkeletonTextContainer>
  </ListItemContainer>
);

const StyledSkeleton = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
  `}
`;

const StyledSkeletonText = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    /* background-color: ${theme.palette.background.secondary}; */
    margin: 4px 0;
  `}
`;

const SkeletonTextContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 8px;
  width: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledListItem = styled(ListItem)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary} !important;
    color: ${theme.palette.text.primary};
    cursor: pointer;
    -webkit-user-select: none;
    & svg {
      fill: ${theme.palette.button.primary};
    }
    &:hover {
      background-color: ${theme.palette.background.secondary};
      color: ${theme.palette.text.primary};
      opacity: 0.9;
    }
    &:active {
      background-color: ${theme.palette.background.secondary};
      color: ${theme.palette.text.primary};
      opacity: 0.9;
    }
  `}
`;

const StyledValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.button.primary};
    display: flex;
    align-items: center;
    gap: 8px;
    /* & svg {
      fill: ${theme.palette.button.primary};
    } */
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
