import { ReviewDetails } from "store/reducers/application/ApplicationSlice";
import styled, { css, DefaultTheme } from "styled-components";
import { ReviewItem } from "./ReviewItem";

interface ReviewsProps {
  reviewArray: ReviewDetails[];
}
export const Reviews = (props: ReviewsProps) => {
  const { reviewArray } = props;
  return (
    <Container>
      {reviewArray.map((item) => (
        <ReviewItem {...item} />
      ))}
    </Container>
  );
};
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 18px;
  `}
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
