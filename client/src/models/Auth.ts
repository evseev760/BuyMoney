import { IRole } from "./IRole";

export interface CurrentUser {
  id: string;
  username?: string;
  phoneNumber?: string;
  roles: IRole[];
  avatar: string;
  isSuspicious: boolean;
  nickname: string;
  isAnOffice: boolean;
  languageCode?: string;
  delivery: {
    isDelivered: boolean;
    distance?: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  location?: {
    City: string;
    Country: string;
    coordinates: number[];
    type: string;
  };
  disableTrading: boolean;
}

export interface UpdateUserData {
  isAnOffice: boolean;
  delivery: {
    isDelivered: boolean;
    distance?: number;
  };
}
