export enum CryptoCurrency {
  USDT = "tether",
  TON = "the-open-network",
  BITCOIN = "bitcoin",
}

export enum FiatCurrency {
  USD = "usd",
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
