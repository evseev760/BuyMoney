import { IRole } from "./IRole";

export interface ICurrentUser {
  id?: any;
  _id: string;
  username: string;
  roles: IRole[];
  email?: string;
  avatar?: string;
}
