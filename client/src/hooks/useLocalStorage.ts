export enum LocalStorageKey {
  newOfferCurrency = "newOfferCurrency",
  newOfferForPayment = "newOfferForPayment",
  filterCurrency = "filterCurrency",
  filterForPayment = "filterForPayment",
  walletToken = "walletToken",
}
export const useLocalStorage = () => {
  const setLocalValue = (key: LocalStorageKey, value: string) => {
    localStorage.setItem(key, value);
  };
  const getLocalValue = (key: LocalStorageKey) => {
    return localStorage.getItem(key);
  };

  return { setLocalValue, getLocalValue, LocalStorageKey };
};
