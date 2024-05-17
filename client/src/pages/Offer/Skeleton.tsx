import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import styled from "styled-components";

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

const SkeletonOffer = () => {
  return (
    <SkeletonContainer>
      <Header>
        <Skeleton width={40} height={40} />
        <Title>
          <Skeleton variant="text" width={200} />
        </Title>
      </Header>
      <Skeleton variant="rect" height={150} />
      <StyledPriceInfo>
        <Skeleton variant="text" width={300} />
      </StyledPriceInfo>
      <Skeleton variant="rect" height={100} />
    </SkeletonContainer>
  );
};

export default SkeletonOffer;
