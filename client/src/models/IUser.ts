import { IRole } from "./IRole";

export interface IUser {
  id: string;
  username: string;
  roles: IRole[];
}
