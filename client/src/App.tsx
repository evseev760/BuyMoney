import React, { useEffect, useState } from "react";
import { Router } from "./router";
import "./App.css";
import { fetchAuth, fetchLogin } from "./store/reducers/auth/ActionCreators";
import { useAppDispatch } from "./hooks/redux";
import { useTg } from "./hooks/useTg";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
// import { darkTheme } from "theme/darkTheme";
import { Theme } from "models/Theme";
import BackendTokenProvider from "TonConnectVerification";
import { useConnectUserRoom } from "hooks/useConnectUserRoom";
// import "./i18n";

function App() {
  const dispatch = useAppDispatch();
  useConnectUserRoom();
  const { tg } = useTg();
  const isDark = tg.colorScheme === "dark";
  const theme: Theme = isDark ? darkTheme : lightTheme;
  const bgColor = theme.palette.background.primary;
  useEffect(() => {
    const token = localStorage.getItem("token");
    !token && dispatch(fetchLogin(tg));
    token && dispatch(fetchAuth(tg));
    tg.setBackgroundColor(`#${bgColor.substring(1)}`);
    tg.setHeaderColor(`#${bgColor.substring(1)}`);
    document
      .querySelector("body")
      ?.setAttribute("style", "background-color: " + bgColor);
  }, []);

  return (
    <BackendTokenProvider>
      <div style={{ backgroundColor: bgColor }} className="App">
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </div>
    </BackendTokenProvider>
  );
}

export default App;
