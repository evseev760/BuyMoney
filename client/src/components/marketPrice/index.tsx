import { Skeleton } from "@material-ui/lab";
import Price from "components/Price";
import styled, { DefaultTheme, css } from "styled-components";

interface MarketPriceProps {
  first: string;
  second: string;
  price: number;
  isLoading?: boolean;
  isReversePrice: boolean;
}

export const MarketPrice = (props: MarketPriceProps) => {
  const { first, second, price, isLoading, isReversePrice } = props;
  console.log(7777, price, 1 / price);
  return !isLoading ? (
    <StyledBlock>
      {`Рыночная цена:   `}
      {!isReversePrice ? (
        <>
          {`за 1 ${second} `}
          <Price value={1 / price} />
          {` ${first}`}
        </>
      ) : (
        <>
          {`за 1 ${first} `}
          <Price value={price} />
          {` ${second}`}
        </>
      )}
    </StyledBlock>
  ) : (
    <Skeleton height={32} />
  );
};
const StyledBlock = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    padding: 8px;
  `}
`;
