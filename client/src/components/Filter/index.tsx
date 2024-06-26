import { DrawerComponent } from "components/Drawer";
import { FilterItem, FilterItemProps } from "components/FilterItem";
import { CurrencySelect } from "components/selectCurrency";
import { useCurrencies } from "hooks/useCurrencies";
import { useFilter } from "hooks/useFilter";
import { Currency } from "models/Currency";
import { Quantity } from "components/Quantity";
import { useEffect, useState } from "react";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import styled, { css, DefaultTheme } from "styled-components";
import { Input, Tabs } from "@material-ui/core";
import Price from "components/Price";
import { ArrayConfirmButton } from "components/ArrayConfirmButton";
import { LocationComponent } from "components/Location";
import { useTranslation } from "react-i18next";
import CurrencyInput from "react-currency-input-field";

type Draver = "currency" | "forPayment" | "paymentMethods" | undefined;
interface Drawers {
  currency: JSX.Element;
  forPayment: JSX.Element;
  paymentMethods: JSX.Element;
}
interface FilterProps {
  drawerCallback: (value: boolean) => void;
  isOpenDrawer: boolean;
}
export const Filter = ({ drawerCallback, isOpenDrawer }: FilterProps) => {
  const {
    forPaymentArr,
    currencies,
    currenciesIsloading,
    getPrice,
    cripto,
    getLabel,
  } = useCurrencies();
  const {
    currency,
    forPayment,
    paymentMethods,
    sum,
    distance,
    setCurrency,
    setForPayment,
    setPaymentMethods,
    setSum,
    setDistance,
  } = useFilter();
  const { t } = useTranslation();

  const [currentDrawer, setCurrentDrawer] = useState<Draver>();
  useEffect(() => {
    drawerCallback(!!currentDrawer);
  }, [currentDrawer]);
  useEffect(() => {
    if (!isOpenDrawer) {
      setCurrentDrawer(undefined);
    }
  }, [isOpenDrawer]);
  useEffect(() => {
    if (currency && forPayment && cripto.data.length) {
      getPrice(currency, forPayment);
    }
  }, [currency, forPayment, cripto]);
  const filterList: FilterItemProps[] = [
    {
      items: currencies.data,
      currentValue: getLabel(currency),
      onSelect: () => changeDrawer("currency"),
      label: t("currency"),
    },
    {
      items: forPaymentArr,
      currentValue: getLabel(forPayment),
      onSelect: () => changeDrawer("forPayment"),
      label: t("toPay"),
    },
    {
      items:
        forPaymentArr.find((item) => item.code === forPayment)
          ?.paymentMethodsList || [],
      currentValue: !!paymentMethods?.length && (
        <FlexContainer>
          <ChecklistRtlIcon />
          <span>{paymentMethods?.length}</span>
        </FlexContainer>
      ),
      placeholder: t("all"),
      onSelect: () => changeDrawer("paymentMethods"),
      label: t("payment"),
    },
    {
      items: [],
      currentValue: (
        <StiledCurrencyInput
          value={sum}
          onValueChange={(value: any, name: any, values: any) =>
            setSum(values.float)
          }
          placeholder={`00.0 ${getLabel(currency)}`}
          size={90}
          maxLength={9}
        />
      ),
      onSelect: () => {},
      label: t("sum"),
      placeholder: `00.0 ${getLabel(currency)}`,
    },
    {
      items: [],
      currentValue: (
        <StiledCurrencyInput
          value={distance / 1000}
          onValueChange={(value: any, name: any, values: any) =>
            setDistance(values.float)
          }
          size={55}
          maxLength={5}
        />
      ),
      onSelect: () => {},
      label: t("distanceReduced"),
      placeholder: "1",
    },
  ];
  const closeDrawer = () => changeDrawer(undefined);
  const changeDrawer = (value: Draver) => {
    setCurrentDrawer(value);
  };
  const onPaymentMethodChange = (value: string) => {
    const getMethods = () => {
      if (paymentMethods) {
        return paymentMethods.includes(value)
          ? paymentMethods?.filter((item) => item !== value)
          : [...paymentMethods, value];
      } else {
        return [value];
      }
    };
    setPaymentMethods(getMethods());
  };
  const onSetCurrency = (value: string) => {
    setCurrency(value);
    closeDrawer();
  };
  const onSetForPayment = (value: string) => {
    if (value !== forPayment) setPaymentMethods([]);
    setForPayment(value);
    closeDrawer();
  };

  const drawers: Drawers = {
    currency: (
      <CurrencySelect
        handleSelect={onSetCurrency}
        currentValue={currency}
        array={currencies.data}
      />
    ),
    forPayment: (
      <CurrencySelect
        handleSelect={onSetForPayment}
        currentValue={forPayment}
        array={forPaymentArr}
      />
    ),
    paymentMethods: (
      <CurrencySelect
        handleSelect={onPaymentMethodChange}
        currentValue={paymentMethods?.length ? paymentMethods : ""}
        array={
          forPaymentArr.find((item: Currency) => item.code === forPayment)
            ?.paymentMethodsList || []
        }
        handleClose={closeDrawer}
      />
    ),
  };

  return (
    <>
      <StyledTabs
        orientation="horizontal"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Container>
          {filterList.map((item) => (
            <FilterItem {...item} isLoading={currenciesIsloading} />
          ))}
        </Container>
      </StyledTabs>
      <LocationComponent />
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => changeDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
    </>
  );
};
const StyledTabs = styled(Tabs)`
  & > .MuiTabs-scroller {
    overflow-y: hidden;
  }
`;
const Container = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  /* margin-bottom: 16px; */
`;
const FlexContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const StiledCurrencyInput = styled(CurrencyInput)<{ size: number }>`
  ${({ theme, size }: { theme: DefaultTheme; size: number }) => css`
    ::placeholder {
      color: ${theme.palette.text.secondary};
      opacity: 1;
    }
    color: ${size ? theme.palette.button.primary : "red"};
    font-size: 16px;
    max-width: ${size}px;
    background-color: ${theme.palette.button.secondary};
    height: 20px;
    padding: 0;
    outline: none;
    border: none;
  `}
`;
