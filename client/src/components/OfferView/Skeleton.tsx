import { Skeleton } from "@material-ui/lab";
import styled, { DefaultTheme, css } from "styled-components";

const SkeletonContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: calc(100% - 32px);
  `}
`;

const SkeletonHeader = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    border-radius: 12px 12px 0 0;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  `}
`;

const SkeletonBody = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    border-radius: 0 0 12px 12px;
    padding: 16px;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    gap: 8px;
  `}
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const SkeletonLabel = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    && {
      background-color: ${theme.palette.background.paper};
      width: 100px; /* Здесь можно указать ширину скелетона */
    }
  `}
`;

const SkeletonValue = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    && {
      background-color: ${theme.palette.background.paper};
      flex: 1; /* Растянуть скелетон на всю доступную ширину */
    }
  `}
`;

export const OfferViewSkeleton = () => {
  return (
    <SkeletonContainer>
      <SkeletonHeader>
        <SkeletonValue variant="text" />
        <SkeletonLabel variant="text" />
      </SkeletonHeader>
      <SkeletonBody>
        <SkeletonRow>
          <SkeletonLabel variant="text" />
          <SkeletonValue variant="text" />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonLabel variant="text" />
          <SkeletonValue variant="text" />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonLabel variant="text" />
          <SkeletonValue variant="text" />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonLabel variant="text" />
          <SkeletonValue variant="text" />
        </SkeletonRow>
      </SkeletonBody>
    </SkeletonContainer>
  );
};
