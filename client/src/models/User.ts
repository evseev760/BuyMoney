export interface User {
  _id: string;
  username?: string;
  phoneNumber?: string;
  avatar: string;
  isSuspicious: boolean;
  languageCode: string;
  nickname: string;
  ratings: {
    average: number;
    count: number;
  };
  reviews?: any[];
  isAnOffice: boolean;
  delivery: {
    isDelivered: boolean;
    distance?: number;
  };
}
