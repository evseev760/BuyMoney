import { useEffect } from "react";
import { useAppSelector } from "./redux";
import socket, { joinUserRoom, leaveUserRoom } from "socket";

export const useConnectUserRoom = () => {
  const { currentUser } = useAppSelector((state) => state.authReducer);

  useEffect(() => {
    if (currentUser) {
      const handleConnect = () => {
        joinUserRoom(currentUser.id);
      };

      const handleDisconnect = () => {
        leaveUserRoom(currentUser.id);
      };

      // Initial join
      if (socket.connected) {
        joinUserRoom(currentUser.id);
      }

      // Listen for socket events
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      // Clean up
      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        if (socket.connected) {
          leaveUserRoom(currentUser.id);
        }
      };
    }
  }, [currentUser]);
};
