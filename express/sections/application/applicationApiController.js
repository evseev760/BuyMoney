const Application = require("../../models/Application");
const {
  sendApplicationStatusUpdate,
  notifyNewApplication,
  sendDeliteApplication,
} = require("../../socketHandler");
const User = require("../../models/User");
const {
  sendApplicationMessage,
  editApplicationMessage,
  deliteApplicationMessage,
} = require("../../utils/telegramUtils");

const telegramBot = require("../../telegramBot");
const updateUserRating = require("../../utils/updateUserRating");
const {
  applicationWithPartner,
} = require("../../utils/applicationWithPartner");

const { validationResult } = require("express-validator");
const ApplicationStatus = {
  NEW: "NEW",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CONFIRMATION: "CONFIRMATION",
};

class applicationApiController {
  async createApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const {
        quantity,
        currency,
        forPayment,
        paymentMethod,
        offerId,
        price,
        seller,
      } = req.body;
      const { id, name } = req.user;
      // console.log(444, req.user);
      const buyerUser = await User.findOne({ _id: id });
      const newApplication = {
        quantity,
        user: id,
        username: buyerUser.username,
        offerId,
        createdAt: Date.now(),
        currency,
        forPayment,
        paymentMethod,
        price,
        seller,
        status: ApplicationStatus.NEW,
      };

      const application = new Application(newApplication);
      await application.save();
      const sellerUser = await User.findOne({ _id: seller });
      const updatedApplication = await applicationWithPartner(application);
      notifyNewApplication(application);

      await sendApplicationMessage(
        telegramBot,
        application,
        sellerUser,
        buyerUser
      );

      res.json(updatedApplication);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async getMyApplications(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }

      const { id } = req.user;

      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(400).json({ message: "Юзер не найден", errors });
      }
      const applications = await Application.find({
        $or: [{ user: id }, { seller: id }],
      });
      const applicationsWithPartner = await Promise.all(
        applications.map(async (application) => {
          return await applicationWithPartner(application, id);
        })
      );
      const statusOrder = {
        NEW: 1,
        PENDING: 2,
        CONFIRMATION: 3,
        COMPLETED: 4,
      };

      applicationsWithPartner.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
      });
      res.json(applicationsWithPartner);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  acceptApplication = async (req, res) => {
    const { applicationId } = req.body;
    const userId = req.user.id;

    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(400).json({ message: "Заявка не найдена" });
      }

      // Проверяем, что статус заявки является NEW
      if (application.status !== "NEW") {
        return res.status(400).json({ message: "Заявка не в статусе NEW" });
      }

      // Проверяем, что текущий пользователь является продавцом в этой заявке
      if (application.seller !== userId) {
        return res
          .status(403)
          .json({ message: "Вы не являетесь продавцом этой заявки" });
      }

      // Обновляем статус заявки на PENDING
      application.status = "PENDING";
      await application.save();

      sendApplicationStatusUpdate(application);

      const buyerUser = await User.findOne({ _id: application.user });
      const sellerUser = await User.findOne({ _id: application.seller });

      await editApplicationMessage(
        telegramBot,
        application,
        buyerUser,
        sellerUser
      );

      res.status(200).json({ message: "accepted" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
  completeApplication = async (req, res) => {
    try {
      const { applicationId, rating } = req.body;
      const userId = req.user.id;

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(400).json({ message: "Заявка не найдена" });
      }

      // Проверка статуса заявки и выставление оценок
      if (application.status === "COMPLETED") {
        return res.status(400).json({ message: "Заявка уже завершена" });
      }

      if (application.status === "PENDING") {
        if (application.user === userId) {
          application.rating.buyer = rating;
          application.status = "CONFIRMATION";
        } else if (application.seller === userId) {
          application.rating.seller = rating;
          application.status = "CONFIRMATION";
        } else {
          return res
            .status(403)
            .json({ message: "Вы не являетесь участником этой заявки" });
        }
      } else if (application.status === "CONFIRMATION") {
        if (application.user === userId) {
          application.rating.buyer = rating;
          application.status = "COMPLETED";
        } else if (application.seller === userId) {
          application.rating.seller = rating;
          application.status = "COMPLETED";
        } else {
          return res
            .status(403)
            .json({ message: "Вы не являетесь участником этой заявки" });
        }
      }
      if (req.user.isSuspicious) {
        application.isExcludedFromRating = true;
      }

      await application.save();

      // Обновляем рейтинг пользователя только если заявка не исключена
      if (!application.isExcludedFromRating) {
        if (application.status === "COMPLETED") {
          if (application.rating.buyer) {
            await updateUserRating(
              application.seller,
              application.rating.buyer
            );
          }
          if (application.rating.seller) {
            await updateUserRating(application.user, application.rating.seller);
          }
        }
      }
      const sellerUser = await User.findOne({
        _id:
          application.user === userId ? application.seller : application.user,
      });
      const message =
        application.status === "CONFIRMATION"
          ? `${
              application.user === userId ? "Покупатель" : "Продавец"
            } подтвердил сделку! Оставьте отзыв и вы 😊`
          : application.status === "COMPLETED"
          ? `${
              application.user === userId ? "Покупатель" : "Продавец"
            } подтвердил сделку! Заявка переведена в завершенные!`
          : undefined;
      // const applicationWithPartnerData = await applicationWithPartner(
      //   application,
      //   userId
      // );
      sendApplicationStatusUpdate(application);
      message &&
        telegramBot.sendMessage(sellerUser.telegramId, message, {
          // reply_markup: {
          //   inline_keyboard: [
          //     [
          //       {
          //         text: "👍 Принять заявку",
          //         callback_data: `${application._id}`,
          //       },
          //     ],
          //   ],
          // },
        });
      res.status(200).json({ message: "complited" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
  deliteApplication = async (req, res) => {
    const { applicationId } = req.body;
    const userId = req.user.id;

    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(400).json({ message: "Заявка не найдена" });
      }

      // Проверяем, что текущий пользователь является либо покупателем, либо продавцом в этой заявке
      if (application.user !== userId && application.seller !== userId) {
        return res
          .status(403)
          .json({ message: "Вы не имеете прав для удаления этой заявки" });
      }

      await application.remove();
      sendDeliteApplication(application, applicationId);
      const buyerUser = await User.findOne({ _id: application.user });
      const sellerUser = await User.findOne({ _id: application.seller });
      deliteApplicationMessage(telegramBot, application, buyerUser, sellerUser);

      res.status(200).json({ message: "Заявка успешно удалена" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
}

module.exports = new applicationApiController();
