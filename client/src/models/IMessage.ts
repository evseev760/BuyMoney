import { IUser } from "./IUser";

export interface IMessage {
  textMessage: string;
  user: IUser;
  chat: string;
  createdAt: number;
  id: string;
}
