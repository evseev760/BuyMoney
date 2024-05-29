import numeral from "numeral";
// import { NumericFormat } from "react-number-format";
import styled, { DefaultTheme, css, useTheme } from "styled-components";

const Price = ({ value }: { value: number }) => {
  const theme = useTheme();
  const fixNumber = (formattedValue: string) => {
    const parts = formattedValue.split(".");
    let integerPart = parts[0];
    let decimalPart = parts[1] || "";

    // Проверяем, есть ли значащие цифры до запятой
    const significantDigitsBeforeDecimal = integerPart.replace(
      /^0+/,
      ""
    ).length;

    if (significantDigitsBeforeDecimal > 0) {
      // Оставляем две цифры после запятой
      decimalPart = decimalPart.slice(0, 2);
    } else {
      // Ищем первый значащий знак после запятой
      const firstSignificantDigitIndex = decimalPart.search(/[1-9]/);
      // Оставляем до 4 цифр после первого значащего знака
      if (firstSignificantDigitIndex !== -1) {
        decimalPart = decimalPart.slice(0, firstSignificantDigitIndex + 4);
      } else {
        decimalPart = ""; // Если после запятой только нули, удаляем их
      }
    }

    // Удаляем незначащие нули после запятой
    decimalPart = decimalPart.replace(/0+$/, "");

    // Собираем число обратно
    const result = integerPart + (decimalPart ? `.${decimalPart}` : "");
    return result;
  };
  return (
    <StyledBlock>
      {fixNumber(numeral(value).format("0,0.0000000000"))}
    </StyledBlock>
  );
  // return (
  //   <>
  //     <StyledBlock>
  //       {/* <SvgWrapper dangerouslySetInnerHTML={{ __html: img }} /> */}
  //       <NumericFormat
  //         value={value}
  //         decimalScale={value > 1 ? 2 : 10}
  //         thousandsGroupStyle="thousand"
  //         thousandSeparator=" "
  //         decimalSeparator=","
  //         displayType="text"
  //         renderText={(val) => val}
  //       />
  //     </StyledBlock>
  //   </>
  // );
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
