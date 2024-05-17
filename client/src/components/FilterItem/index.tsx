import { Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import styled, { css, DefaultTheme } from "styled-components";

export interface FilterItemProps {
  items: any[];
  currentValue?: any;
  onSelect: (value?: any) => void;
  label: string;
  placeholder?: string;
  isLoading?: boolean;
}
export const FilterItem = (props: FilterItemProps) => {
  const { currentValue, onSelect, label, placeholder, isLoading } = props;
  const handleSelect = () => {
    onSelect();
  };
  return isLoading ? (
    <StyledSkeleton />
  ) : (
    <StyledButton disableRipple onClick={handleSelect}>
      <Label>{label}</Label>
      {!!currentValue && <Value>{currentValue}</Value>}
      {!currentValue && <Placeholder>{placeholder}</Placeholder>}
    </StyledButton>
  );
};
const StyledButton = styled(Button)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    cursor: pointer !important;
    background-color: ${theme.palette.button.secondary};
    flex-grow: 1;
    height: 48px;
    border-radius: 8px;
    & > span {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: start;
      justify-content: space-between;
    }
    & svg {
      fill: ${theme.palette.button.primary};
    }
    & span {
      color: ${theme.palette.button.primary};
    }

    &:hover {
      background-color: ${theme.palette.button.secondary};
      /* color: ${theme.palette.text.primary}; */
      opacity: 0.9;
    }
    /* &:active {
      background-color: ${theme.palette.button.primary};
    } */
  `}
`;

const Label = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 10px;
    white-space: nowrap;
  `}
`;
const Value = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 16px;
    white-space: nowrap;
    color: ${theme.palette.button.primary};
  `}
`;
const Placeholder = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 16px;
    white-space: nowrap;
    color: ${theme.palette.text.secondary};
  `}
`;
const StyledSkeleton = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    flex-grow: 1;
    height: 48px;
    border-radius: 8px;
    min-width: 64px;
  `}
`;
