import numeral from "numeral";
import styled, { DefaultTheme, css, useTheme } from "styled-components";

const Price = ({ value }: { value: number }) => {
  const theme = useTheme();
  const fixNumber = (formattedValue: string) => {
    const parts = formattedValue.split(".");
    let integerPart = parts[0];
    let decimalPart = parts[1] || "";

    const significantDigitsBeforeDecimal = integerPart.replace(
      /^0+/,
      ""
    ).length;

    if (significantDigitsBeforeDecimal > 0) {
      decimalPart = decimalPart.slice(0, 2);
    } else {
      const firstSignificantDigitIndex = decimalPart.search(/[1-9]/);
      if (firstSignificantDigitIndex !== -1) {
        decimalPart = decimalPart.slice(0, firstSignificantDigitIndex + 4);
      } else {
        decimalPart = "";
      }
    }

    decimalPart = decimalPart.replace(/0+$/, "");

    const result = integerPart + (decimalPart ? `.${decimalPart}` : "");
    return result;
  };
  return (
    <StyledBlock>
      {fixNumber(numeral(value).format("0,0.0000000000"))}
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
