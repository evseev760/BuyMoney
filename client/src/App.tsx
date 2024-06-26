import React, { useEffect, useState } from "react";
import { Router } from "./router";
import "./App.css";
import { fetchAuth, fetchLogin } from "./store/reducers/auth/ActionCreators";
import { useAppDispatch } from "./hooks/redux";
import { useTg } from "./hooks/useTg";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import { Theme } from "models/Theme";
import BackendTokenProvider from "TonConnectVerification";
import { useConnectUserRoom } from "hooks/useConnectUserRoom";
import "./i18n";

function App() {
  const dispatch = useAppDispatch();
  useConnectUserRoom();
  const { tg } = useTg();
  const isDark = tg.colorScheme === "dark";
  const theme: Theme = isDark ? darkTheme : lightTheme;
  const bgColor = theme.palette.background.primary;
  const [contentHeight, setContentHeight] = useState("100%");
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      if (newHeight < initialHeight) {
        setContentHeight(`${newHeight}px`);
      } else {
        setContentHeight("100%");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initialHeight]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (tg.initData) {
      !token && dispatch(fetchLogin(tg));
      token && dispatch(fetchAuth(tg));
      tg.setBackgroundColor(`#${bgColor.substring(1)}`);
      tg.setHeaderColor(`#${bgColor.substring(1)}`);
      document
        .querySelector("body")
        ?.setAttribute("style", "background-color: " + bgColor);

      const overflow = 1;
      document.body.style.overflowY = "hidden";
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = window.innerHeight + overflow + "px";
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);
    }
  }, [bgColor, tg]);

  return (
    <BackendTokenProvider>
      <div style={{ backgroundColor: bgColor }} className="App">
        {tg.initData ? (
          <ThemeProvider theme={theme}>
            <div className="container">
              <div className="content" style={{ height: contentHeight }}>
                <Router />
              </div>
            </div>
          </ThemeProvider>
        ) : (
          <div>Это приложение для Telegram</div>
        )}
      </div>
    </BackendTokenProvider>
  );
}

export default App;
