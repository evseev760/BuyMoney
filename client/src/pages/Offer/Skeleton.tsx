import Skeleton from "@material-ui/lab/Skeleton";
import styled, { css, DefaultTheme } from "styled-components";

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  ${({ theme }) => `
    color: ${theme.palette.text.primary};
    font-size: 20px;
  `}
`;

const StyledPriceInfo = styled.div`
  ${({ theme }) => `
    color: ${theme.palette.text.secondary};
    font-size: 20px;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
`;

const StyledSkeleton = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
  `}
`;

const StyledSkeletonText = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    margin: 4px 0;
  `}
`;

const SkeletonTextContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 8px;
  width: 100%;
`;

const ListItemSkeleton = ({ width }: { width: string }) => (
  <ListItemContainer>
    <StyledSkeleton variant="rect" height={48} />
    <SkeletonTextContainer>
      {/* <StyledSkeletonText variant="text" width={getRandomWidth()} /> */}
      <StyledSkeletonText variant="text" width={width} />
    </SkeletonTextContainer>
  </ListItemContainer>
);

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

const SkeletonOffer = () => {
  return (
    <SkeletonContainer>
      <Header>
        <StyledSkeleton width={40} height={40} />
        <Title>
          <StyledSkeleton variant="text" width={200} />
        </Title>
      </Header>
      <Container>
        <StyledSkeleton variant="rect" height={96} />
      </Container>
      <StyledPriceInfo>
        <StyledSkeleton variant="text" width={300} height={25} />
      </StyledPriceInfo>
      <Container>
        <ListItemSkeleton width={"50%"} />
        <ListItemSkeleton width={"30%"} />
        <ListItemSkeleton width={"60%"} />
      </Container>
    </SkeletonContainer>
  );
};

export default SkeletonOffer;
