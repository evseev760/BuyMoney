module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("addMessage", (data) => {
      io.emit("addMessage", data);
    });
    socket.on("offerCreated", (data) => {
      io.emit("offerCreated", data);
    });
  });
};
