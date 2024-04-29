import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setupStore } from "./store";
import WebApp from "@twa-dev/sdk";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { API_URL } from "config";

const store = setupStore();
WebApp.ready();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <TonConnectUIProvider
    manifestUrl={"https://pocketmoneytg.ru/tonconnect-manifest.json"}
    actionsConfiguration={{
      twaReturnUrl: "https://t.me/pocket_money_bot",
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </TonConnectUIProvider>
);
