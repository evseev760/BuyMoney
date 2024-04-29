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
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
  useTonConnectModal,
} from "@tonconnect/ui-react";
import { checkProof, generatePayload } from "store/reducers/ActionCreators";
import { useAppDispatch } from "hooks/redux";
import { TonProof } from "models/Verify";

interface BackendTokenContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const BackendTokenContext = createContext<BackendTokenContextType | undefined>(
  undefined
);
const payloadTTLMS = 1000 * 200; //* 60;

export const useBackendToken = () => {
  const context = useContext(BackendTokenContext);
  if (!context) {
    throw new Error(
      "useBackendToken must be used within a BackendTokenProvider"
    );
  }
  return context;
};

const BackendTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();
  const dispatch = useAppDispatch();
  const { open } = useTonConnectModal();
  const localStorageKey = "tonConnect-auth-token";
  useEffect(() => {
    open();
    tonConnectUI.onStatusChange((wallet) => {
      console.log(999999, wallet);

      // if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
      //     checkProofInYourBackend(wallet.connectItems.tonProof.proof, wallet.account);
      // }
    });
  }, []);

  useEffect(() => {
    if (!isConnectionRestored || !setToken) {
      return;
    }

    clearInterval(interval.current);

    const refreshPayload = async () => {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });

      const value = await dispatch(generatePayload()); // Используем новую функцию генерации payload
      if (!value) {
        tonConnectUI.setConnectRequestParameters(null);
      } else {
        tonConnectUI.setConnectRequestParameters({ state: "ready", value });
        console.log(555, value, wallet);
      }
    };
    // refreshPayload();

    if (!wallet) {
      console.log("!!!!!!!!!!");
      localStorage.removeItem(localStorageKey);
      setToken(null);

      refreshPayload();
      interval.current = setInterval(refreshPayload, payloadTTLMS);
      return;
    }

    const token = localStorage.getItem(localStorageKey);
    console.log(1111, wallet && { ...wallet }, token);
    if (token) {
      setToken(token);
      return;
    }
    console.log(
      6666,
      wallet.connectItems?.tonProof &&
        !("error" in wallet.connectItems.tonProof)
    );

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      const proof: TonProof = {
        timestamp: wallet.connectItems.tonProof.proof.timestamp.toString(), // Преобразуем timestamp в строку
        domain: wallet.connectItems.tonProof.proof.domain,
        payload: wallet.connectItems.tonProof.proof.payload,
        signature: wallet.connectItems.tonProof.proof.signature,
      };
      dispatch(checkProof(proof, wallet.account)).then((result) => {
        if (result) {
          setToken(result + "");
          localStorage.setItem(localStorageKey, result + "");
        } else {
          alert("Please try another wallet");
          tonConnectUI.disconnect();
        }
      });
    } else {
      alert("Please try another wallet");
      tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, setToken]);

  return (
    <BackendTokenContext.Provider value={{ token, setToken }}>
      {children}
    </BackendTokenContext.Provider>
  );
};

export default BackendTokenProvider;
