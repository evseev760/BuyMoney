import { IRole } from "./IRole";

export interface CurrentUser {
  id: string;
  username: string;
  roles: IRole[];
  avatar: string;
  isSuspicious: boolean;
  nickname: string;
  isAnOffice: boolean;
  delivery: {
    isDelivered: boolean;
    distance?: number;
  };
  ratings: {
    average: number;
    count: number;
  };
}

export interface UpdateUserData {
  isAnOffice: boolean;
  delivery: {
    isDelivered: boolean;
    distance?: number;
  };
}
