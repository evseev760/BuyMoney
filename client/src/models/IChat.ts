import { IUser } from "./IUser";
import { IMessage } from "./IMessage";

export interface IChat {
  chatName: string;
  description: string;
  mainUser: IUser;
  mainUsername?: string;
  messages: IMessage[];
  users: IUser[];
  _id: string;
}
