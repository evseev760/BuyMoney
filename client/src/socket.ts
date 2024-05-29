import { WS_URL } from "config";
import { io } from "socket.io-client";

const socket = io(WS_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const joinUserRoom = (userId: string) => {
  socket.emit("joinUserRoom", userId);
};

export const leaveUserRoom = (userId: string) => {
  socket.emit("leaveUserRoom", userId);
};

export default socket;
