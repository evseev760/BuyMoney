import { IRole } from "./IRole";

export interface IUser {
  _id: string;
  username: string;
  roles: IRole[];
}
