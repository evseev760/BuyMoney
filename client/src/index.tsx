import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setupStore } from "./store";
import WebApp from "@twa-dev/sdk";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ErrorBoundary from "ErrorBoundary";

const store = setupStore();
// store.dispatch(api.util.initialize());
WebApp.ready();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <TonConnectUIProvider
    manifestUrl={"https://pocketmoneytg.ru/tonconnect-manifest.json"}
    actionsConfiguration={{
      twaReturnUrl: "https://t.me/BuyMoneyBot",
    }}
  >
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </TonConnectUIProvider>
);
