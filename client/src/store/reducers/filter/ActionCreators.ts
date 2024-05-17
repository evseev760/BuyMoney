import { AppDispatch } from "store";
import { filterSlice } from "./FilterSlice";

export const editCurrency =
  (currency: string) => async (dispatch: AppDispatch) => {
    dispatch(filterSlice.actions.editCurrency(currency));
  };

export const editForPayment =
  (currency: string) => async (dispatch: AppDispatch) => {
    dispatch(filterSlice.actions.editForPayment(currency));
  };
export const editPaymentMethods =
  (currency?: string[]) => async (dispatch: AppDispatch) => {
    dispatch(filterSlice.actions.editPaymentMethods(currency));
  };
export const editSum = (currency?: number) => async (dispatch: AppDispatch) => {
  dispatch(filterSlice.actions.editSum(currency));
};
export const editDistance =
  (distance: number) => async (dispatch: AppDispatch) => {
    dispatch(filterSlice.actions.editDistance(distance));
  };
