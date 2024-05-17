// theme.js
import WebApp from "@twa-dev/sdk";

export const lightTheme = {
  palette: {
    primary: {
      main: "#50A7EA",
    },
    secondary: {
      main: "#bbbbbd",
    },

    background: {
      primary: "#F0F0F0",
      secondary: "#FFFFFF",
    },
    text: {
      primary: "#222222",
      secondary: "#81848B",
    },
    button: {
      //@ts-ignore
      primary: WebApp.themeParams.button_color,
      secondary: "#E2E2E2",
    },
  },
};

export const darkTheme = {
  palette: {
    primary: {
      main: "#50A7EA",
    },
    secondary: {
      main: "#bbbbbd",
    },

    background: {
      primary: "#151E27",
      // primary: WebApp.themeParams.header_bg_color,
      secondary: "#1D2733",
      // secondary: WebApp.themeParams.bg_color,
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#7A8790",
    },
    button: {
      primary: WebApp.themeParams.button_color,
      secondary: "#2D343C",
    },
  },
};
