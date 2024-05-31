import { Skeleton } from "@material-ui/lab";
import styled, { DefaultTheme, css } from "styled-components";

const SkeletonContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 74px;
  `}
`;

const SkeletonTitle = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    && {
      width: 200px;
      height: 18px;
      border-radius: 8px;
      background-color: ${theme.palette.background.secondary};
    }
  `}
`;

const SkeletonInput = styled(Skeleton)<{ isValid: boolean }>`
  ${({ theme, isValid }: { theme: DefaultTheme; isValid: boolean }) => css`
    && {
      font-size: 16px;
      height: 48px;
      border-radius: 12px; /* Применяем border-radius к Input */
      width: 100%;
      background-color: ${theme.palette.background.secondary};
    }
  `}
`;

export const PriceInputSkeleton = () => {
  return (
    <SkeletonContainer>
      <SkeletonTitle variant="text" />
      <SkeletonInput variant="text" isValid={true} />
    </SkeletonContainer>
  );
};
