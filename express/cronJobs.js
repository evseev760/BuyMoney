const cron = require("node-cron");
const Application = require("./models/Application");
const updateUserRating = require("./utils/updateUserRating");

// const updateUserRating = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) return;

//   const userApplications = await Application.find({
//     $or: [{ user: userId }, { seller: userId }],
//     status: "COMPLETED",
//     isExcludedFromRating: false,
//   });

//   const totalRating = userApplications.reduce((sum, app) => {
//     if (app.user === userId) {
//       return sum + (app.rating.seller || 0);
//     } else {
//       return sum + (app.rating.buyer || 0);
//     }
//   }, 0);

//   const ratingCount = userApplications.length;

//   user.ratings.average = ratingCount ? totalRating / ratingCount : 0;
//   user.ratings.count = ratingCount;

//   await user.save();
// };

// Задача, выполняемая каждые 10 минут
cron.schedule("*/10 * * * *", async () => {
  try {
    const now = Date.now();
    const applications = await Application.find({
      status: "CONFIRMATION",
      updatedAt: { $lt: now - 24 * 3600 * 1000 },
    });

    for (const application of applications) {
      application.status = "COMPLETED";

      const buyerRating = application.rating.buyer || 5;
      const sellerRating = application.rating.seller || 5;

      // Обновляем рейтинг только если заявка не исключена
      if (!application.isExcludedFromRating) {
        await updateUserRating(application.user, buyerRating);
        await updateUserRating(application.seller, sellerRating);
      }

      await application.save();
    }

    console.log("Заявки со статусом CONFIRMATION проверены и обновлены.");
  } catch (e) {
    console.error("Ошибка при обновлении заявок:", e);
  }
});
