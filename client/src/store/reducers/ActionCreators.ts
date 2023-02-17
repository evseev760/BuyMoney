import { AppDispatch } from "../";
import axios from "axios";
import api from "../api";
import { userSlice } from "./UserSlice";
import { authSlice } from "./AuthSlice";
import { chatSlice } from "./ChatSlice";

import { API_URL } from "../../config";
import { IChat } from "../../models/IChat";
import { IChatCreateData } from "../../pages/Chat/CreateChatModal";
import { IMessage } from "../../models/IMessage";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.usersFetching());
    const response = await axios.get<any>(`${API_URL}${api.auth.users}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(userSlice.actions.usersFetchingSuccess(response.data));
  } catch (e: any) {
    dispatch(userSlice.actions.usersFetchingError(e.message));
  }
};

//AUTH BEGIN.............................................................
export const fetchAuth = (navigate: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());

    const response = await axios.get<any>(`${API_URL}${api.auth.auth}`, auth());
    dispatch(authSlice.actions.authSuccess(response.data.user));
    localStorage.setItem("token", response.data.token);
    navigate("/");
  } catch (e: any) {
    dispatch(authSlice.actions.authError(""));
    navigate("/login");
  }
};
export const fetchRegistration =
  (data: { username: string; password: string }, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.registrationFetching());
      const response = await axios.post(
        `${API_URL}${api.auth.registration}`,
        data
      );
      dispatch(authSlice.actions.registrationSuccess(response.data));
      navigate("/login");
    } catch (e: any) {
      dispatch(authSlice.actions.registrationError(e.response.data.message));
    }
  };

export const fetchLogin =
  (data: { username: string; password: string }, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.loginFetching());
      const response = await axios.post<any>(
        `${API_URL}${api.auth.login}`,
        data
      );
      dispatch(authSlice.actions.authSuccess(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (e: any) {
      dispatch(authSlice.actions.authError(e.response.data.message));
    }
  };

export const logOut = (navigate: any) => (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logout());
  localStorage.removeItem("token");
  navigate("/login");
};
// AUTH END........................................................
//CHATS BEGIN......................................................

export const fetchChats = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(chatSlice.actions.chatsFetching());
    const response = await axios.get<IChat[]>(
      `${API_URL}${api.chat.getChats}`,
      auth()
    );
    dispatch(chatSlice.actions.chatsSuccess(response.data));
  } catch (e: any) {
    dispatch(chatSlice.actions.chatsError(e.response.data.message));
  }
};
export const createChat =
  (data: IChatCreateData, callback: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(chatSlice.actions.createChatFetching());
      const response = await axios.post<any>(
        `${API_URL}${api.chat.createChat}`,
        data,
        auth()
      );
      dispatch(chatSlice.actions.createChatSuccess(response.data));
      // dispatch(fetchChats());
      callback();
    } catch (e: any) {
      dispatch(chatSlice.actions.createChatError(e.response.data.message));
    }
  };
export const fetchChat = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(chatSlice.actions.chatFetching());
    const response = await axios.get<IChat>(
      `${API_URL}${api.chat.getChat}/${id}`,
      auth()
    );
    dispatch(chatSlice.actions.chatSuccess(response.data));
  } catch (e: any) {
    dispatch(chatSlice.actions.chatError(e.response.data.message));
  }
};
export const fetchMessages =
  (id: string, callBack?: () => void) => async (dispatch: AppDispatch) => {
    console.log(5555, id);
    try {
      dispatch(chatSlice.actions.messagesFetching());
      const response = await axios.get<IMessage[]>(
        `${API_URL}${api.chat.getMessages}/${id}`,
        auth()
      );
      dispatch(chatSlice.actions.messagesSuccess(response.data));
      callBack && callBack();
    } catch (e: any) {
      dispatch(chatSlice.actions.messagesError(e.response.data.message));
    }
  };

export const addMessage =
  (data: { chatId: string; textMessage: string }, callBack?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(chatSlice.actions.addMessageFetching());
      const response = await axios.post<any>(
        `${API_URL}${api.chat.addMessage}`,
        data,
        auth()
      );
      dispatch(chatSlice.actions.addMessageSuccess(response.data));
      callBack && callBack();
      dispatch(fetchMessages(data.chatId));
    } catch (e: any) {
      dispatch(chatSlice.actions.addMessageError(e.response.data.message));
    }
  };
