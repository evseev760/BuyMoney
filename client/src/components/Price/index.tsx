import React from "react";
import styled, { DefaultTheme, css } from "styled-components";

const Price = ({ value }: { value: number }) => {
  // Функция для форматирования числа как цены
  const formatPrice = (price: number) => {
    var value = new Intl.NumberFormat("ru-RU").format(price);
    if (value === "0") {
      value = new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 10,
      }).format(price);
    }
    return value;
  };

  return <StyledBlock>{formatPrice(value)}</StyledBlock>;
};
const StyledBlock = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
  `}
`;
export default Price;
