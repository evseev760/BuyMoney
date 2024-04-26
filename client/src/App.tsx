import React, { useEffect, useState } from "react";
import { Router } from "./router";
import "./App.css";
import { fetchAuth, fetchLogin } from "./store/reducers/ActionCreators";
import { useAppDispatch } from "./hooks/redux";
import { useTg } from "./hooks/useTg";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./theme";
import { darkTheme } from "theme/darkTheme";
import { Theme } from "models/Theme";
import { Token } from "@mui/icons-material";

function App() {
  const dispatch = useAppDispatch();
  const { tg } = useTg();
  const isDark = tg.colorScheme === "dark";
  //@ts-ignore
  console.log(8888, tg, window.Telegram);
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const latitude = position.coords.latitude;
  //       const longitude = position.coords.longitude;
  //       console.log("Широта:", latitude);
  //       console.log("Долгота:", longitude);

  //       // Далее вы можете использовать полученные координаты
  //     },
  //     (error) => {
  //       console.error("Ошибка при получении местоположения:", error);
  //     }
  //   );
  // } else {
  //   console.error("Geolocation не поддерживается этим браузером.");
  // }
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
    <div style={{ backgroundColor: bgColor }} className="App">
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </div>
  );
}

export default App;
