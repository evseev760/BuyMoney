import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { PriceInputSkeleton } from "../FlexPriceInput/PriceInputSkeleton";
import {
  Container,
  StiledCurrencyInput,
  StyledSuffix,
  SwapButton,
  Title,
} from "components/Styles/Styles";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@material-ui/core";

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
  const { t } = useTranslation();
  const [showInput, setShowInput] = useState(true);
  const [tooltipText, setTooltipText] = useState("");
  const timeoutIdRef = useRef<any>(null);
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
  useEffect(() => {
    if (!showInput) {
      const timer = setTimeout(() => {
        setShowInput(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showInput]);
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
  const handleSwap = () => {
    if (value && value !== 0) {
      const newValue = 1 / value;
      onChange(newValue);
      setShowInput(false);
    }
    setIsReversePrice();
  };
  return isLoading || !showInput ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>{t("fixPriceLabel")}</Title>
      <Tooltip
        open={!!tooltipText}
        title={tooltipText}
        arrow
        placement="top-start"
      >
        <StiledCurrencyInput
          placeholder={`${isReversePrice ? t("giveBack") : t("getIt")} ${t(
            "for1"
          )} ${isReversePrice ? secondCurrency : firstCurrency} `}
          defaultValue={value}
          decimalsLimit={10}
          onValueChange={handleChange}
          isValid={isValid}
        />
      </Tooltip>
      <StyledSuffix isValid={isValid}>
        <span>{isReversePrice ? firstCurrency : secondCurrency}</span>

        <SwapButton onClick={handleSwap}>
          <SwapHorizIcon />
        </SwapButton>
      </StyledSuffix>
    </Container>
  );
};
