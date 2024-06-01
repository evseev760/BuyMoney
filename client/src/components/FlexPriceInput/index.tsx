import { useTranslation } from "react-i18next";
import { PriceInputSkeleton } from "./PriceInputSkeleton";
import {
  Container,
  StiledCurrencyInput,
  Title,
} from "components/Styles/Styles";

interface FlexPriceProps {
  onChange: (value: number) => void;
  value?: number;
  isValid: boolean;
  isLoading?: boolean;
}
export const FlexPriceInput = (props: FlexPriceProps) => {
  const { onChange, value, isValid, isLoading } = props;
  const { t } = useTranslation();
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>{t("percentageOfMarketPrice")}</Title>
      <StiledCurrencyInput
        id="input-example"
        name="input-name"
        placeholder={`70 ~ 150 % `}
        defaultValue={value}
        decimalsLimit={2}
        maxLength={5}
        onValueChange={handleChange}
        suffix={"  %"}
        isValid={isValid}
      />
    </Container>
  );
};
