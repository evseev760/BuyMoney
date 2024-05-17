import React from "react";
import { NumericFormat } from "react-number-format";
import styled, { DefaultTheme, css, useTheme } from "styled-components";

const Price = ({ value }: { value: number }) => {
  const theme = useTheme();
  return (
    <StyledBlock>
      {/* <SvgWrapper dangerouslySetInnerHTML={{ __html: img }} /> */}
      <NumericFormat
        value={value}
        decimalScale={value > 1 ? 2 : 10}
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalSeparator=","
        displayType="text"
        renderText={(val) => val}
      />
    </StyledBlock>
  );
};
const SvgWrapper = styled.span`
  display: inline-block;

  & > svg {
    width: 24px;
    height: 24px;
  }
`;
const StyledBlock = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
  `}
`;
export default Price;
