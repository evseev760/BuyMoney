// export const API_URL = `https://pocketmoneytg.ru/`;
// export const WS_URL = `wss://pocketmoneytg.ru:3002/`;

// export const API_URL = `http://localhost:443/`;
// export const WS_URL = `http://localhost:3002/`;

export const API_URL =
  process.env.NODE_ENV === "production"
    ? `https://pocketmoneytg.ru/`
    : `https://af39-123-19-31-114.ngrok-free.app/`;
export const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://pocketmoneytg.ru/`
    : `wss://af39-123-19-31-114.ngrok-free.app/`;

// export const API_URL = `https://pocketmoneytg.ru/`;
// export const WS_URL = `wss://pocketmoneytg.ru/`;
