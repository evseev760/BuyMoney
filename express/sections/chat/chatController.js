const User = require("../../models/User");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");

const { validationResult } = require("express-validator");

class authController {
  async createChat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при создании чата", errors });
      }
      const { chatName, users = [], description } = req.body;
      // const description = "Ddescription CHAT!!!!!";
      // const chatName = "newChat32";
      // const users = ["63e92bf646acb84204b38e5d"];

      const candidate = await Chat.findOne({ chatName });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Чат с таким названием уже существует" });
      }

      const chat = new Chat({
        mainUser: req.user.id,
        chatName,
        description,
        users: [...users, req.user.id],
        messages: [],
      });
      await chat.save();
      return res.json({ message: "Чат успешно создан", chatId: chat._id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chats create error", err: e });
    }
  }
  async getChats(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса чатов", errors });
      }
      const chats = await Chat.find();
      res.json(chats);
    } catch (e) {
      console.log(e);
    }
  }
  async getChat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса чатов", errors });
      }
      const chat = await Chat.findOne({ _id: req.params.chatId });
      if (!chat) {
        return res.status(400).json({ message: "Чат не найден", errors });
      }

      const messages = chat.messages.length
        ? await Message.find({
            $or: chat.messages.map((id) => ({ _id: id })),
          })
        : [];
      const users = chat.users.length
        ? await User.find(
            {
              $or: chat.users.map((id) => ({ _id: id })),
            },
            { password: false }
          )
        : [];
      const mainUser = await User.findOne(
        { _id: chat.mainUser },
        { password: false }
      );
      if (!chat.users.includes(req.user.id)) {
        await Chat.updateOne(
          { _id: req.params.chatId },
          { $push: { users: req.user.id } }
        );
      }
      res.json({
        chatName: chat.chatName,
        description: chat.description,
        mainUser,
        messages,
        users,
        _id: chat._id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getMessages(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса чатов", errors });
      }
      const messages = await Message.find({ chat: req.params.chatId });

      res.json(messages);
    } catch (e) {
      console.log(e);
    }
  }

  async addMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при создании чата", errors });
      }
      const { chatId, textMessage } = req.body;

      // const chat = "63ed15f6e2aab04f8c3360ee";
      // const textMessage = "Texteees !!!!!?";

      const user = await User.findOne({ _id: req.user.id });
      // const chat = await Chats.findOne({ _id: chatId });

      const message = new Message({
        user: user._id,
        username: user.username,
        textMessage,
        chat: chatId,
      });
      await message.save();

      await Chat.updateOne(
        { _id: chatId },
        { $push: { messages: message._id } }
      );
      return res.json({ message: "Сообщение отправлено" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Message error", err: e });
    }
  }
}

module.exports = new authController();
