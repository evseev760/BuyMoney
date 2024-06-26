const mongoose = require("mongoose");
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
        distance,
      } = req.body;
      const { id, name } = req.user;
      const buyerUser = await User.findOne({ _id: id });
      const existingApplication = await Application.findOne({
        currency,
        offerId,
        forPayment,
        seller,
        status: { $ne: ApplicationStatus.COMPLETED }, // Исключаем удаленные заявки
      });
      if (existingApplication) {
        return res.status(409).json({
          message: "У вас уже есть активная заявка с такими же параметрами",
        });
      }
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
        distance,
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

      if (application.status !== "NEW") {
        return res.status(400).json({ message: "Заявка не в статусе NEW" });
      }

      if (application.seller !== userId) {
        return res
          .status(403)
          .json({ message: "Вы не являетесь продавцом этой заявки" });
      }

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
      const { applicationId, rating, comment } = req.body;
      const userId = req.user.id;

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(400).json({ message: "Заявка не найдена" });
      }

      if (application.status === "COMPLETED") {
        return res.status(400).json({ message: "Заявка уже завершена" });
      }

      if (application.status === "PENDING") {
        if (application.user === userId) {
          application.rating.buyer = rating;
          application.comment.buyer = comment;
          application.status = "CONFIRMATION";
        } else if (application.seller === userId) {
          application.rating.seller = rating;
          application.comment.seller = comment;
          application.status = "CONFIRMATION";
        } else {
          return res
            .status(403)
            .json({ message: "Вы не являетесь участником этой заявки" });
        }
      } else if (application.status === "CONFIRMATION") {
        if (application.user === userId) {
          application.rating.buyer = rating;
          application.comment.buyer = comment;
          application.status = "COMPLETED";
        } else if (application.seller === userId) {
          application.rating.seller = rating;
          application.comment.seller = comment;
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

      if (!application.isExcludedFromRating) {
        if (application.status === "COMPLETED") {
          if (application.rating.buyer) {
            await updateUserRating(
              application.seller,
              application.rating.buyer
            );
          }
          if (application.rating.seller) {
            await updateUserRating(application.user);
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

      sendApplicationStatusUpdate(application);
      message && telegramBot.sendMessage(sellerUser.telegramId, message);
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
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
  getCommentsByUserId = async (req, res) => {
    const userId = req.query.userId;
    try {
      const applications = await Application.find({
        $or: [{ user: userId }, { seller: userId }],
        isExcludedFromRating: { $ne: true },
        status: "COMPLETED",
      })
        .populate("user seller", "nickname avatar ratings")
        .sort({ updatedAt: -1 });

      const comments = applications
        .map((application) => {
          let otherUser;
          let grade;
          let comment;

          if (application.user._id.toString() === userId) {
            otherUser = application.seller;
            grade = application.rating.seller;
            comment = application.comment.seller;
          } else {
            otherUser = application.user;
            grade = application.rating.buyer;
            comment = application.comment.buyer;
          }

          return {
            grade: grade,
            comment: comment,
            nickname: otherUser.nickname,
            avatar: otherUser.avatar,
            ratings: otherUser.ratings,
            updatedAt: application.updatedAt,
          };
        })
        ?.filter((application) => application.grade);

      res.status(200).json(comments);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
  getMyComments = async (req, res) => {
    const userId = req.user.id;

    try {
      const applications = await Application.find({
        $or: [{ user: userId }, { seller: userId }],
        isExcludedFromRating: { $ne: true },
        status: "COMPLETED",
      })
        .populate("user seller", "nickname avatar ratings")
        .sort({ updatedAt: -1 });

      const comments = applications
        .map((application) => {
          let otherUser;
          let grade;
          let comment;

          if (application.user._id.toString() === userId) {
            otherUser = application.seller;
            grade = application.rating.seller;
            comment = application.comment.seller;
          } else {
            otherUser = application.user;
            grade = application.rating.buyer;
            comment = application.comment.buyer;
          }

          return {
            grade: grade,
            comment: comment,
            nickname: otherUser.nickname,
            avatar: otherUser.avatar,
            ratings: otherUser.ratings,
            updatedAt: application.updatedAt,
          };
        })
        ?.filter((application) => application.grade);

      res.status(200).json(comments);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
}

module.exports = new applicationApiController();
