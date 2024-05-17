import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Application {
  quantity: number;
  currency: string;
  forPayment: string;
  paymentMethod?: string;
  price: number;
  offerId: string;
  seller: string;
  status?: string;
}

export interface ApplicationState {
  application: Application;
  isLoading: boolean;
  error: string;
  myApplications: Application[];
  myApplicationsIsloading: boolean;
}

const initialState: ApplicationState = {
  application: {
    quantity: 0,
    currency: "",
    forPayment: "",
    paymentMethod: "",
    price: 0,
    offerId: "",
    seller: "",
  },
  isLoading: false,
  error: "",
  myApplications: [],
  myApplicationsIsloading: false,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    editApplication: (state, action: PayloadAction<Application>) => {
      state.application = action.payload;
    },

    createApplicationFetching: (state) => {
      state.isLoading = true;
    },
    createApplicationSuccess: (state, action: PayloadAction<Application>) => {
      state.isLoading = false;
      state.application = action.payload;
    },
    createApplicationError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getMyApplicationsFetching: (state) => {
      state.myApplicationsIsloading = true;
    },
    getMyApplicationsSuccess: (state, action: PayloadAction<Application[]>) => {
      state.myApplicationsIsloading = false;
      state.myApplications = action.payload;
    },
    getMyApplicationsError: (state, action: PayloadAction<string>) => {
      state.myApplicationsIsloading = false;
      state.error = action.payload;
    },
  },
});

export default applicationSlice.reducer;
