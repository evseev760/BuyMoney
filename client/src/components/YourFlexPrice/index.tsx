import { Skeleton } from "@material-ui/lab";
import Price from "components/Price";
import { useTranslation } from "react-i18next";
import styled, { DefaultTheme, css } from "styled-components";

interface MarketPriceProps {
  first: string;
  second: string;
  price: number;
  isLoading?: boolean;
  isReversePrice?: boolean;
}

export const YourFlexPrice = (props: MarketPriceProps) => {
  const { t } = useTranslation();
  const { first, second, price, isLoading, isReversePrice } = props;
  return !isLoading ? (
    <StyledBlock>
      {`${t("yourPrice")}: `}
      {isReversePrice ? (
        <>
          {`${t("for1")} ${second} `}
          <Price value={1 / price} />
          {` ${first}`}
        </>
      ) : (
        <>
          {`${t("for1")} ${first} `}
          (<Price value={price} />
          {` ${second}`})
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
