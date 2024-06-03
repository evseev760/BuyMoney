const envName = "production";
// const envName = "development";
export const API_URL =
  process.env.NODE_ENV === envName
    ? `https://pocketmoneytg.ru/`
    : `https://89b6-113-189-19-53.ngrok-free.app/`;
export const WS_URL =
  process.env.NODE_ENV === envName
    ? `wss://pocketmoneytg.ru/`
    : `wss://89b6-113-189-19-53.ngrok-free.app/`;
