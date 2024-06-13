// const envName = "production";
const envName = "development";
export const API_URL =
  process.env.NODE_ENV === envName
    ? `https://pocketmoneytg.ru/`
    : `https://cca2-123-19-25-16.ngrok-free.app/`;
export const WS_URL =
  process.env.NODE_ENV === envName
    ? `wss://pocketmoneytg.ru/`
    : `wss://cca2-123-19-25-16.ngrok-free.app/`;
