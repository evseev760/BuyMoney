export enum CryptoCurrency {
  USDT = "tether",
  TON = "toncoin",
  BITCOIN = "bitcoin",
}

export interface Price {
  [crypto: string]: {
    [fiat: string]: number;
  };
}

export enum FiatCurrency {
  USD = "USD",
  EUR = "eur",
  RUB = "rub",
  GBP = "gbp",
  JPY = "jpy",
  CNY = "cny",
  AUD = "aud",
  CAD = "cad",
  CHF = "chf",
  VND = "vnd",
  THB = "thb",
  CYP = "cyp",
  AED = "aed",
}

export interface SelectItem {
  code: string;
  label: string;
}

export const fiatCurrenciesArray: SelectItem[] = Object.entries(
  FiatCurrency
).map(([label, code]) => ({ code, label: label.toUpperCase() }));
export const criptoCurrenciesArray: SelectItem[] = Object.entries(
  CryptoCurrency
).map(([label, code]) => ({ code, label: label.toUpperCase() }));

export const getLabel = (arr: SelectItem[], value?: string) => {
  return arr.find((item) => item.code === value)?.label || "";
};
