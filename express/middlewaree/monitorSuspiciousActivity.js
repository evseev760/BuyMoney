const config = require("config");
const Application = require("../models/Application");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const { id } = req.user;
    const { applicationId } = req.body;

    // Проверяем, завершает ли заявку покупатель
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(400).json({ message: "Заявка не найдена" });
    }

    if (application.user !== id) {
      // Если завершает не покупатель, просто переходим к следующему middleware
      return next();
    }

    // Проверка активности покупателя за последние 24 часа
    const last24Hours = Date.now() - 24 * 3600 * 1000;
    const recentTransactions = await Application.find({
      user: id,
      seller: application.seller,
      status: "COMPLETED",
      createdAt: { $gte: last24Hours },
    });

    if (recentTransactions.length >= 3) {
      // Пометка пользователя как подозрительного
      await User.updateOne({ _id: id }, { isSuspicious: true });

      // Исключение всех отзывов этого пользователя из рейтинга
      await Application.updateMany(
        { user: id, status: "COMPLETED" },
        { isExcludedFromRating: true }
      );

      // Обновление рейтинга продавца
      const seller = await User.findById(application.seller);
      if (seller) {
        const sellerApplications = await Application.find({
          seller: seller._id,
          status: "COMPLETED",
          isExcludedFromRating: false,
        });

        const totalRating = sellerApplications.reduce(
          (sum, app) => sum + (app.rating.buyer || 0),
          0
        );
        const ratingCount = sellerApplications.length;

        seller.ratings.average = ratingCount ? totalRating / ratingCount : 0;
        seller.ratings.count = ratingCount;

        await seller.save();
      }

      return res.status(400).json({
        message:
          "Подозрительная активность обнаружена. Ваши действия временно ограничены до завершения модерации.",
      });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Ошибка" });
  }
};
