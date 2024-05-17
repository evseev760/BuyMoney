import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { PriceInputSkeleton } from "../FlexPriceInput/PriceInputSkeleton";
import {
  Container,
  StiledCurrencyInput,
  StyledSuffix,
  SwapButton,
  Title,
} from "../Styles";

interface FlexPriceProps {
  onChange: (value: number) => void;
  value?: number;
  firstCurrency: string;
  secondCurrency: string;
  isValid: boolean;
  isReversePrice: boolean;
  setIsReversePrice: () => void;
  isLoading?: boolean;
}
export const FixPriceInput = (props: FlexPriceProps) => {
  const {
    onChange,
    value,
    firstCurrency,
    secondCurrency,
    isValid,
    isReversePrice,
    setIsReversePrice,
    isLoading,
  } = props;

  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };

  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>Фиксированная цена</Title>
      <StiledCurrencyInput
        placeholder={`${isReversePrice ? "Отдам" : "Получу"} за 1 ${
          isReversePrice ? secondCurrency : firstCurrency
        } `}
        defaultValue={value}
        decimalsLimit={10}
        onValueChange={handleChange}
        isValid={isValid}
      />

      <StyledSuffix isValid={isValid}>
        {isReversePrice ? firstCurrency : secondCurrency}
        <SwapButton onClick={setIsReversePrice}>
          <SwapHorizIcon />
        </SwapButton>
      </StyledSuffix>
    </Container>
  );
};
