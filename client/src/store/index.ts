import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/AuthSlice";
import offerReducer from "./reducers/offer/OfferSlice";
import verifyReducer from "./reducers/verification/VerificationSlice";
import currencyReducer from "./reducers/currency/CurrencySlice";
import filterReducer from "./reducers/filter/FilterSlice";
import applicationReducer from "./reducers/application/ApplicationSlice";

const rootReducer = combineReducers({
  authReducer,
  offerReducer,
  verifyReducer,
  currencyReducer,
  filterReducer,
  applicationReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
