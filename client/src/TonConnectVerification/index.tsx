// import React, { useEffect } from "react";
// import { Account, useTonWallet } from "@tonconnect/ui-react";
// import { tonConnectVerification } from "store/reducers/ActionCreators";
// import { TonAccount } from "models/Verify";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Wallet,
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  checkProof,
  generatePayload,
  authWallet,
} from "store/reducers/verification/ActionCreators";
import { useAppDispatch } from "hooks/redux";
import { TonProof } from "models/Verify";
import { useTg } from "hooks/useTg";

interface BackendTokenContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  wallet: Wallet | null;
}

const BackendTokenContext = createContext<BackendTokenContextType | undefined>(
  undefined
);
const payloadTTLMS = 1000 * 200; //* 60;

export const useWalletData = () => {
  const context = useContext(BackendTokenContext);
  if (!context) {
    throw new Error("useWalletData must be used within a BackendTokenProvider");
  }
  return context;
};

const BackendTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();
  const dispatch = useAppDispatch();
  const { showAlert } = useTg();
  const localStorageKey = "walletToken";

  useEffect(() => {
    if (!isConnectionRestored || !setToken) {
      return;
    }

    clearInterval(interval.current);

    if (!wallet) {
      const refreshPayload = async () => {
        tonConnectUI.setConnectRequestParameters({ state: "loading" });

        const value = await dispatch(generatePayload());
        if (!value) {
          tonConnectUI.setConnectRequestParameters(null);
        } else {
          tonConnectUI.setConnectRequestParameters({ state: "ready", value });
        }
      };
      localStorage.removeItem(localStorageKey);
      setToken(null);

      refreshPayload();
      interval.current = setInterval(refreshPayload, payloadTTLMS);
      return;
    }

    const token = localStorage.getItem(localStorageKey);
    if (token) {
      dispatch(authWallet(wallet.account)).then((result) => {
        if (result) {
          setToken(result);
          localStorage.setItem(localStorageKey, result);
        } else {
          showAlert("Please try another wallet");
          tonConnectUI.disconnect();
        }
      });
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      const proof: TonProof = {
        timestamp: wallet.connectItems.tonProof.proof.timestamp.toString(),
        domain: wallet.connectItems.tonProof.proof.domain,
        payload: wallet.connectItems.tonProof.proof.payload,
        signature: wallet.connectItems.tonProof.proof.signature,
      };
      dispatch(checkProof(proof, wallet.account)).then((result) => {
        if (result) {
          setToken(result);
          localStorage.setItem(localStorageKey, result);
        } else {
          showAlert("Please try another wallet");
          tonConnectUI.disconnect();
        }
      });
    } else {
      showAlert("Please try another wallet");
      tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, setToken]);

  return (
    <BackendTokenContext.Provider value={{ token, setToken, wallet }}>
      {children}
    </BackendTokenContext.Provider>
  );
};

export default BackendTokenProvider;
