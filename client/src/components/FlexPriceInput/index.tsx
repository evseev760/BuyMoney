import { useTranslation } from "react-i18next";
import { PriceInputSkeleton } from "./PriceInputSkeleton";
import {
  Container,
  StiledCurrencyInput,
  Title,
} from "components/Styles/Styles";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@material-ui/core";

interface FlexPriceProps {
  onChange: (value: number) => void;
  value?: number;
  isValid: boolean;
  isLoading?: boolean;
}
export const FlexPriceInput = (props: FlexPriceProps) => {
  const { onChange, value, isValid, isLoading } = props;
  const { t } = useTranslation();
  const [tooltipText, setTooltipText] = useState("");
  const timeoutIdRef = useRef<any>(null);
  const handleChange = (value: any, name: any, values: any) => {
    onChange(values.float);
  };
  useEffect(() => {
    if (!isValid) {
      timeoutIdRef.current = setTimeout(() => {
        setTooltipText(t("priceTooltipText"));
      }, 2000);
    } else {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      setTooltipText("");
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isValid]);
  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>{t("percentageOfMarketPrice")}</Title>{" "}
      <Tooltip
        open={!!tooltipText}
        title={tooltipText}
        arrow
        placement="top-start"
      >
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
      </Tooltip>
      <span></span>
    </Container>
  );
};
