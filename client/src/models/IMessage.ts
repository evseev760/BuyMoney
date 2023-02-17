import { IUser } from "./IUser";

export interface IMessage {
  textMessage: string;
  user: IUser;
  chat: string;
  createdAt: string;
  _id: string;
}
