import { AppDispatch } from "store";
import axios from "axios";
import { api, auth } from "store/api";

import { verifySlice } from "./VerificationSlice";

import { API_URL } from "config";

import { TonProof } from "models/Verify";
import { Account, ConnectAdditionalRequest } from "@tonconnect/ui-react";

export const generatePayload = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(verifySlice.actions.verifyFetching());

    const response = await axios.post(
      `${API_URL}${api.verify.generatePayload}`
    );

    dispatch(verifySlice.actions.verifySuccess(response.data));
    return response.data as ConnectAdditionalRequest;
  } catch (error: any) {
    dispatch(
      verifySlice.actions.verifyError(
        error.response?.data?.message || "Unknown error"
      )
    );
  }
};

export const checkProof =
  (proof: TonProof, account: Account) => async (dispatch: AppDispatch) => {
    try {
      dispatch(verifySlice.actions.verifyFetching());

      const response = await axios.post(`${API_URL}${api.verify.checkProof}`, {
        proof,
        account,
      });

      dispatch(verifySlice.actions.verifySuccess(response.data));
      return response.data.token as string;
    } catch (error: any) {
      dispatch(
        verifySlice.actions.verifyError(
          error.response?.data?.message || "Unknown error"
        )
      );
    }
  };

export const authWallet =
  (account: Account) => async (dispatch: AppDispatch) => {
    try {
      dispatch(verifySlice.actions.authWalletFetching());

      const response = await axios.post(
        `${API_URL}${api.verify.authWallet}`,
        {
          account,
        },
        auth()
      );

      dispatch(verifySlice.actions.authWalletSuccess(response.data));
      return response.data.token as string;
    } catch (error: any) {
      dispatch(
        verifySlice.actions.authWalletError(
          error.response?.data?.message || "Unknown error"
        )
      );
    }
  };
