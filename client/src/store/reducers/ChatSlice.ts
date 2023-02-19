import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../models/IChat";

import { IMessage } from "../../models/IMessage";

interface IChatState {
  chats: IChat[];
  chatsIsLoading: boolean;
  chatIsLoading: boolean;
  createChatIsLoading: boolean;
  error: string;
  currentChat: string;
  currentChatData: IChat;
  message: string;
}
const emptyChatData: IChat = {
  chatName: "",
  description: "",
  mainUser: { username: "", _id: "", roles: [] },
  messages: [],
  users: [],
  _id: "",
};

const initialState: IChatState = {
  chats: [],
  chatsIsLoading: false,
  chatIsLoading: false,
  createChatIsLoading: false,
  currentChat: window.location.pathname.split("/")[1] || "",
  error: "",
  message: "",
  currentChatData: emptyChatData,
};

export const chatSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    chatsFetching: (state) => {
      state.chatsIsLoading = true;
    },
    chatsSuccess: (state, action: PayloadAction<IChat[]>) => {
      state.chatsIsLoading = false;
      state.chats = action.payload;
      state.error = "";
    },
    chatsError: (state, action: PayloadAction<string>) => {
      state.chatsIsLoading = false;
      state.error = action.payload;
    },

    createChatFetching: (state) => {
      state.createChatIsLoading = true;
    },
    createChatSuccess: (
      state,
      action: PayloadAction<{ chatId: string; message: string }>
    ) => {
      state.createChatIsLoading = false;
      state.currentChat = action.payload.chatId;
      state.message = action.payload.message;
      state.error = "";
    },
    createChatError: (state, action: PayloadAction<string>) => {
      state.createChatIsLoading = false;
      state.error = action.payload;
    },

    chatFetching: (state) => {
      state.chatIsLoading = true;
    },
    chatSuccess: (state, action: PayloadAction<IChat>) => {
      state.chatIsLoading = false;
      state.currentChatData = action.payload;
      state.currentChat = action.payload._id;
      state.error = "";
    },
    chatError: (state, action: PayloadAction<string>) => {
      state.chatIsLoading = false;
      state.error = action.payload;
    },

    messagesFetching: (state) => {},
    messagesSuccess: (state, action: PayloadAction<IMessage[]>) => {
      state.currentChatData.messages = action.payload;
    },
    messagesError: (state, action: PayloadAction<string>) => {},

    addMessageFetching: (state) => {},
    addMessageSuccess: (state, action: PayloadAction<any>) => {},
    addMessageError: (state, action: PayloadAction<string>) => {},

    leaveTheChat: (state) => {
      state.currentChatData = emptyChatData;
    },
  },
});

export default chatSlice.reducer;
