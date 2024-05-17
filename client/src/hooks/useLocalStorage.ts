export enum LocalStorageKey {
  newOfferCurrency = "newOfferCurrency",
  newOfferForPayment = "newOfferForPayment",
  filterCurrency = "filterCurrency",
  filterForPayment = "filterForPayment",
}
export const useLocalStorage = () => {
  const setLocalValue = (key: LocalStorageKey, value: string) => {
    localStorage.setItem(key, value);
  };
  const getLocalValue = (key: LocalStorageKey) => {
    localStorage.getItem(key);
  };

  return { setLocalValue, getLocalValue, LocalStorageKey };
};
