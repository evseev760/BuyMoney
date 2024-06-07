import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "models/User";

export interface Application {
  quantity: number;
  currency: string;
  forPayment: string;
  paymentMethod?: string;
  price: number;
  offerId: string;
  seller: string;
  status: "NEW" | "PENDING" | "CONFIRMATION" | "COMPLETED";
  _id: string;
  updatedAt: string;
  isExcludedFromRating: boolean;
  rating: {
    buyer?: number;
    seller?: number;
  };
  shouldDelite?: boolean;
  partnerData?: User;
}
export interface CreateApplicationRequest {
  quantity: number;
  currency: string;
  forPayment: string;
  paymentMethod?: string;
  price: number;
  offerId: string;
  seller: string;
  distance?: number;
}
interface UserRatings {
  average: number;
  count: number;
}

export interface ReviewDetails {
  grade: number;
  comment: string;
  nickname: string;
  avatar: string;
  ratings: UserRatings;
  updatedAt: number;
}
export interface ApplicationState {
  application: CreateApplicationRequest;
  isLoading: boolean;
  reviewsIsLoading: boolean;
  error: string;
  reviews: ReviewDetails[];
  myReviews: ReviewDetails[];
  myApplications: Application[];
  myApplicationsIsloading: boolean;
  completeApplicationIsLoading: string[];
  deliteApplicationIsLoading: string[];
}

const emptyApplication = {
  quantity: 0,
  currency: "",
  forPayment: "",
  paymentMethod: "",
  price: 0,
  offerId: "",
  seller: "",
};
const initialState: ApplicationState = {
  application: emptyApplication,
  isLoading: false,
  reviewsIsLoading: false,
  error: "",
  myApplications: [],
  reviews: [],
  myReviews: [],
  myApplicationsIsloading: false,
  completeApplicationIsLoading: [],
  deliteApplicationIsLoading: [],
};

const statusSort = {
  NEW: 1,
  PENDING: 2,
  CONFIRMATION: 3,
  COMPLETED: 4,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    editApplication: (
      state,
      action: PayloadAction<CreateApplicationRequest>
    ) => {
      state.application = action.payload;
    },

    createApplicationFetching: (state) => {
      state.isLoading = true;
    },
    createApplicationSuccess: (state, action: PayloadAction<Application>) => {
      state.isLoading = false;
      state.application = emptyApplication;
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

    getCommentsByUserIdFetching: (state) => {
      state.reviewsIsLoading = true;
    },
    getCommentsByUserIdSuccess: (
      state,
      action: PayloadAction<ReviewDetails[]>
    ) => {
      state.reviewsIsLoading = false;
      state.reviews = action.payload;
    },
    getMyCommentsSuccess: (state, action: PayloadAction<ReviewDetails[]>) => {
      state.reviewsIsLoading = false;
      state.myReviews = action.payload;
    },
    getCommentsByUserIdError: (state, action: PayloadAction<string>) => {
      state.reviewsIsLoading = false;
      state.error = action.payload;
    },

    completeApplicationFetching: (state, action: PayloadAction<string>) => {
      state.completeApplicationIsLoading = [
        ...state.completeApplicationIsLoading,
        action.payload,
      ];
    },
    completeApplicationSuccess: (state, action: PayloadAction<string>) => {
      state.completeApplicationIsLoading =
        state.completeApplicationIsLoading?.filter(
          (id) => id !== action.payload
        );
    },
    completeApplicationError: (state, action: PayloadAction<string>) => {
      state.completeApplicationIsLoading =
        state.completeApplicationIsLoading?.filter(
          (id) => id !== action.payload
        );
    },

    deliteApplicationFetching: (state, action: PayloadAction<string>) => {
      state.deliteApplicationIsLoading = [
        ...state.deliteApplicationIsLoading,
        action.payload,
      ];
    },
    deliteApplicationSuccess: (state, action: PayloadAction<string>) => {
      state.deliteApplicationIsLoading =
        state.deliteApplicationIsLoading?.filter((id) => id !== action.payload);
      state.myApplications = state.myApplications?.filter(
        (item) => item._id !== action.payload
      );
    },
    deliteApplicationError: (state, action: PayloadAction<string>) => {
      state.deliteApplicationIsLoading =
        state.deliteApplicationIsLoading?.filter((id) => id !== action.payload);
      state.error = action.payload;
    },
    shouldDeliteApplication: (state, action: PayloadAction<string>) => {
      state.deliteApplicationIsLoading =
        state.deliteApplicationIsLoading?.filter((id) => id !== action.payload);
      state.myApplications = state.myApplications.map((item) =>
        item._id === action.payload ? { ...item, shouldDelite: true } : item
      );
    },

    addNewApplication: (state, action: PayloadAction<Application>) => {
      const index = state.myApplications.findIndex(
        (app) => app._id === action.payload._id
      );

      if (index !== -1) {
        state.myApplications[index] = action.payload; // Обновить существующую заявку
      } else {
        state.myApplications = [...state.myApplications, action.payload].sort(
          (a, b) => statusSort[a.status] - statusSort[b.status]
        );
      }
    },
    updateApplicationStatus: (state, action: PayloadAction<Application>) => {
      const index = state.myApplications.findIndex(
        (app) => app._id === action.payload._id
      );

      if (index !== -1) {
        state.myApplications[index] = action.payload;
        state.myApplications.sort(
          (a, b) => statusSort[a.status] - statusSort[b.status]
        );
      }
    },
  },
});

export default applicationSlice.reducer;
