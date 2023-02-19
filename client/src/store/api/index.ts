interface IApi {
  auth: {
    auth: string;
    registration: string;
    login: string;
    users: string;
  };
  chat: {
    createChat: string;
    getChats: string;
    getChat: string;
    addMessage: string;
    getMessages: string;
  };
}
export const api: IApi = {
  auth: {
    auth: "auth/auth",
    registration: "auth/registration",
    login: "auth/login",
    users: "auth/users",
  },
  chat: {
    createChat: "chat/createChat",
    getChats: "chat/getChats",
    getChat: "chat/getChat",
    addMessage: "chat/addMessage",
    getMessages: "chat/getMessages",
  },
};
