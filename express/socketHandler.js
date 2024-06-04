const { Server } = require("socket.io");
const { applicationWithPartner } = require("./utils/applicationWithPartner");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // или укажите конкретные домены
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("joinUserRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on("leaveUserRoom", (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left their personal room`);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

const sendApplicationStatusUpdate = async (application) => {
  const applicationWithSellerData = await applicationWithPartner(
    application,
    application.user
  );
  const applicationWithBuyerData = await applicationWithPartner(
    application,
    application.seller
  );
  if (io) {
    io.to(application.user).emit(
      "applicationStatusUpdate",
      applicationWithSellerData
    );
    io.to(application.seller).emit(
      "applicationStatusUpdate",
      applicationWithBuyerData
    );
  }
};

const sendUserUpdate = async (user) => {
  if (io) {
    io.to(user.id).emit("userDataWathUpdated", user);
  }
};

const sendDeliteApplication = (application, applicationId) => {
  if (io) {
    io.to(application.user).emit("deliteApplication", applicationId);
    io.to(application.seller).emit("deliteApplication", applicationId);
  }
};

const notifyNewApplication = async (application) => {
  const applicationWithSellerData = await applicationWithPartner(
    application,
    application.user
  );
  const applicationWithBuyerData = await applicationWithPartner(
    application,
    application.seller
  );
  if (io) {
    io.to(application.seller).emit("newApplication", applicationWithBuyerData);
    io.to(application.user).emit("newApplication", applicationWithSellerData);
  }
};

module.exports = {
  initializeSocket,
  sendApplicationStatusUpdate,
  notifyNewApplication,
  sendDeliteApplication,
  sendUserUpdate,
};
